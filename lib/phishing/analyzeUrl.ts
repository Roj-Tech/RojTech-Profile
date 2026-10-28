import { SHORTENER_HOSTS } from "./shorteners";

export const URL_ANALYSIS_DISCLAIMER =
  "This tool analyzes the URL string only—not page content. Absence of warnings does not mean a link is safe. HTTPS alone does not guarantee legitimacy.";

export type UrlRiskLevel = "low" | "medium" | "high";

export type UrlIndicatorSeverity = "info" | "low" | "medium" | "high";

export type UrlIndicator = {
  id: string;
  severity: UrlIndicatorSeverity;
  title: string;
  detail: string;
  advice: string;
};

export type NormalizedUrlParts = {
  protocol: string;
  hostname: string;
  port: string;
  path: string;
  href: string;
};

export type UrlAnalysisSuccess = {
  ok: true;
  normalized: NormalizedUrlParts;
  riskLevel: UrlRiskLevel;
  score: number;
  indicators: UrlIndicator[];
  disclaimer: string;
};

export type UrlAnalysisError = {
  ok: false;
  error: string;
  disclaimer: string;
};

export type UrlAnalysisResult = UrlAnalysisSuccess | UrlAnalysisError;

const BLOCKED_SCHEMES = new Set(["javascript:", "data:", "vbscript:", "file:"]);

const BRAND_OFFICIAL: Record<string, string> = {
  paypal: "paypal.com",
  apple: "apple.com",
  google: "google.com",
  microsoft: "microsoft.com",
  amazon: "amazon.com",
  facebook: "facebook.com",
  instagram: "instagram.com",
  netflix: "netflix.com",
  whatsapp: "whatsapp.com",
  bank: "bank",
};

const BRAND_KEYWORDS = [
  "paypal",
  "apple",
  "google",
  "microsoft",
  "amazon",
  "facebook",
  "instagram",
  "netflix",
  "whatsapp",
  "office365",
  "outlook",
  "bank",
  "banking",
  "chase",
  "wellsfargo",
  "secure",
  "login",
  "verify",
  "account",
  "support",
];

const HOMOGLYPH_MAP: Record<string, string> = {
  "0": "o",
  "1": "l",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "@": "a",
};

const SEVERITY_WEIGHT: Record<UrlIndicatorSeverity, number> = {
  info: 0.5,
  low: 1,
  medium: 2,
  high: 3,
};

function riskFromScore(score: number): UrlRiskLevel {
  if (score >= 6) return "high";
  if (score >= 3) return "medium";
  return "low";
}

function isIpv4Host(host: string): boolean {
  const parts = host.split(".");
  if (parts.length !== 4) return false;
  return parts.every((p) => {
    const n = Number(p);
    return /^\d{1,3}$/.test(p) && n >= 0 && n <= 255;
  });
}

function isIpv6Host(host: string): boolean {
  return host.includes(":") && !host.includes(".");
}

function countSubdomainLabels(hostname: string): number {
  return hostname.split(".").filter(Boolean).length;
}

function normalizeBrandHost(host: string): string {
  let h = host.toLowerCase().replace(/-/g, "");
  for (const [from, to] of Object.entries(HOMOGLYPH_MAP)) {
    h = h.split(from).join(to);
  }
  return h;
}

function hostSuggestsBrand(host: string): string | null {
  const flat = normalizeBrandHost(host.replace(/\./g, ""));
  for (const brand of Object.keys(BRAND_OFFICIAL)) {
    if (flat.includes(brand.replace(/-/g, ""))) return brand;
  }
  for (const keyword of BRAND_KEYWORDS) {
    const k = keyword.replace(/-/g, "");
    if (flat.includes(k)) return keyword;
  }
  return null;
}

function isLegitimateBrandHost(hostname: string, brand: string): boolean {
  const official = BRAND_OFFICIAL[brand];
  if (!official) return false;
  if (official === "bank") {
    return hostname.endsWith(".bank") || hostname.includes("bank.");
  }
  const host = hostname.toLowerCase();
  return host === official || host.endsWith(`.${official}`);
}

