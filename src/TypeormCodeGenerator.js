const fs = require('fs');
const { execSync } = require('child_process');
const iconv = require('iconv-lite');
const encoding = 'cp936';
const binaryEncoding = 'binary';
const { generateEngityTemplate } = require('./EntityTemplate');
const { generateRepositoryTemplate } = require('./RepositoryTemplate');

/**
 * @author 大漠穷秋<damoqiongqiu@126.com>
 */
let tcgOptions = {
  inputJSON: '[]',
  templateFilePath: `_templates/tcg/new`, //TODO:hygen 没有暴露配置项，目前生成的模板文件只能位于根目录下的 _templates 目录。
  distPath: `src/tcg-generated`,
  entity: true,
  repository: true,
  router: '../router',
};

/**
 * 调用 hygen 生成最终 ts 代码
 */
function generateDistCode() {
  fs.rmdirSync(tcgOptions.distPath, { recursive: true, force: true });
  //prevent EPERM error on Windows, resource too busy
  setTimeout(() => {
    execSync('hygen tcg new', { encoding: binaryEncoding }, (error, stdout, stderr) => {
      if (error) {
        console.error(iconv.decode(Buffer.from(stdout, binaryEncoding), encoding));
        return;
      }
      if (stderr) {
        console.error(iconv.decode(Buffer.from(stderr, binaryEncoding), encoding));
        return;
      }
      console.log(iconv.decode(Buffer.from(stdout, binaryEncoding), encoding));
    });
  }, 300);
}

function ejsFileWriter(filePath, fileContent) {
  fs.mkdirSync(tcgOptions.templateFilePath, { recursive: true });
  fs.writeFileSync(filePath, fileContent);
}

function generateTemplate() {
  const schemaList = JSON.parse(tcgOptions.inputJSON);
  if (!schemaList || !schemaList.length) {
    console.warn('Empty schema list, nothing to do...');
    return false;
  }

  schemaList.forEach(schema => {
    if (tcgOptions.entity) {
      let { filePath, fileContent } = generateEngityTemplate(schema, tcgOptions);
      ejsFileWriter(filePath, fileContent);
    }

    if (tcgOptions.repository) {
      let { filePath, fileContent } = generateRepositoryTemplate(schema, tcgOptions);
      ejsFileWriter(filePath, fileContent);
    }
  });

  return true;
}

/**
 * 清除上一次生成的结果
 */
function clearFiles() {
  try {
    fs.rmdirSync(tcgOptions.distPath, { recursive: true, force: true });
  } catch (err) {
    console.error(err);
    return false;
  }
  return true;
}

function parseOptions(options) {
  //确保输入的 JSON 字符串或 JSON 文件路径正确。
  console.log(options);
  if (!options || !options.inputJSON) {
    console.error('No inputJSON found, nothing to do...');
    return false;
  }

  let counter = 0;
  try {
    let temp = JSON.parse(options.inputJSON);
    options.inputJSON = temp;
  } catch (err) {
    counter++;
  }

  try {
    const data = fs.readFileSync(options.inputJSON, 'utf8');
    options.inputJSON = data;
  } catch (err) {
    counter++;
  }

  if (counter >= 2) {
    console.error('Invalid input, neither a valid JSON string, nor a valid filepath.');
    return false;
  }

  tcgOptions = {
    ...tcgOptions,
    ...options,
  };
  return true;
}

//解析参数-->生成 hygen 模板-->生成目标代码
function generate(options) {
  parseOptions(options);
  clearFiles();
  generateTemplate();
  generateDistCode();
}

module.exports.generate = generate;
