const Calculator = require('./test-module-1');

const calc1 = new Calculator();

console.log(calc1.add(2, 5));

const { add, multiply, divide } = require('./test-module-2');

console.log(multiply(2, 8));

require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();
