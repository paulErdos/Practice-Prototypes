#!/usr/bin/node

// Same as Python

const a = {0: 1, 1: 0, 2: 1, 3: 0}

for(const key in a) {
    console.log(key, a[key])
}

console.log('\n\n----------------\n')


// Not as handy for array types
const b = [9, 8, 7, 6];
for(const key in b) {
    console.log(key, b[key])
}

