const { banner } = require('./banner');
const camelcase = require('camelcase');

/**
 * Primitive types of JavaScript.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects
 *
 * ColumnType define of typeorm.
 * @see https://github.com/typeorm/typeorm/blob/master/docs/entities.md#column-types
 * @see https://typeorm.io
 */
const jsPrimitiveTypes = [
  'null',
  'undefined',
  'Boolean',
  'Number',
  'String',
  'Symbol',
  'Object',
  'Function',
  'Array',
  'Set',
  'Map',
  'WeakSet',
  'WeakMap',
  'JSON',
  'Array',
  'Int8Array',
  'Uint8Array',
  'Uint8ClampedArray',
  'Int16Array',
  'Uint16Array',
  'Int32Array',
  'Uint32Array',
  'Float32Array',
  'Float64Array',
  'BigInt64Array',
  'BigUint64Array',
];

/**
 * 生成 Entity 模板
 * @param {*} schema
 * @param {*} tcgOptions
 * @returns
 */
function generateEngityTemplate(schema, tcgOptions) {
  const schemaName = schema.name;
  const schemaNameCamelUpper = camelcase(schemaName, {
    pascalCase: true,
  });
  const schemaNameCamelLower = camelcase(schemaName, {
    pascalCase: false,
  });
  const entityClassName = `${schemaNameCamelUpper}`;

  //替换 JS 原始类型字符串
  let schemaStr = JSON.stringify(schema);
  jsPrimitiveTypes.forEach(item => {
    schemaStr = schemaStr.replace(new RegExp(`\"${item}\"`, 'g'), item);
  });
  console.log(schemaStr);

  const entityFilePath = `${tcgOptions.templateFilePath}/${entityClassName}.ejs.t`;

  //不要格式化下面的字符串， hygen 模板对字符串格式有要求，错误的空格或者 Tab　键会导致报错。
  const entityFileContent = `---
to: ${tcgOptions.distPath}/${entityClassName}.ts
---
${banner}
import {EntitySchema} from "typeorm";

/**
 * @class ${entityClassName}
 * @author 大漠穷秋<damoqiongqiu@126.com>
 */ 
export const ${entityClassName} = new EntitySchema(JSON.parse('${schemaStr}'));
`;

  return {
    filePath: entityFilePath,
    fileContent: entityFileContent,
  };
}

module.exports.generateEngityTemplate = generateEngityTemplate;
