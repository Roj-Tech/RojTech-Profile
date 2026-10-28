'use client';

import { useMemo, useState } from 'react';
import { analyzeUrl } from '@/lib/phishing/analyzeUrl';
import { useTranslations } from '@/contexts/LocaleContext';
import type { PhishingRiskKey } from '@/lib/i18n/toolTypes';

const EXAMPLE = 'http://paypa1-secure-login.com.verify-account.tk/signin';

type ReputationResult = {
  available: boolean;
  message?: string;
  matches?: unknown[];
  error?: string;
};

export default function PhishingDetectorTool() {
  const t = useTranslations();
  const pd = t.phishingDetector;
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
        message: pd.reputationFailed,
      });
    } finally {
      setLoading(false);
    }
  }

  function riskLabel(level: PhishingRiskKey) {
    return pd.riskLevels[level] || level.toUpperCase();
  }

  function indicatorCopy(id: string) {
    return (
      pd.indicators[id] || {
        title: id,
        detail: '',
        advice: '',
      }
    );
  }

  function reputationText(rep: ReputationResult) {
    if (rep.available) {
      if (rep.matches && Array.isArray(rep.matches) && rep.matches.length > 0) {
        return pd.reputationHit;
      }
      return rep.message || pd.reputationSafeNone;
    }
    return rep.message || rep.error || pd.reputationUnavailable;
  }

  return (
    <>
      <header className="tool-hero">
        <div className="tool-kicker">{pd.kicker}</div>
        <h1>
          {pd.title} <em>{pd.titleEm}</em>
        </h1>
        <p className="tool-lead">{pd.lead}</p>
      </header>

      <section className="tool-panel">
        <h2>{pd.analyzeHeading}</h2>
        <label className="tool-label" htmlFor="url-input">
          {pd.inputLabel}
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
            placeholder={pd.inputPlaceholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void analyze();
              }
            }}
          />
          <button type="button" className="tool-btn tool-btn-primary" onClick={() => void analyze()}>
            {pd.analyze}
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
            {pd.clear}
          </button>
          <button type="button" className="tool-btn" onClick={() => setInput(EXAMPLE)}>
            {pd.example}
          </button>
        </div>

        {loading && (
          <p className="tool-note" style={{ marginTop: 12 }}>
            <span className="loading-dot" />
            {pd.loadingReputation}
          </p>
        )}

        {local && !local.ok && (
          <p className="feedback-toast error" style={{ marginTop: 12 }}>
            {local.error || pd.invalidUrl}
          </p>
        )}

        {local?.ok && (
          <div style={{ marginTop: 18 }}>
            <span className={`risk-badge risk-${local.riskLevel}`}>
              {pd.riskBadge(riskLabel(local.riskLevel), local.score)}
            </span>
            <p style={{ marginBottom: 12, color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              {pd.parsedHost} <code>{local.normalized.hostname}</code> · {pd.protocol}{' '}
              <code>{local.normalized.protocol}</code>
              {local.normalized.port ? (
                <>
                  {' '}
                  · {pd.port} <code>{local.normalized.port}</code>
                </>
              ) : null}
            </p>

            {local.indicators.length === 0 ? (
              <p className="tool-note">{pd.noIndicators}</p>
            ) : (
              local.indicators.map((ind) => {
                const copy = indicatorCopy(ind.id);
                return (
                  <article key={ind.id} className="indicator-card">
                    <h4>
                      [{ind.severity.toUpperCase()}] {copy.title}
                    </h4>
                    <p style={{ marginBottom: 6 }}>{copy.detail || ind.detail}</p>
                    <p style={{ color: 'var(--cyan)', fontSize: '0.88rem' }}>
                      {pd.nextStep} {copy.advice || ind.advice}
                    </p>
                  </article>
                );
              })
            )}

            {reputation && (
              <div className="tool-note">
                <strong>{pd.reputationHeading} </strong>
                {reputationText(reputation)}
              </div>
            )}

            <p className="tool-disclaimer">{pd.disclaimer}</p>
          </div>
        )}
      </section>

      <section className="tool-panel">
        <h2>{pd.eduHeading}</h2>
        <div className="tool-edu">
          {pd.edu.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
