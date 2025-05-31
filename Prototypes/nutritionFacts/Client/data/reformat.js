#!/usr/bin/node

const fs = require('fs');

function parseValue(val) {
  if (!val || val.trim() === 'ND') {
    return 'ND';
  }

  const n = Number(val.replace(/[\*,]/g, '').trim());
  return isNaN(n) ? val.trim() : n;
}

function readDataFile(path) {
  const content = fs.readFileSync(path, 'utf-8').trim();
  const lines = content
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'));

  return lines;
}

function reformatData(lines) {
  const headers = lines[0].split('|').map(h => h.trim());

                     // Ignore header line
  const vals = lines.slice(1).reduce(
    (acc, line) => {
      const cols = line.split('|').map(c => c.trim())  // Need section title cols[0]
      const colvals = cols.slice(1);  // Leave section title out of section contents

      const obj = {};
      headers.slice(1).forEach((h, i) => {
        obj[h] = parseValue(colvals[i]);
      });

      acc[cols[0]] = obj;
      return acc;
    },
    {});

  const ret = {};
  ret[headers[0]] = vals;
  return ret;
}

const filePath = process.argv[2];
if (!filePath) {
    console.log('Usage: ./reformat.js file.bsv')
     process.exit(1);
}

const lines = readDataFile(filePath);
const data = reformatData(lines)
console.log(JSON.stringify(data, null, 2));