function hasMisleadingBrandSubdomain(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  for (const brand of Object.keys(BRAND_OFFICIAL)) {
    const official = BRAND_OFFICIAL[brand]!;
    if (official === "bank") continue;
    const embedded = `${official}.`;
    const idx = lower.indexOf(embedded);
    if (idx > 0 && !lower.endsWith(official)) {
      return true;
    }
    const hyphenPattern = new RegExp(
      `${brand.replace(/-/g, "[-.]?")}[-.]?com(?=\\.|$)`,
      "i",
    );
    if (hyphenPattern.test(lower) && !lower.endsWith(official)) {
      return true;
    }
  }
  return false;
}

function hasSuspiciousEncoding(raw: string, href: string): boolean {
  const percentCount = (raw.match(/%/g) ?? []).length;
  if (percentCount >= 6) return true;
  if (/%25/i.test(raw)) return true;
  if (/@|%40/i.test(href) && href.includes("%")) return true;
  return false;
}

function parseUrlInput(input: string): URL | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const withScheme =
    /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    return new URL(withScheme);
  } catch {
    try {
      return new URL(trimmed);
    } catch {
      return null;
    }
  }
}

export function analyzeUrl(input: string): UrlAnalysisResult {
  const raw = input.trim();
  const disclaimer = URL_ANALYSIS_DISCLAIMER;

  if (!raw) {
    return { ok: false, error: "URL is empty.", disclaimer };
  }

  const lowerRaw = raw.toLowerCase();
  for (const scheme of BLOCKED_SCHEMES) {
    if (lowerRaw.startsWith(scheme)) {
      return {
        ok: false,
        error: `Dangerous or unsupported URL scheme (${scheme.replace(":", "")}).`,
        disclaimer,
      };
    }
  }

  const parsed = parseUrlInput(raw);
  if (!parsed) {
    return { ok: false, error: "Invalid URL format.", disclaimer };
  }

  if (BLOCKED_SCHEMES.has(parsed.protocol.toLowerCase())) {
    return {
      ok: false,
      error: `Dangerous or unsupported URL scheme (${parsed.protocol.replace(":", "")}).`,
      disclaimer,
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const port = parsed.port;
  const protocol = parsed.protocol.replace(":", "");
  const path = `${parsed.pathname}${parsed.search}${parsed.hash}`;
  const href = parsed.href;

  const indicators: UrlIndicator[] = [];

  const push = (indicator: UrlIndicator) => {
    indicators.push(indicator);
  };

  if (parsed.username || parsed.password) {
    push({
      id: "userinfo-trick",
      severity: "high",
      title: "Credentials embedded in URL",
      detail: `The URL contains userinfo (e.g. text before "@"), which can hide the real destination host (${hostname}).`,
      advice: "Do not trust the text before @; verify the hostname after @ before clicking.",
    });
  }

  if (raw.includes("@") && !parsed.username) {
    push({
      id: "at-symbol",
      severity: "medium",
      title: "At-sign (@) in URL",
      detail: "An @ symbol can be used to disguise where a link really goes.",
      advice: "Inspect the part after the last @ or avoid the link if you did not expect this format.",
    });
  }

  if (isIpv4Host(hostname) || isIpv6Host(hostname)) {
    push({
      id: "ip-host",
      severity: "high",
      title: "IP address instead of domain name",
      detail: `Host is a numeric address (${hostname}), which legitimate brands rarely use in links they send you.`,
      advice: "Prefer named domains you recognize; IP links are a common phishing tactic.",
    });
  }

  if (SHORTENER_HOSTS.has(hostname)) {
    push({
      id: "url-shortener",
      severity: "medium",
      title: "URL shortener",
      detail: `${hostname} is a known link shortener; the final destination is hidden.`,
      advice: "Expand or preview the link through trusted tools, or navigate to the site directly.",
    });
  }

  const labelCount = countSubdomainLabels(hostname);
  if (labelCount >= 5) {
    push({
      id: "excessive-subdomains",
      severity: "medium",
      title: "Many subdomains",
      detail: `Hostname has ${labelCount} dot-separated labels, which can look like a trusted name at a glance.`,
      advice: "Read the rightmost domain labels carefully—that is who you are visiting.",
    });
  }

  if (raw.length > 200 || href.length > 200) {
    push({
      id: "long-url",
      severity: "low",
      title: "Unusually long URL",
      detail: "Very long links can hide suspicious parameters or encoded payloads.",
      advice: "Be cautious; prefer shorter, official links from the organization’s site.",
    });
  }

  if (hasSuspiciousEncoding(raw, href)) {
    push({
      id: "suspicious-encoding",
      severity: "medium",
      title: "Heavy or nested percent-encoding",
      detail: "Multiple % sequences may obfuscate the true hostname or path.",
      advice: "Decode mentally or skip the link; open the service by typing its known address.",
    });
  }

  if (port && port !== "80" && port !== "443") {
    push({
      id: "non-standard-port",
      severity: "medium",
      title: "Non-standard port",
      detail: `Port :${port} is unusual for public web links.`,
      advice: "Confirm with the sender out-of-band before entering credentials.",
    });
  }

  if (protocol === "http") {
    push({
      id: "insecure-http",
      severity: "low",
      title: "Not using HTTPS",
      detail: "Traffic is not encrypted; sensitive data could be intercepted.",
      advice: "Do not enter passwords or payment details unless you upgrade to HTTPS and trust the site.",
    });
  }

  if (hostname.includes("xn--")) {
    push({
      id: "punycode",
      severity: "high",
      title: "Internationalized (Punycode) domain",
      detail: "xn-- labels can visually mimic well-known Latin domains.",
      advice: "Compare characters carefully; when in doubt, visit the brand via a bookmark or search.",
    });
  }

  const brandHint = hostSuggestsBrand(hostname);
  if (brandHint && !isLegitimateBrandHost(hostname, brandHint)) {
    push({
      id: "brand-impersonation",
      severity: "high",
      title: "Possible brand impersonation",
      detail: `Hostname resembles "${brandHint}" but is not the usual official domain (${BRAND_OFFICIAL[brandHint] ?? brandHint}).`,
      advice: "Open the service from an official app or typed URL instead of this link.",
    });
  }

  if (hasMisleadingBrandSubdomain(hostname)) {
    push({
      id: "misleading-subdomain",
      severity: "high",
      title: "Misleading subdomain structure",
      detail: "A trusted-looking name may appear in subdomains while another domain is in control.",
      advice: "Focus on the registrable domain at the end (e.g. example.com), not the leftmost words.",
    });
  }

  const normalizedFlat = normalizeBrandHost(hostname.replace(/\./g, ""));
  if (/paypa[1l]/.test(normalizedFlat) || /goo[g0][l1]e/.test(normalizedFlat)) {
    if (!indicators.some((i) => i.id === "brand-impersonation")) {
      push({
        id: "homoglyph-brand",
        severity: "high",
        title: "Look-alike characters in hostname",
        detail: "Digits or similar glyphs may imitate a well-known brand name.",
        advice: "Type the brand URL manually or use a saved bookmark.",
      });
    }
  }

  for (const brand of Object.keys(BRAND_OFFICIAL)) {
    const hyphenated = new RegExp(`${brand.split("").join("[-_.]?")}`, "i");
    if (hyphenated.test(hostname) && !isLegitimateBrandHost(hostname, brand)) {
      if (!indicators.some((i) => i.id === "brand-impersonation")) {
        push({
          id: "brand-hyphen-trick",
          severity: "medium",
          title: "Brand name split with punctuation",
          detail: `Hyphens or dots break up "${brand}" to mimic a legitimate site.`,
          advice: "Ignore decorative punctuation; verify the real domain suffix.",
        });
      }
      break;
    }
  }

  const score = indicators.reduce(
    (sum, ind) => sum + SEVERITY_WEIGHT[ind.severity],
    0,
  );

  return {
    ok: true,
    normalized: {
      protocol,
      hostname,
      port,
      path,
      href,
    },
    riskLevel: riskFromScore(score),
    score,
    indicators,
    disclaimer,
  };
}
