import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Search, Lock, Globe, AlertTriangle, CheckCircle2,
    XCircle, Clock, Server, RotateCcw, ShieldCheck, ShieldAlert,
    ShieldX, Loader2, ArrowRight, ExternalLink, ChevronDown,
    ChevronUp, Fingerprint, Activity, Wifi, Database, FileWarning,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface AnalysisResult {
    url: string;
    hostname: string;
    scanDate: string;
    overallScore: number;
    verdict: 'safe' | 'suspicious' | 'dangerous';
    checks: {
        dns: any;
        ssl: any;
        safeBrowsing: any;
        virusTotal: any;
        whois: any;
        headers: any;
    };
}

type Phase = 'idle' | 'scanning' | 'results' | 'error';

// ─── Scan-step definitions ───────────────────────────────────────────────────
const SCAN_STEPS = [
    { label: 'Resolving DNS records…', icon: Globe },
    { label: 'Verifying SSL certificate…', icon: Lock },
    { label: 'Checking Google Safe Browsing…', icon: Shield },
    { label: 'Scanning VirusTotal engines…', icon: Database },
    { label: 'Analyzing domain registration…', icon: Clock },
    { label: 'Inspecting security headers…', icon: Server },
    { label: 'Generating threat report…', icon: Activity },
];

// ─── Color helpers ───────────────────────────────────────────────────────────
const verdictConfig = {
    safe: { bg: 'bg-green-500/15', text: 'text-green-400', border: 'border-green-500/30', glow: 'shadow-green-500/20', label: 'Safe', Icon: ShieldCheck },
    suspicious: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30', glow: 'shadow-amber-500/20', label: 'Suspicious', Icon: ShieldAlert },
    dangerous: { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30', glow: 'shadow-red-500/20', label: 'Dangerous', Icon: ShieldX },
};

// ─── Animated score ring ─────────────────────────────────────────────────────
const ScoreRing: React.FC<{ score: number; verdict: string }> = ({ score, verdict }) => {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = verdict === 'safe' ? '#22c55e' : verdict === 'suspicious' ? '#f59e0b' : '#ef4444';

    return (
        <div className="relative w-28 h-28 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} fill="none" stroke="currentColor" className="text-white/10" strokeWidth="6" />
                <motion.circle
                    cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="6"
                    strokeLinecap="round" strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    className="text-2xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    {score}
                </motion.span>
                <span className="text-[10px] text-foreground/60 uppercase tracking-wider">/ 100</span>
            </div>
        </div>
    );
};

// ─── Single check-row for the results grid ───────────────────────────────────
const CheckRow: React.FC<{
    icon: React.ElementType;
    label: string;
    status: 'pass' | 'warn' | 'fail' | 'info';
    value: string;
    detail?: string;
    delay?: number;
}> = ({ icon: Icon, label, status, value, detail, delay = 0 }) => {
    const [open, setOpen] = useState(false);
    const statusColor =
        status === 'pass' ? 'text-green-400' :
            status === 'warn' ? 'text-amber-400' :
                status === 'fail' ? 'text-red-400' :
                    'text-blue-400';

    return (
        <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay }}
            className="group"
        >
            <div
                className={`flex items-center justify-between p-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all cursor-pointer ${detail ? '' : 'cursor-default'}`}
                onClick={() => detail && setOpen(!open)}
            >
                <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${status === 'pass' ? 'bg-green-500/15' :
                        status === 'warn' ? 'bg-amber-500/15' :
                            status === 'fail' ? 'bg-red-500/15' :
                                'bg-blue-500/15'
                        }`}>
                        <Icon className={`h-4 w-4 ${statusColor}`} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-foreground/50 truncate">{label}</p>
                        <p className={`text-sm font-medium truncate ${statusColor}`}>{value}</p>
                    </div>
                </div>
                {detail && (
                    <div className="ml-2 text-foreground/30">
                        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </div>
                )}
            </div>
            <AnimatePresence>
                {open && detail && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        <div className="px-3 py-2 ml-10 text-xs text-foreground/60 leading-relaxed whitespace-pre-wrap border-l-2 border-white/10">
                            {detail}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ─── Helper: build check rows from API result ────────────────────────────────
function buildCheckRows(checks: AnalysisResult['checks']) {
    const rows: Array<React.ComponentProps<typeof CheckRow>> = [];

    // DNS
    const d = checks.dns;
    rows.push({
        icon: Globe,
        label: 'DNS Resolution',
        status: d.status === 'resolved' ? 'pass' : d.status === 'no_records' ? 'warn' : 'fail',
        value: d.status === 'resolved' ? `Resolved → ${d.ip}` : d.error || 'Failed',
        detail: d.status === 'resolved'
            ? `IPv4: ${d.allIPs?.join(', ') || 'N/A'}\nIPv6: ${d.ipv6?.join(', ') || 'N/A'}\nMX: ${d.mx?.join(', ') || 'None'}\nNS: ${d.ns?.join(', ') || 'None'}`
            : d.error,
    });

    // SSL
    const s = checks.ssl;
    rows.push({
        icon: Lock,
        label: 'SSL / TLS Certificate',
        status: s.valid ? 'pass' : s.status === 'timeout' || s.status === 'error' ? 'warn' : 'fail',
        value: s.valid
            ? `Valid · ${s.issuer}`
            : s.isExpired
                ? 'Certificate Expired'
                : s.status === 'no_certificate'
                    ? 'No SSL Certificate'
                    : s.error || 'Invalid Certificate',
        detail: s.valid || s.issuer
            ? `Issuer: ${s.issuer || 'N/A'}\nSubject: ${s.subject || 'N/A'}\nProtocol: ${s.protocol || 'N/A'}\nValid From: ${s.validFrom ? new Date(s.validFrom).toLocaleDateString() : 'N/A'}\nExpires: ${s.validTo ? new Date(s.validTo).toLocaleDateString() : 'N/A'}\nDays Until Expiry: ${s.daysUntilExpiry ?? 'N/A'}\nSerial: ${s.serialNumber || 'N/A'}`
            : s.error,
    });

    // Google Safe Browsing
    const g = checks.safeBrowsing;
    rows.push({
        icon: Shield,
        label: 'Google Safe Browsing',
        status: g.safe ? 'pass' : 'fail',
        value: g.status === 'skipped'
            ? 'Skipped (no API key)'
            : g.safe
                ? 'No threats detected'
                : `${g.threats?.length || 0} threat(s) found`,
        detail: g.threats?.length
            ? `Threats:\n${g.threats.map((t: any) => `• ${t.type} (${t.platform})`).join('\n')}`
            : g.status === 'error' ? g.error : undefined,
    });

    // VirusTotal
    const v = checks.virusTotal;
    rows.push({
        icon: Database,
        label: 'VirusTotal Scan',
        status: v.positives === 0 ? 'pass' : v.positives <= 2 ? 'warn' : 'fail',
        value: v.status === 'checked'
            ? v.positives === 0
                ? `Clean — 0/${v.total} engines flagged`
                : `${v.positives}/${v.total} engines flagged`
            : v.status === 'submitted'
                ? 'First-time scan submitted'
                : v.status === 'rate_limited'
                    ? 'Rate limited — try later'
                    : v.status === 'skipped'
                        ? 'Skipped (no API key)'
                        : v.error || 'Error',
        detail: v.flaggedBy?.length
            ? `Flagged by:\n${v.flaggedBy.map((f: any) => `• ${f.engine}: ${f.result || f.category}`).join('\n')}\n\nBreakdown: Harmless ${v.harmless} · Malicious ${v.malicious} · Suspicious ${v.suspicious} · Undetected ${v.undetected}`
            : v.status === 'checked'
                ? `Harmless: ${v.harmless}\nMalicious: ${v.malicious}\nSuspicious: ${v.suspicious}\nUndetected: ${v.undetected}`
                : v.message || v.error,
    });

    // WHOIS
    const w = checks.whois;
    rows.push({
        icon: Clock,
        label: 'Domain Age & Registration',
        status: w.status === 'checked'
            ? (w.domainAge ?? 999) > 180 ? 'pass' : (w.domainAge ?? 999) > 30 ? 'warn' : 'fail'
            : 'info',
        value: w.status === 'checked'
            ? `${w.domainAgeText} · ${w.registrar}`
            : w.status === 'skipped'
                ? 'Skipped (no API key)'
                : w.error || 'Error',
        detail: w.status === 'checked'
            ? `Registrar: ${w.registrar || 'N/A'}\nRegistrant: ${w.registrant || 'N/A'}\nCreated: ${w.createdDate || 'N/A'}\nExpires: ${w.expiresDate || 'N/A'}\nDomain Age: ${w.domainAgeText || 'N/A'}\nName Servers: ${w.nameServers?.join(', ') || 'N/A'}`
            : w.error,
    });

    // Security Headers
    const h = checks.headers;
    rows.push({
        icon: Server,
        label: 'Security Headers',
        status: h.presentCount >= 5 ? 'pass' : h.presentCount >= 3 ? 'warn' : 'fail',
        value: h.status === 'checked'
            ? `${h.presentCount}/${h.totalCount} headers present`
            : h.error || 'Error',
        detail: h.securityHeaders
            ? Object.entries(h.securityHeaders)
                .map(([, v]: [string, any]) => `${v.present ? '✅' : '❌'} ${v.label}`)
                .join('\n') + (h.server ? `\n\nServer: ${h.server}` : '') + (h.poweredBy ? `\nPowered By: ${h.poweredBy}` : '') + (h.finalUrl && h.redirected ? `\nRedirected to: ${h.finalUrl}` : '')
            : h.error,
    });

    return rows;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const UrlScanner: React.FC = () => {
    const [url, setUrl] = useState('');
    const [phase, setPhase] = useState<Phase>('idle');
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState('');
    const [scanStep, setScanStep] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Clean up interval on unmount
    useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

    const handleScan = async () => {
        const trimmed = url.trim();
        if (!trimmed) { inputRef.current?.focus(); return; }

        setPhase('scanning');
        setError('');
        setResult(null);
        setScanStep(0);

        // Animate steps
        let step = 0;
        intervalRef.current = setInterval(() => {
            step += 1;
            if (step >= SCAN_STEPS.length) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                return;
            }
            setScanStep(step);
        }, 900);

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: trimmed }),
            });

            if (intervalRef.current) clearInterval(intervalRef.current);
            setScanStep(SCAN_STEPS.length - 1);

            if (!res.ok) {
                const errData = await res.json().catch(() => ({ error: 'Analysis failed' }));
                throw new Error(errData.error || `Server error (${res.status})`);
            }

            const data: AnalysisResult = await res.json();
            // small delay so user sees "Generating report…" step
            await new Promise((r) => setTimeout(r, 600));
            setResult(data);
            setPhase('results');
        } catch (err: any) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setError(err.message || 'Failed to analyze URL');
            setPhase('error');
        }
    };

    const handleReset = () => {
        setUrl('');
        setPhase('idle');
        setResult(null);
        setError('');
        setScanStep(0);
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleScan(); };

    // ─── RENDER ──────────────────────────────────────────────────────────────────
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, type: 'spring', stiffness: 100 }}
            className="relative perspective-container"
        >
            {/* Glow backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-shield-500/30 via-cyber-400/20 to-transparent rounded-3xl blur-2xl transform scale-95 opacity-60 pointer-events-none" />

            <div className="relative bg-gradient-to-br from-background to-secondary dark:from-card dark:to-background rounded-3xl p-1 subtle-border hero-card-3d">
                <div className="bg-background dark:bg-card rounded-2xl overflow-hidden subtle-border">
                    {/* ── Browser chrome ── */}
                    <div className="h-9 bg-secondary dark:bg-muted flex items-center justify-between px-4">
                        <div className="flex items-center space-x-2">
                            <div className="h-3 w-3 rounded-full bg-red-400" />
                            <div className="h-3 w-3 rounded-full bg-yellow-400" />
                            <div className="h-3 w-3 rounded-full bg-green-400" />
                        </div>
                        <span className="text-[11px] font-medium text-foreground/40 tracking-wide">FraudShield Scanner</span>
                        <div className="w-12" />
                    </div>

                    {/* ── Content area ── */}
                    <div className="p-5 relative overflow-hidden min-h-[340px] max-h-[480px] overflow-y-auto">
                        <AnimatePresence mode="wait">

                            {/* ═══ IDLE ═══ */}
                            {phase === 'idle' && (
                                <motion.div key="idle" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                                    <div className="text-center mb-5">
                                        <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-shield-500/15 mb-3">
                                            <Fingerprint className="h-6 w-6 text-shield-400" />
                                        </div>
                                        <h3 className="text-base font-semibold">URL Security Scanner</h3>
                                        <p className="text-xs text-foreground/50 mt-1">Paste any URL for a real-time threat analysis</p>
                                    </div>

                                    {/* Input */}
                                    <div className="relative flex items-center gap-2 mb-4">
                                        <div className="flex-1 relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/30" />
                                            <input
                                                ref={inputRef}
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                placeholder="e.g. google.com"
                                                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm placeholder:text-foreground/30 focus:outline-none focus:border-shield-500/50 focus:ring-1 focus:ring-shield-500/25 transition-all"
                                            />
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={handleScan}
                                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-shield-500 hover:bg-shield-600 text-white text-sm font-medium transition-colors shadow-lg shadow-shield-500/20"
                                        >
                                            Scan <ArrowRight className="h-3.5 w-3.5" />
                                        </motion.button>
                                    </div>

                                    {/* Decorative stat cards */}
                                    <div className="flex gap-2.5 mb-3">
                                        <div className="rounded-lg bg-shield-50 dark:bg-shield-900/20 p-2.5 flex-1 border border-shield-200/30 dark:border-shield-700/20">
                                            <div className="text-[10px] font-medium text-shield-800 dark:text-shield-400 uppercase tracking-wider">Threats Blocked</div>
                                            <div className="text-lg font-bold text-shield-600 dark:text-shield-400">247</div>
                                        </div>
                                        <div className="rounded-lg bg-cyber-50 dark:bg-cyber-900/20 p-2.5 flex-1 border border-cyber-200/30 dark:border-cyber-700/20">
                                            <div className="text-[10px] font-medium text-cyber-800 dark:text-cyber-400 uppercase tracking-wider">Scans Today</div>
                                            <div className="text-lg font-bold text-cyber-600 dark:text-cyber-400">1,024</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-green-500/[0.06] border border-green-500/10">
                                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                        <span className="text-xs text-foreground/60">Powered by Google Safe Browsing, VirusTotal & WHOIS</span>
                                    </div>
                                </motion.div>
                            )}

                            {/* ═══ SCANNING ═══ */}
                            {phase === 'scanning' && (
                                <motion.div key="scanning" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                                    <div className="text-center mb-5">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                            className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-shield-500/15 mb-3"
                                        >
                                            <Loader2 className="h-6 w-6 text-shield-400" />
                                        </motion.div>
                                        <h3 className="text-base font-semibold">Scanning…</h3>
                                        <p className="text-xs text-foreground/50 mt-1 font-mono truncate">{url}</p>
                                    </div>

                                    <div className="space-y-2">
                                        {SCAN_STEPS.map((step, i) => {
                                            const StepIcon = step.icon;
                                            const isDone = i < scanStep;
                                            const isCurrent = i === scanStep;
                                            return (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1, duration: 0.3 }}
                                                    className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${isCurrent ? 'bg-shield-500/10 border border-shield-500/20' :
                                                        isDone ? 'bg-green-500/[0.05]' : 'opacity-40'
                                                        }`}
                                                >
                                                    {isDone ? (
                                                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                                                    ) : isCurrent ? (
                                                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}>
                                                            <Loader2 className="h-4 w-4 text-shield-400 flex-shrink-0" />
                                                        </motion.div>
                                                    ) : (
                                                        <StepIcon className="h-4 w-4 text-foreground/30 flex-shrink-0" />
                                                    )}
                                                    <span className={`text-xs ${isCurrent ? 'text-shield-300 font-medium' : isDone ? 'text-green-400/80' : 'text-foreground/40'}`}>
                                                        {step.label}
                                                    </span>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Progress bar */}
                                    <div className="mt-4 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full bg-gradient-to-r from-shield-500 to-cyber-400"
                                            initial={{ width: '0%' }}
                                            animate={{ width: `${Math.min(((scanStep + 1) / SCAN_STEPS.length) * 100, 95)}%` }}
                                            transition={{ duration: 0.5, ease: 'easeOut' }}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* ═══ RESULTS ═══ */}
                            {phase === 'results' && result && (
                                <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4 }}>
                                    {(() => {
                                        const vc = verdictConfig[result.verdict];
                                        return (
                                            <>
                                                {/* Score + Verdict header */}
                                                <div className="flex items-center gap-4 mb-4">
                                                    <ScoreRing score={result.overallScore} verdict={result.verdict} />
                                                    <div className="flex-1 min-w-0">
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: 0.4 }}
                                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${vc.bg} ${vc.text} border ${vc.border}`}
                                                        >
                                                            <vc.Icon className="h-3.5 w-3.5" />
                                                            {vc.label}
                                                        </motion.div>
                                                        <p className="text-xs text-foreground/50 mt-1.5 truncate font-mono">{result.hostname}</p>
                                                        <p className="text-[10px] text-foreground/30 mt-0.5">
                                                            Scanned {new Date(result.scanDate).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Detailed checks */}
                                                <div className="space-y-2 mb-4">
                                                    {buildCheckRows(result.checks).map((row, i) => (
                                                        <CheckRow key={i} {...row} delay={0.1 + i * 0.08} />
                                                    ))}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2">
                                                    <motion.button
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        onClick={handleReset}
                                                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-shield-500/15 hover:bg-shield-500/25 text-shield-400 text-xs font-medium transition-colors border border-shield-500/20"
                                                    >
                                                        <RotateCcw className="h-3 w-3" /> Scan Another
                                                    </motion.button>
                                                    <motion.a
                                                        whileHover={{ scale: 1.03 }}
                                                        whileTap={{ scale: 0.97 }}
                                                        href={result.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-foreground/60 text-xs font-medium transition-colors border border-white/[0.08]"
                                                    >
                                                        <ExternalLink className="h-3 w-3" /> Visit
                                                    </motion.a>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </motion.div>
                            )}

                            {/* ═══ ERROR ═══ */}
                            {phase === 'error' && (
                                <motion.div key="error" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}>
                                    <div className="text-center py-6">
                                        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-red-500/15 mb-4">
                                            <AlertTriangle className="h-7 w-7 text-red-400" />
                                        </div>
                                        <h3 className="text-base font-semibold text-red-400 mb-1">Analysis Failed</h3>
                                        <p className="text-xs text-foreground/50 max-w-[260px] mx-auto mb-4">{error}</p>
                                        <motion.button
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={handleReset}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-shield-500/15 hover:bg-shield-500/25 text-shield-400 text-sm font-medium transition-colors border border-shield-500/20"
                                        >
                                            <RotateCcw className="h-3.5 w-3.5" /> Try Again
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default UrlScanner;
