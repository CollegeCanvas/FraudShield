import https from 'node:https';
import dns from 'node:dns/promises';
import { URL } from 'node:url';

// ─── API Key Helpers ─────────────────────────────────────────────────────────
const getKey = (name) => process.env[name] || '';

// ─── 1. DNS Resolution ──────────────────────────────────────────────────────
async function checkDNS(hostname) {
    try {
        const addresses = await dns.resolve4(hostname).catch(() => []);
        const ipv6 = await dns.resolve6(hostname).catch(() => []);
        const mx = await dns.resolveMx(hostname).catch(() => []);
        const ns = await dns.resolveNs(hostname).catch(() => []);
        const txt = await dns.resolveTxt(hostname).catch(() => []);

        if (addresses.length === 0 && ipv6.length === 0) {
            return {
                status: 'no_records',
                ip: null,
                allIPs: [],
                ipv6: [],
                mx: [],
                ns: [],
                txt: [],
                score: 2,
                message: 'No DNS records found — domain may not exist',
            };
        }

        return {
            status: 'resolved',
            ip: addresses[0] || ipv6[0] || null,
            allIPs: addresses,
            ipv6,
            mx: mx.map((r) => r.exchange),
            ns,
            txt: txt.flat(),
            score: 10,
        };
    } catch (err) {
        return {
            status: 'failed',
            ip: null,
            allIPs: [],
            ipv6: [],
            mx: [],
            ns: [],
            txt: [],
            error: err.code === 'ENOTFOUND' ? 'Domain does not exist' : err.message,
            score: 0,
        };
    }
}

// ─── 2. SSL / TLS Certificate ────────────────────────────────────────────────
async function checkSSL(hostname) {
    const tls = await import('node:tls');
    return new Promise((resolve) => {
        const socket = tls.connect(
            { host: hostname, port: 443, rejectUnauthorized: false, servername: hostname, timeout: 8000 },
            () => {
                try {
                    const cert = socket.getPeerCertificate();
                    const authorized = socket.authorized;

                    if (!cert || !cert.subject) {
                        socket.destroy();
                        resolve({ status: 'no_certificate', valid: false, score: 0 });
                        return;
                    }

                    const validTo = new Date(cert.valid_to);
                    const validFrom = new Date(cert.valid_from);
                    const now = new Date();
                    const daysUntilExpiry = Math.floor((validTo - now) / 86400000);
                    const isExpired = daysUntilExpiry < 0;

                    let score = 0;
                    if (authorized && !isExpired) score = daysUntilExpiry < 30 ? 15 : 20;
                    else if (!authorized && !isExpired) score = 8;

                    socket.destroy();
                    resolve({
                        status: authorized ? 'valid' : 'invalid',
                        valid: authorized,
                        issuer: cert.issuer?.O || cert.issuer?.CN || 'Unknown',
                        subject: cert.subject?.CN || hostname,
                        validFrom: validFrom.toISOString(),
                        validTo: validTo.toISOString(),
                        daysUntilExpiry,
                        isExpired,
                        protocol: socket.getProtocol?.() || 'unknown',
                        serialNumber: cert.serialNumber || '',
                        fingerprint: cert.fingerprint256?.substring(0, 23) || '',
                        score,
                    });
                } catch (e) {
                    socket.destroy();
                    resolve({ status: 'error', valid: false, score: 0, error: e.message });
                }
            }
        );
        socket.on('timeout', () => { socket.destroy(); resolve({ status: 'timeout', valid: false, score: 0, error: 'Connection timed out' }); });
        socket.on('error', (e) => { socket.destroy(); resolve({ status: 'error', valid: false, score: 0, error: e.message }); });
    });
}


// ─── 3. Google Safe Browsing ─────────────────────────────────────────────────
async function checkSafeBrowsing(url) {
    const key = getKey('GOOGLE_SAFE_BROWSING_KEY');
    if (!key) return { status: 'skipped', safe: true, threats: [], score: 30, message: 'API key not configured' };

    try {
        const res = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client: { clientId: 'fraudshield', clientVersion: '1.0.0' },
                threatInfo: {
                    threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
                    platformTypes: ['ANY_PLATFORM'],
                    threatEntryTypes: ['URL'],
                    threatEntries: [{ url }],
                },
            }),
            signal: AbortSignal.timeout(8000),
        });

        const data = await res.json();
        const threats = data.matches || [];

        return {
            status: 'checked',
            safe: threats.length === 0,
            threats: threats.map((t) => ({ type: t.threatType, platform: t.platformType })),
            score: threats.length === 0 ? 30 : 0,
        };
    } catch (err) {
        return { status: 'error', safe: true, threats: [], score: 25, error: err.message };
    }
}

