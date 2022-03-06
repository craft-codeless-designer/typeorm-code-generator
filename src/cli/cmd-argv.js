const { Command } = require('commander');
const generate = require('./cmd-handlers/handler-generate');
let pjson = require('../../package.json');

const program = new Command();
program.version(`v${pjson.version}`);

program
  .command('g')
  .description('Generate code')
  .requiredOption('-i,--inputJSON <inputJSON>', '输入 JSON 字符串，或者 JSON 文件路径')
  // .option('-t,--templateFilePath <templateFilePath>', 'templateFilePath') //TODO:hygen 没有暴露配置项，目前生成的模板文件只能位于根目录下的 _templates 目录。
  .option('-d,--distPath <distPath>', '最终生成代码的目录路径')
  .option('-e,--entity', 'entity', true)
  .option('-r,--repository', 'repository', true)
  .option('-router,--router <router>', '@koa/router file path', '../router')
  .action(function (options) {
    generate(options);
  });
program.parse(process.argv);
