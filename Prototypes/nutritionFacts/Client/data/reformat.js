#!/usr/bin/node

const fs = require('fs');

function parseValue(val) {
  if (!val) return null;
  const trimmed = val.trim();
  if (trimmed === 'ND') return 'ND';
  const n = Number(val.replace(/[\*,]/g, '').trim());
  return isNaN(n) ? val.trim() : n;
}

function readDataFile(path) {
  const content = fs.readFileSync(path, 'utf-8').trim();
  const lines = content
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'));
  const headers = lines[0].split('|').map(h => h.trim());
  const keyHeader = headers[0];

  return lines.slice(1).reduce((acc, line) => {
    const cols = line.split('|').map(c => c.trim());
    while (cols.length < headers.length) cols.push('');
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = parseValue(cols[i]);
    });
    acc[obj[keyHeader]] = obj;
    return acc;
  }, {});
}

const filePath = process.argv[2];
if (!filePath) process.exit(1);

const dataByGroup = readDataFile(filePath);
console.log(dataByGroup);

