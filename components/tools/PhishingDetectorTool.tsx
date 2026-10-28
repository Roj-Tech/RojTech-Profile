'use client';

import { useMemo, useState } from 'react';
import { analyzeUrl } from '@/lib/phishing/analyzeUrl';

const EXAMPLE = 'http://paypa1-secure-login.com.verify-account.tk/signin';

type ReputationResult = {
  available: boolean;
  message?: string;
  matches?: unknown[];
  error?: string;
};

export default function PhishingDetectorTool() {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [loading, setLoading] = useState(false);
  const [reputation, setReputation] = useState<ReputationResult | null>(null);

  const local = useMemo(
    () => (submitted ? analyzeUrl(submitted) : null),
    [submitted],
  );

  async function analyze() {
    const value = input.trim();
    setSubmitted(value);
    setReputation(null);
    if (!value) return;

    const localResult = analyzeUrl(value);
    if (!localResult.ok) return;

    setLoading(true);
    try {
      const res = await fetch('/api/phishing/reputation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: localResult.normalized.href }),
      });
      const data = (await res.json()) as ReputationResult;
      setReputation(data);
    } catch {
      setReputation({
        available: false,
        message: 'Threat-intelligence lookup failed. Local analysis still applies.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="tool-hero">
        <div className="tool-kicker">[ MODULE_03 · DEFENSIVE ANALYSIS ]</div>
        <h1>
          Phishing <em>Detector</em>
        </h1>
        <p className="tool-lead">
          Inspect URL structure for deceptive patterns. This tool never opens, redirects to, or
          fetches the website you paste — it analyzes the link text only.
        </p>
      </header>

      <section className="tool-panel">
        <h2>URL analysis</h2>
        <label className="tool-label" htmlFor="url-input">
          Paste a suspicious URL
        </label>
        <div className="tool-input-row">
          <input
            id="url-input"
            className="tool-input"
            type="url"
            inputMode="url"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="https://example.com/path"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void analyze();
              }
            }}
          />
          <button type="button" className="tool-btn tool-btn-primary" onClick={() => void analyze()}>
            Analyze URL
          </button>
          <button
            type="button"
            className="tool-btn tool-btn-orange"
            onClick={() => {
              setInput('');
              setSubmitted('');
              setReputation(null);
            }}
          >
            Clear
          </button>
          <button type="button" className="tool-btn" onClick={() => setInput(EXAMPLE)}>
            Example
          </button>
        </div>

        {loading && (
          <p className="tool-note" style={{ marginTop: 12 }}>
            <span className="loading-dot" />
            Checking optional threat-intelligence service…
          </p>
        )}

        {local && !local.ok && (
          <p className="feedback-toast error" style={{ marginTop: 12 }}>
            {local.error}
          </p>
        )}

        {local?.ok && (
          <div style={{ marginTop: 18 }}>
            <span className={`risk-badge risk-${local.riskLevel}`}>
              {local.riskLevel.toUpperCase()} RISK INDICATORS · score {local.score}
            </span>
            <p style={{ marginBottom: 12, color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              Parsed host: <code>{local.normalized.hostname}</code> · protocol:{' '}
              <code>{local.normalized.protocol}</code>
              {local.normalized.port ? (
                <>
                  {' '}
                  · port: <code>{local.normalized.port}</code>
                </>
              ) : null}
            </p>

            {local.indicators.length === 0 ? (
              <p className="tool-note">
                No strong structural red flags were found. That does <strong>not</strong> prove the
                site is legitimate — attackers can use clean-looking domains.
              </p>
            ) : (
              local.indicators.map((ind) => (
                <article key={ind.id} className="indicator-card">
                  <h4>
                    [{ind.severity.toUpperCase()}] {ind.title}
                  </h4>
                  <p style={{ marginBottom: 6 }}>{ind.detail}</p>
                  <p style={{ color: 'var(--cyan)', fontSize: '0.88rem' }}>Next step: {ind.advice}</p>
                </article>
              ))
            )}

            {reputation && (
              <div className="tool-note">
                <strong>Threat intelligence: </strong>
                {reputation.available
                  ? reputation.matches && Array.isArray(reputation.matches) && reputation.matches.length > 0
                    ? 'Provider reported known unsafe matches for this URL. Treat as high risk and do not visit.'
                    : reputation.message ||
                      'Provider returned no known unsafe matches. This is not a safety guarantee.'
                  : reputation.message ||
                    reputation.error ||
                    'Optional reputation API is not configured. Local analysis only.'}
              </div>
            )}

            <p className="tool-disclaimer">{local.disclaimer}</p>
          </div>
        )}
      </section>

      <section className="tool-panel">
        <h2>Learn: spotting phishing</h2>
        <div className="tool-edu">
          <article>
            <h3>What is phishing?</h3>
            <p>
              Attackers impersonate trusted organizations to steal passwords, codes, or payment
              details — often through urgent messages with deceptive links.
            </p>
          </article>
          <article>
            <h3>Verify the real domain</h3>
            <p>
              Hover or long-press links and read the actual hostname. Look for misspellings, extra
              words, or a familiar brand buried in a subdomain of an unrelated site.
            </p>
          </article>
          <article>
            <h3>Never enter credentials from surprise links</h3>
            <p>
              Open the official site yourself via a bookmark or typed address, then sign in. Do not
              trust login pages reached from unexpected email or chat messages.
            </p>
          </article>
          <article>
            <h3>If something looks suspicious</h3>
            <p>
              Do not click further, do not download attachments, report the message to your
              organization or provider, and change passwords if you already entered them.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
