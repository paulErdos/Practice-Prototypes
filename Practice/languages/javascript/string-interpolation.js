#!/usr/bin/env node

const foobar = '<[ This will be interpolated into another string ]>';
console.log(`backticks-surrounded string overall, with $, then immediately a pair of curly braces containing the name of a variable. The following is the value of the variable foobar: ${foobar}`)
