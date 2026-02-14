const assert = require('assert');
const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
const { hasUseSection } = require('../validate-skills');

const samples = [
  ['## When to Use', true],
  ['## Use this skill when', true],
  ['## When to Use This Skill', true],
  ['## Overview', false],
];

for (const [heading, expected] of samples) {
  const content = `\n${heading}\n- item\n`;
  assert.strictEqual(hasUseSection(content), expected, heading);
}

const skillsDir = path.resolve(__dirname, '../../skills');
for (const entry of fs.readdirSync(skillsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const skillFile = path.join(skillsDir, entry.name, 'SKILL.md');
  if (!fs.existsSync(skillFile)) continue;
  const content = fs.readFileSync(skillFile, 'utf8');
  if (!content.startsWith('---\n')) continue;
  const fmEnd = content.indexOf('\n---\n', 4);
  if (fmEnd === -1) continue;
  const frontmatter = content.slice(4, fmEnd);
  assert.doesNotThrow(() => YAML.parse(frontmatter), `${entry.name} has invalid frontmatter YAML`);
}

console.log('ok');