// ─── 4. VirusTotal ───────────────────────────────────────────────────────────
async function checkVirusTotal(url) {
    const key = getKey('VIRUS_TOTAL_KEY');
    if (!key) return { status: 'skipped', safe: true, positives: 0, total: 0, score: 25, message: 'API key not configured' };

    try {
        const urlId = Buffer.from(url).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        const res = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
            headers: { 'x-apikey': key },
            signal: AbortSignal.timeout(10000),
        });

        if (res.status === 404) {
            // URL not yet scanned — submit it
            const submitRes = await fetch('https://www.virustotal.com/api/v3/urls', {
                method: 'POST',
                headers: { 'x-apikey': key, 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `url=${encodeURIComponent(url)}`,
                signal: AbortSignal.timeout(8000),
            });

            if (submitRes.ok) {
                return { status: 'submitted', safe: true, positives: 0, total: 0, score: 20, message: 'URL submitted for first-time analysis' };
            }
            return { status: 'unknown', safe: true, positives: 0, total: 0, score: 20 };
        }

        if (res.status === 429) {
            return { status: 'rate_limited', safe: true, positives: 0, total: 0, score: 20, message: 'VirusTotal rate limit reached' };
        }

        const data = await res.json();
        const stats = data.data?.attributes?.last_analysis_stats || {};
        const positives = (stats.malicious || 0) + (stats.suspicious || 0);
        const total = Object.values(stats).reduce((a, b) => a + b, 0);

        let score = 25;
        if (positives > 5) score = 0;
        else if (positives > 2) score = 8;
        else if (positives > 0) score = 15;

        const results = data.data?.attributes?.last_analysis_results || {};
        const flaggedBy = Object.entries(results)
            .filter(([, v]) => v.category === 'malicious' || v.category === 'suspicious')
            .map(([name, v]) => ({ engine: name, category: v.category, result: v.result }))
            .slice(0, 10);

        return {
            status: 'checked',
            safe: positives === 0,
            positives,
            total,
            harmless: stats.harmless || 0,
            malicious: stats.malicious || 0,
            suspicious: stats.suspicious || 0,
            undetected: stats.undetected || 0,
            flaggedBy,
            score,
        };
    } catch (err) {
        return { status: 'error', safe: true, positives: 0, total: 0, score: 20, error: err.message };
    }
}

// ─── 5. WHOIS / Domain Age ───────────────────────────────────────────────────
async function checkWHOIS(hostname) {
    const key = getKey('WHOIS_KEY');
    if (!key) return { status: 'skipped', score: 5, message: 'API key not configured' };

    const parts = hostname.split('.');
    const domain = parts.length > 2 ? parts.slice(-2).join('.') : hostname;

    try {
        const res = await fetch(
            `https://api.whoisfreaks.com/v1.0/whois?apiKey=${key}&whois=live&domainName=${domain}`,
            { signal: AbortSignal.timeout(8000) }
        );
        const data = await res.json();

        const createdDate = data.create_date || data.domain_registered || null;
        const expiresDate = data.expiry_date || null;
        const registrar = data.domain_registrar?.registrar_name || data.registrar_name || 'Unknown';
        const registrant = data.registrant_contact?.company || data.registrant_contact?.name || null;

        let domainAge = null;
        let score = 5;

        if (createdDate) {
            const created = new Date(createdDate);
            domainAge = Math.floor((Date.now() - created.getTime()) / 86400000);
            if (domainAge > 365 * 2) score = 10;
            else if (domainAge > 365) score = 8;
            else if (domainAge > 180) score = 6;
            else if (domainAge > 30) score = 4;
            else score = 1; // brand-new domain = suspicious
        }

        const domainAgeText =
            domainAge !== null
                ? domainAge > 365
                    ? `${Math.floor(domainAge / 365)} years`
                    : domainAge > 30
                        ? `${Math.floor(domainAge / 30)} months`
                        : `${domainAge} days`
                : 'Unknown';

        return {
            status: 'checked',
            registrar,
            registrant,
            createdDate,
            expiresDate,
            domainAge,
            domainAgeText,
            nameServers: data.name_servers || [],
            score,
        };
    } catch (err) {
        return { status: 'error', score: 5, error: err.message };
    }
}

