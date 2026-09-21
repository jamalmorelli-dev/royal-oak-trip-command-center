import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

function getFilesRecursively(dir, extensions = ['.js', '.jsx', '.json']) {
  let results = [];
  const list = readdirSync(dir);
  for (const file of list) {
    const fullPath = join(dir, file);
    const stat = statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath, extensions));
    } else if (extensions.some(ext => file.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

describe('Strict Negative Constraints', () => {
  const rootDir = join(__dirname, '..');
  const appDir = join(rootDir, 'app');
  const appFiles = getFilesRecursively(appDir);

  it('contains zero instances of ROHS acronym', () => {
    for (const filePath of appFiles) {
      const content = readFileSync(filePath, 'utf8');
      expect(content).not.toMatch(/\bROHS\b/);
    }
  });

  it('contains zero instances of Ravens mascot or team nickname', () => {
    for (const filePath of appFiles) {
      const content = readFileSync(filePath, 'utf8');
      expect(content).not.toMatch(/\bRavens\b/i);
    }
  });

  it('contains zero instances of Blue & Silver colors phrase', () => {
    for (const filePath of appFiles) {
      const content = readFileSync(filePath, 'utf8');
      expect(content).not.toMatch(/Blue\s*&\s*Silver/i);
    }
  });

  it('contains zero instances of excluded Venmo reimbursement amounts ($53.75, $24.30)', () => {
    for (const filePath of appFiles) {
      const content = readFileSync(filePath, 'utf8');
      expect(content).not.toContain('53.75');
      expect(content).not.toContain('24.30');
      expect(content).not.toMatch(/Fresh Groceries for Soraya/i);
      expect(content).not.toMatch(/Target Art & Notebook Supplies/i);
    }
  });
});
