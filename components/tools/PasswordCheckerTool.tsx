'use client';

import { useEffect, useMemo, useState } from 'react';
import { analyzePassword } from '@/lib/password/analyze';
import { generatePassword } from '@/lib/password/generate';
import { useTranslations } from '@/contexts/LocaleContext';
import type { PasswordStrengthKey } from '@/lib/i18n/toolTypes';

const STRENGTH_KEYS: PasswordStrengthKey[] = [
  'veryWeak',
  'weak',
  'fair',
  'strong',
  'veryStrong',
];

export default function PasswordCheckerTool() {
  const t = useTranslations();
  const pc = t.passwordChecker;
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState<'ok' | 'err' | null>(null);
  const [genLength, setGenLength] = useState(16);
  const [opts, setOpts] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [genError, setGenError] = useState<string | null>(null);

  const analysis = useMemo(
    () => (password ? analyzePassword(password) : null),
    [password],
  );

  const recommendations = useMemo(() => {
    if (!analysis) return [];
    const tips = [];
    if (analysis.isCommonPassword) tips.push(pc.tips.common);
    if (!analysis.checks.length) tips.push(pc.tips.length);
    if (!analysis.checks.hasUpper || !analysis.checks.hasLower) tips.push(pc.tips.caseMix);
    if (!analysis.checks.hasNumber) tips.push(pc.tips.numbers);
    if (!analysis.checks.hasSymbol) tips.push(pc.tips.symbols);
    if (analysis.checks.hasRepeat) tips.push(pc.tips.repeats);
    if (analysis.checks.hasSequence) tips.push(pc.tips.sequences);
    tips.push(pc.tips.reuse, pc.tips.manager, pc.tips.personal);
    return tips;
  }, [analysis, pc.tips]);

  useEffect(() => {
    return () => {
      setPassword('');
    };
  }, []);

  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied('ok');
    } catch {
      setCopied('err');
    }
    window.setTimeout(() => setCopied(null), 2200);
  }

  function clearPassword() {
    setPassword('');
    setCopied(null);
  }

  function onGenerate() {
    try {
      const next = generatePassword({ length: genLength, ...opts });
      setPassword(next);
      setGenError(null);
      setVisible(true);
    } catch {
      setGenError(pc.genNeedCharset);
    }
  }

  const strengthLabel = analysis
    ? pc.strengthLabels[STRENGTH_KEYS[analysis.score]]
    : '';

  return (
    <>
      <header className="tool-hero">
        <div className="tool-kicker">{pc.kicker}</div>
        <h1>
          {pc.title} <em>{pc.titleEm}</em>
        </h1>
        <p className="tool-lead">{pc.lead}</p>
      </header>

      <div className="tool-grid-2">
        <section className="tool-panel" aria-labelledby="pw-input-heading">
          <h2 id="pw-input-heading">{pc.inputHeading}</h2>
          <label className="tool-label" htmlFor="password-input">
            {pc.inputLabel}
          </label>
          <div className="tool-input-row">
            <input
              id="password-input"
              className="tool-input"
              type={visible ? 'text' : 'password'}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={pc.inputPlaceholder}
            />
            <button
              type="button"
              className="tool-btn"
              onClick={() => setVisible((v) => !v)}
              aria-pressed={visible}
            >
              {visible ? pc.hide : pc.show}
            </button>
            <button type="button" className="tool-btn tool-btn-orange" onClick={clearPassword}>
              {pc.clear}
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => copyText(password)}
              disabled={!password}
            >
              {pc.copy}
            </button>
          </div>
          {copied === 'ok' && <p className="feedback-toast">{pc.copied}</p>}
          {copied === 'err' && <p className="feedback-toast error">{pc.copyFailed}</p>}

          {analysis && (
            <div style={{ marginTop: 18 }}>
              <h3>
                {pc.strength}: {strengthLabel}{' '}
                <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>
                  {pc.scoreOf(analysis.score)}
                </span>
              </h3>
              <div className="strength-meter" aria-hidden>
                <span className={`strength-${analysis.score}`} />
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                {pc.crackTime} {analysis.crackTimeDisplay}
              </p>
              {analysis.isCommonPassword && (
                <p className="feedback-toast error">{pc.commonPassword}</p>
              )}
              <div className="tool-checks">
                <div className={`tool-check ${analysis.checks.length ? 'ok' : 'bad'}`}>
                  {pc.checks.length}
                </div>
                <div className={`tool-check ${analysis.checks.hasUpper ? 'ok' : 'bad'}`}>
                  {pc.checks.upper}
                </div>
                <div className={`tool-check ${analysis.checks.hasLower ? 'ok' : 'bad'}`}>
                  {pc.checks.lower}
                </div>
                <div className={`tool-check ${analysis.checks.hasNumber ? 'ok' : 'bad'}`}>
                  {pc.checks.number}
                </div>
                <div className={`tool-check ${analysis.checks.hasSymbol ? 'ok' : 'bad'}`}>
                  {pc.checks.symbol}
                </div>
                <div className={`tool-check ${!analysis.checks.hasRepeat ? 'ok' : 'bad'}`}>
                  {pc.checks.noRepeat}
                </div>
                <div className={`tool-check ${!analysis.checks.hasSequence ? 'ok' : 'bad'}`}>
                  {pc.checks.noSequence}
                </div>
              </div>
              <h3>{pc.recommendationsHeading}</h3>
              <ul className="tool-list">
                {recommendations.map((rec) => (
                  <li key={rec.title}>
                    <strong>{rec.title}</strong>
                    {rec.why}
                  </li>
                ))}
              </ul>
              <p className="tool-disclaimer">{pc.disclaimer}</p>
            </div>
          )}
        </section>

        <section className="tool-panel" aria-labelledby="pw-gen-heading">
          <h2 id="pw-gen-heading">{pc.generatorHeading}</h2>
          <label className="tool-label" htmlFor="gen-length">
            {pc.lengthLabel(genLength)}
          </label>
          <input
            id="gen-length"
            type="range"
            min={8}
            max={64}
            value={genLength}
            onChange={(e) => setGenLength(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <div className="gen-options">
            {(
              [
                ['uppercase', pc.optUpper],
                ['lowercase', pc.optLower],
                ['numbers', pc.optNumbers],
                ['symbols', pc.optSymbols],
              ] as const
            ).map(([key, label]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={opts[key]}
                  onChange={(e) => setOpts((o) => ({ ...o, [key]: e.target.checked }))}
                />
                {label}
              </label>
            ))}
          </div>
          <div className="tool-input-row">
            <button type="button" className="tool-btn tool-btn-primary" onClick={onGenerate}>
              {pc.generate}
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => copyText(password)}
              disabled={!password}
            >
              {pc.copyGenerated}
            </button>
          </div>
          {genError && <p className="feedback-toast error">{genError}</p>}
          <p className="tool-note">{pc.genNote}</p>
        </section>
      </div>

      <section className="tool-panel" aria-labelledby="pw-edu">
        <h2 id="pw-edu">{pc.eduHeading}</h2>
        <div className="tool-edu">
          {pc.edu.map((item) => (
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
