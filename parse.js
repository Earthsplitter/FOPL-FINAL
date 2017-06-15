let estel = require('./src/index');
let parser = require('esprima');

let scope = estel.createScope();
let ast = parser.parse(`
    function fn(a, b) {
        return () => this.someProp + arguments[0] + arguments[1];
    };
     let obj = { someProp: 10, fn };
     let closure = obj.fn(1, 2);
     let result = closure();
`);


estel.processNames(ast, scope);
estel.processValues(ast);

let resultRef = scope.getReference('result');

console.log(scope.getReferenceNames()); // [ 'fn', 'obj', 'closure', 'result' ]
console.log(resultRef.value); // 13