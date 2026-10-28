import zxcvbn from "zxcvbn";
import { COMMON_PASSWORDS } from "./common";

export const PASSWORD_ANALYSIS_DISCLAIMER =
  "This analysis is heuristic only. No tool can guarantee that a password is secure or that it has not been exposed elsewhere.";

export type PasswordStrengthLabel =
  | "Very Weak"
  | "Weak"
  | "Fair"
  | "Strong"
  | "Very Strong";

export type PasswordChecks = {
  length: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
  hasRepeat: boolean;
  hasSequence: boolean;
};

export type PasswordRecommendation = {
  title: string;
  why: string;
};

export type PasswordAnalysisResult = {
  score: 0 | 1 | 2 | 3 | 4;
  label: PasswordStrengthLabel;
  crackTimeDisplay: string;
  feedback: {
    warning: string | null;
    suggestions: string[];
  };
  checks: PasswordChecks;
  isCommonPassword: boolean;
  recommendations: PasswordRecommendation[];
  disclaimer: string;
};

const SCORE_LABELS: PasswordStrengthLabel[] = [
  "Very Weak",
  "Weak",
  "Fair",
  "Strong",
  "Very Strong",
];

const SEQUENCES = [
  "abcdefghijklmnopqrstuvwxyz",
  "zyxwvutsrqponmlkjihgfedcba",
  "01234567890",
  "09876543210",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
];

function hasRepeat(password: string): boolean {
  return /(.)\1{2,}/.test(password);
}

function hasSequence(password: string): boolean {
  const lower = password.toLowerCase();
  if (lower.length < 3) return false;
  for (const seq of SEQUENCES) {
    for (let i = 0; i <= seq.length - 3; i++) {
      const chunk = seq.slice(i, i + 3);
      if (lower.includes(chunk)) return true;
    }
  }
  return false;
}

function runChecks(password: string): PasswordChecks {
  return {
    length: password.length >= 12,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
    hasRepeat: hasRepeat(password),
    hasSequence: hasSequence(password),
  };
}

function buildRecommendations(
  password: string,
  checks: PasswordChecks,
  isCommon: boolean,
  zxcvbnSuggestions: string[],
): PasswordRecommendation[] {
  const tips: PasswordRecommendation[] = [];

  if (isCommon) {
    tips.push({
      title: "Avoid extremely common passwords",
      why: "Attackers try these first; choose something unique to you that is not on public breach lists.",
    });
  }

  if (!checks.length) {
    tips.push({
      title: "Use at least 12 characters",
      why: "Longer passwords resist guessing and brute-force attempts far better than short ones.",
    });
  }

  if (!checks.hasUpper || !checks.hasLower) {
    tips.push({
      title: "Mix uppercase and lowercase letters",
      why: "Variety expands the search space and defeats simple dictionary rules.",
    });
  }

  if (!checks.hasNumber) {
    tips.push({
      title: "Include numbers",
      why: "Digits add another character class, making automated guessing slower.",
    });
  }

  if (!checks.hasSymbol) {
    tips.push({
      title: "Add symbols",
      why: "Punctuation and symbols significantly increase complexity for attackers.",
    });
  }

  if (checks.hasRepeat) {
    tips.push({
      title: "Reduce repeated characters",
      why: "Runs like \"aaa\" or \"111\" match common patterns that cracking tools exploit.",
    });
  }

  if (checks.hasSequence) {
    tips.push({
      title: "Avoid keyboard or alphabet sequences",
      why: "Sequences such as \"123\" or \"abc\" appear in every major password dictionary.",
    });
  }

  if (password.length > 0 && /\s/.test(password)) {
    tips.push({
      title: "Consider avoiding spaces",
      why: "Some sites disallow spaces; passphrases with spaces can be strong if the site supports them.",
    });
  }

  for (const suggestion of zxcvbnSuggestions) {
    const alreadyCovered = tips.some(
      (t) => t.title.toLowerCase() === suggestion.toLowerCase(),
    );
    if (!alreadyCovered) {
      tips.push({
        title: suggestion,
        why: "Suggested by pattern analysis based on known weak structures.",
      });
    }
  }

  return tips;
}

export function analyzePassword(password: string): PasswordAnalysisResult {
  const normalizedCommon = password.trim().toLowerCase();
  const isCommonPassword = COMMON_PASSWORDS.has(normalizedCommon);

  const result = zxcvbn(password);
  const score = result.score as 0 | 1 | 2 | 3 | 4;
  const checks = runChecks(password);

  let warning: string | null = result.feedback.warning ?? null;
  const suggestions = [...result.feedback.suggestions];

  if (isCommonPassword && !warning) {
    warning = "This password is extremely common.";
  }

  const feedback = { warning, suggestions };

  const recommendations = buildRecommendations(
    password,
    checks,
    isCommonPassword,
    result.feedback.suggestions,
  );

  return {
    score,
    label: SCORE_LABELS[score]!,
    crackTimeDisplay: String(
      result.crack_times_display.offline_slow_hashing_1e4_per_second,
    ),
    feedback,
    checks,
    isCommonPassword,
    recommendations,
    disclaimer: PASSWORD_ANALYSIS_DISCLAIMER,
  };
}
