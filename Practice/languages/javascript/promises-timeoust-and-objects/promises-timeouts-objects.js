#!/usr/bin/env node

var theClass = function() {
    this.someFunction = function() { return 1 }
}

const some_class = new theClass()
console.log(some_class.someFunction())

var foo = { baz: 1, bar: 0, qux: 2 }
console.log(foo)
console.log(Object.keys(foo))
console.log(Object.keys(foo).includes('qux'))

// Truthiness of objects
console.log('Nonempty objects are...')
if(foo) { console.log('truthy') } else { console.log('falsey\n') }
console.log('empty objects are ...')
if({}) { console.log('truthy') } else { console.log('falsey\n') }

// Object length
console.log('Empty object keys has length...')
console.log(Object.keys({}).length)
