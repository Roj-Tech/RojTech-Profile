export type GeneratePasswordOptions = {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
};

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}|;:,.<>?";

const MIN_LENGTH = 8;
const MAX_LENGTH = 128;

function randomIndex(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function pickChar(pool: string): string {
  return pool[randomIndex(pool.length)]!;
}

function shuffle(chars: string[]): string[] {
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j]!, chars[i]!];
  }
  return chars;
}

export function generatePassword(options: GeneratePasswordOptions): string {
  const { uppercase, lowercase, numbers, symbols } = options;
  const pools: string[] = [];
  const required: string[] = [];

  if (uppercase) {
    pools.push(UPPERCASE);
    required.push(pickChar(UPPERCASE));
  }
  if (lowercase) {
    pools.push(LOWERCASE);
    required.push(pickChar(LOWERCASE));
  }
  if (numbers) {
    pools.push(NUMBERS);
    required.push(pickChar(NUMBERS));
  }
  if (symbols) {
    pools.push(SYMBOLS);
    required.push(pickChar(SYMBOLS));
  }

  if (pools.length === 0) {
    throw new Error("At least one character set must be selected.");
  }

  const length = Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, Math.floor(options.length)));
  const allChars = pools.join("");
  const chars: string[] = [...required];

  while (chars.length < length) {
    chars.push(pickChar(allChars));
  }

  return shuffle(chars).join("");
}
