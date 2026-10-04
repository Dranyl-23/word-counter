import { readFile } from 'fs/promises';
import path from 'path';

// ANSI colors
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

// 1. Read args
const args = process.argv.slice(2);
const showTop = args.includes('--top');
const files = args.filter((arg) => !arg.startsWith('--'));

// 2. No filename? Print help and exit
if (files.length === 0) {
  console.log(`${c.yellow}Usage:${c.reset} npm start -- <file> [file2 ...] [--top]`);
  console.log('Example: npm start sample.txt');
  process.exit(1);
}

// 3. Counter logic
function analyze(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim() !== '');
  const words = text.split(/\s+/).filter(Boolean);
  return {
    lines: lines.length,
    words: words.length,
    characters: text.length,
    wordList: words,
  };
}

function topWords(wordList, n = 5) {
  const freq = {};
  for (const w of wordList) {
    const clean = w.toLowerCase().replace(/[^a-z0-9']/g, '');
    if (clean) freq[clean] = (freq[clean] || 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

// 4. Process each file
for (const file of files) {
  try {
    const fullPath = path.resolve(process.cwd(), file);
    const text = await readFile(fullPath, 'utf-8');
    const result = analyze(text);

    console.log(`\n${c.bold}${c.cyan}File:${c.reset} ${path.basename(fullPath)}`);
    console.log(`${c.green}Lines:${c.reset} ${result.lines}`);
    console.log(`${c.green}Words:${c.reset} ${result.words}`);
    console.log(`${c.green}Characters:${c.reset} ${result.characters}`);

    if (showTop) {
      console.log(`${c.yellow}Top 5 words:${c.reset}`);
      topWords(result.wordList).forEach(([word, count], i) => {
        console.log(`  ${i + 1}. ${word} (${count})`);
      });
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error(`${c.red}Error:${c.reset} File not found: ${file}`);
    } else {
      console.error(`${c.red}Error:${c.reset} ${err.message}`);
    }
  }
}