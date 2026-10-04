# Word & Line Counter CLI

A small Node.js CLI that counts lines, words, and characters in text files.

## Setup
```bash
npm install   # no dependencies, but safe to run
```

## Usage
```bash
npm start sample.txt
npm start sample.txt other.txt
npm start -- sample.txt --top
```

## Features
- Counts lines (empty lines ignored), words, characters
- Multiple files at once
- `--top` flag shows the 5 most common words
- Colored output (ANSI)
- Graceful error for missing files