// ─── 6. Security Headers ────────────────────────────────────────────────────
async function checkHeaders(url) {
    try {
        const res = await fetch(url, {
            method: 'HEAD',
            redirect: 'follow',
            signal: AbortSignal.timeout(8000),
        });

        const hdrs = {};
        res.headers.forEach((v, k) => { hdrs[k.toLowerCase()] = v; });

        const securityHeaders = {
            'content-security-policy': { present: !!hdrs['content-security-policy'], label: 'Content Security Policy' },
            'x-frame-options': { present: !!hdrs['x-frame-options'], label: 'X-Frame-Options' },
            'x-content-type-options': { present: !!hdrs['x-content-type-options'], label: 'X-Content-Type-Options' },
            'strict-transport-security': { present: !!hdrs['strict-transport-security'], label: 'HSTS (Strict Transport)' },
            'x-xss-protection': { present: !!hdrs['x-xss-protection'], label: 'XSS Protection' },
            'referrer-policy': { present: !!hdrs['referrer-policy'], label: 'Referrer Policy' },
            'permissions-policy': { present: !!hdrs['permissions-policy'], label: 'Permissions Policy' },
        };

        const presentCount = Object.values(securityHeaders).filter((h) => h.present).length;
        const totalCount = Object.keys(securityHeaders).length;
        const score = Math.round((presentCount / totalCount) * 15);

        return {
            status: 'checked',
            statusCode: res.status,
            redirected: res.redirected,
            finalUrl: res.url,
            server: hdrs['server'] || 'Unknown',
            poweredBy: hdrs['x-powered-by'] || null,
            securityHeaders,
            presentCount,
            totalCount,
            score,
        };
    } catch (err) {
        return { status: 'error', score: 5, error: err.message, securityHeaders: {}, presentCount: 0, totalCount: 7 };
    }
}

// ─── Main Analysis Function ──────────────────────────────────────────────────
export async function analyzeUrl({ url }) {
    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) normalizedUrl = 'https://' + normalizedUrl;

    let parsedUrl;
    try {
        parsedUrl = new URL(normalizedUrl);
    } catch {
        throw new Error('Invalid URL format. Please enter a valid website address.');
    }

    const hostname = parsedUrl.hostname;

    // Run ALL checks in parallel for speed
    const [dnsR, sslR, gsbR, vtR, whoisR, hdrR] = await Promise.allSettled([
        checkDNS(hostname),
        checkSSL(hostname),
        checkSafeBrowsing(normalizedUrl),
        checkVirusTotal(normalizedUrl),
        checkWHOIS(hostname),
        checkHeaders(normalizedUrl),
    ]);

    const val = (r, fallbackScore = 0) =>
        r.status === 'fulfilled' ? r.value : { status: 'error', score: fallbackScore, error: r.reason?.message };

    const checks = {
        dns: val(dnsR, 0),
        ssl: val(sslR, 0),
        safeBrowsing: val(gsbR, 25),
        virusTotal: val(vtR, 20),
        whois: val(whoisR, 5),
        headers: val(hdrR, 5),
    };

    // ── Composite Score (max 100) ──
    // Weights: Safe Browsing 30 · VirusTotal 25 · SSL 20 · Headers 15 · WHOIS 10
    const overallScore =
        checks.safeBrowsing.score +
        checks.virusTotal.score +
        checks.ssl.score +
        checks.headers.score +
        checks.whois.score;

    let verdict = 'safe';
    if (overallScore < 50) verdict = 'dangerous';
    else if (overallScore < 75) verdict = 'suspicious';

    // Hard overrides
    if (checks.safeBrowsing.threats?.length > 0) verdict = 'dangerous';
    if ((checks.virusTotal.positives || 0) > 3) verdict = 'dangerous';
    if (checks.dns.status === 'failed') verdict = 'dangerous';

    return { url: normalizedUrl, hostname, scanDate: new Date().toISOString(), overallScore, verdict, checks };
}

// ─── Netlify Function Handler ────────────────────────────────────────────────
export const handler = async (event) => {
    const cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: cors };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: 'Method Not Allowed' };

    try {
        const { url } = JSON.parse(event.body || '{}');
        if (!url) return { statusCode: 400, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: 'URL is required' }) };

        const result = await analyzeUrl({ url });
        return { statusCode: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify(result) };
    } catch (err) {
        return { statusCode: 500, headers: { ...cors, 'Content-Type': 'application/json' }, body: JSON.stringify({ error: err.message }) };
    }
};
