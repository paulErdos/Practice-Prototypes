#!/usr/bin/node

// Naturally suited toward sequence types / values from iterable objs
const a = [9, 8, 7, 6]
for(const value of a){  // ye olde phrasing
    console.log(value)
}


// How does it work for objs?
console.log('\n\n----------------\n')

const b = {0: 1, 1: 0, 2: 1, 3: 0}

try {
    for(const key of b) {
        console.log(key, b[key])
    }
} catch (error) {
    console.log('for..of only applies to iterables')
    console.log('look:\n')
    console.log(error);
}

