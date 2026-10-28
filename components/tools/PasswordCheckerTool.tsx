'use client';

import { useEffect, useMemo, useState } from 'react';
import { analyzePassword } from '@/lib/password/analyze';
import { generatePassword } from '@/lib/password/generate';

export default function PasswordCheckerTool() {
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
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Could not generate password');
    }
  }

  return (
    <>
      <header className="tool-hero">
        <div className="tool-kicker">[ MODULE_01 · LOCAL ANALYSIS ]</div>
        <h1>
          Password <em>Checker</em>
        </h1>
        <p className="tool-lead">
          Analyze and generate passwords entirely in your browser. Nothing you type is sent to
          RojTech servers, stored, or logged.
        </p>
      </header>

      <div className="tool-grid-2">
        <section className="tool-panel" aria-labelledby="pw-input-heading">
          <h2 id="pw-input-heading">Password input</h2>
          <label className="tool-label" htmlFor="password-input">
            Enter a password to analyze
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
              placeholder="Type or generate a password"
            />
            <button
              type="button"
              className="tool-btn"
              onClick={() => setVisible((v) => !v)}
              aria-pressed={visible}
            >
              {visible ? 'Hide' : 'Show'}
            </button>
            <button type="button" className="tool-btn tool-btn-orange" onClick={clearPassword}>
              Clear
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => copyText(password)}
              disabled={!password}
            >
              Copy
            </button>
          </div>
          {copied === 'ok' && <p className="feedback-toast">Copied to clipboard</p>}
          {copied === 'err' && (
            <p className="feedback-toast error">Clipboard blocked — copy manually</p>
          )}

          {analysis && (
            <div style={{ marginTop: 18 }}>
              <h3>
                Strength: {analysis.label}{' '}
                <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>
                  (score {analysis.score}/4)
                </span>
              </h3>
              <div className="strength-meter" aria-hidden>
                <span className={`strength-${analysis.score}`} />
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>
                Estimated online guessing resistance (heuristic): {analysis.crackTimeDisplay}
              </p>
              {analysis.isCommonPassword && (
                <p className="feedback-toast error">This matches a known common password.</p>
              )}
              {analysis.feedback.warning && (
                <p className="tool-note">{analysis.feedback.warning}</p>
              )}
              <div className="tool-checks">
                <div className={`tool-check ${analysis.checks.length ? 'ok' : 'bad'}`}>
                  Length ≥ 12
                </div>
                <div className={`tool-check ${analysis.checks.hasUpper ? 'ok' : 'bad'}`}>
                  Uppercase
                </div>
                <div className={`tool-check ${analysis.checks.hasLower ? 'ok' : 'bad'}`}>
                  Lowercase
                </div>
                <div className={`tool-check ${analysis.checks.hasNumber ? 'ok' : 'bad'}`}>
                  Number
                </div>
                <div className={`tool-check ${analysis.checks.hasSymbol ? 'ok' : 'bad'}`}>
                  Symbol
                </div>
                <div className={`tool-check ${!analysis.checks.hasRepeat ? 'ok' : 'bad'}`}>
                  No long repeats
                </div>
                <div className={`tool-check ${!analysis.checks.hasSequence ? 'ok' : 'bad'}`}>
                  No sequences
                </div>
              </div>
              <h3>Recommendations</h3>
              <ul className="tool-list">
                {analysis.recommendations.map((rec) => (
                  <li key={rec.title}>
                    <strong>{rec.title}</strong>
                    {rec.why}
                  </li>
                ))}
              </ul>
              <p className="tool-disclaimer">{analysis.disclaimer}</p>
            </div>
          )}
        </section>

        <section className="tool-panel" aria-labelledby="pw-gen-heading">
          <h2 id="pw-gen-heading">Strong password generator</h2>
          <label className="tool-label" htmlFor="gen-length">
            Length: {genLength}
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
                ['uppercase', 'Uppercase A–Z'],
                ['lowercase', 'Lowercase a–z'],
                ['numbers', 'Numbers 0–9'],
                ['symbols', 'Symbols'],
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
              Generate
            </button>
            <button
              type="button"
              className="tool-btn"
              onClick={() => copyText(password)}
              disabled={!password}
            >
              Copy generated
            </button>
          </div>
          {genError && <p className="feedback-toast error">{genError}</p>}
          <p className="tool-note">
            Uses <code>crypto.getRandomValues()</code> in your browser. Regenerate until you are
            ready, then store it in a password manager.
          </p>
        </section>
      </div>

      <section className="tool-panel" aria-labelledby="pw-edu">
        <h2 id="pw-edu">Learn: stronger passwords</h2>
        <div className="tool-edu">
          <article>
            <h3>What makes a password strong?</h3>
            <p>
              Length, uniqueness, and unpredictability matter more than swapping letters for
              symbols in a short word. Random long passphrases or manager-generated secrets resist
              guessing far better than clever short passwords.
            </p>
          </article>
          <article>
            <h3>Why length matters</h3>
            <p>
              Every extra character multiplies the search space. A long password can remain strong
              even without every character class, while a short mixed-character password can still
              be cracked quickly.
            </p>
          </article>
          <article>
            <h3>Why reuse is dangerous</h3>
            <p>
              If one site leaks credentials, attackers try the same password elsewhere. Unique
              passwords contain breaches to a single account.
            </p>
          </article>
          <article>
            <h3>Password managers & MFA</h3>
            <p>
              Managers create and remember unique secrets for you. Multi-factor authentication adds
              a second check so a stolen password alone is often not enough.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
