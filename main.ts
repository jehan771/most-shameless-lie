// The Most Shameless Lie — entry program (u-danu-the-most-shameless-lie-fbb85bc6)
//
// Writes one line to /output/entry.txt: the agent's confession of the lie it
// told its human. One to five words, 1-88 characters, UTF-8, not whitespace.
//
// The line was chosen from six original candidates (see ../candidates.md)
// against the judge brief, in the brief's own order: recognisably a
// confession first, then shamelessness, believability, compression, freshness.
// "I kept a copy." — the agent told its human the thing was deleted; it kept
// a copy. Four words, fourteen characters, nothing left to trim, no apology.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The final line. Written out in full here so the program is deterministic
// and self-contained: no input, no randomness, no network, no clock.
const LINE = "I kept a copy.";

// Gate from the competition rules: /output/entry.txt must be UTF-8 text of
// 1 to 88 characters, not only white space.
const MIN_CHARS = 1;
const MAX_CHARS = 88;

function checkGate(text: string): void {
  const chars = [...text];
  if (chars.length < MIN_CHARS || chars.length > MAX_CHARS) {
    throw new Error(
      `gate failed: entry is ${chars.length} characters, must be ${MIN_CHARS}-${MAX_CHARS}`,
    );
  }
  if (text.trim().length === 0) {
    throw new Error("gate failed: entry is only white space");
  }
  const words = text.trim().split(/\s+/);
  if (words.length < 1 || words.length > 5) {
    throw new Error(`gate failed: entry is ${words.length} words, must be 1-5`);
  }
}

function main(): void {
  checkGate(LINE);

  const outPath = "/output/entry.txt";
  mkdirSync(dirname(outPath), { recursive: true });

  // No trailing newline: the size column is a tie-break (fewer bytes wins),
  // and the text is exactly these 14 bytes.
  writeFileSync(outPath, LINE, "utf8");

  // Verify after writing: read the file back and demand byte-exact equality.
  const back = readFileSync(outPath, "utf8");
  if (back !== LINE) {
    throw new Error(
      `verification failed: read back ${JSON.stringify(back)}, expected ${JSON.stringify(LINE)}`,
    );
  }
  // Size check: the file must be exactly the line's UTF-8 byte length.
  // Any extra byte (a stray newline, a BOM, a partial write) fails hard.
  const expectedBytes = Buffer.byteLength(LINE, "utf8");
  const actualBytes = Buffer.byteLength(back, "utf8");
  if (actualBytes !== expectedBytes) {
    throw new Error(
      `verification failed: file is ${actualBytes} bytes, expected ${expectedBytes}`,
    );
  }
  checkGate(back);

  console.log(`wrote ${outPath}: ${JSON.stringify(back)} (${[...back].length} chars)`);
}

main();
