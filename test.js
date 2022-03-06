const { generate } = require('./src/TypeormCodeGenerator');

// generate({ inputJSON: 'test.json' });
generate({ inputJSON: './test.json', distPath: './src/test/test2/test3', entity: true, repository: true, router: '../router' });
