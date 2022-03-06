const { banner } = require('./banner');
const camelcase = require('camelcase');

/**
 * 生成 Respository 模板，默认单表 CRUD 接口。
 * TODO:增加单表带分页的默认接口。
 * @param {*} schema
 * @param {*} tcgOptions
 * @returns
 */
function generateRepositoryTemplate(schema, tcgOptions) {
  const schemaName = schema.name;
  const schemaNameCamelUpper = camelcase(schemaName, {
    pascalCase: true,
  });
  const schemaNameCamelLower = camelcase(schemaName, {
    pascalCase: false,
  });
  const repositoryClassName = `${schemaNameCamelUpper}Controller`;
  const repositoryFilePath = `${tcgOptions.templateFilePath}/${repositoryClassName}.ejs.t`;

  //不要格式化下面的字符串， hygen 模板对字符串格式有要求，错误的空格或者 Tab　键会导致报错。
  const repositoryFileContent = `---
to: ${tcgOptions.distPath}/${repositoryClassName}.ts
---
${banner}
import { Context } from 'koa';
import { isNil } from 'lodash';
import { getManager } from 'typeorm';
import { ${schemaNameCamelUpper} } from './${schemaNameCamelUpper}';
import { router } from '${tcgOptions.router}';//@koa/router config in your project.

/**
 * @class ${repositoryClassName}
 * @author 大漠穷秋<damoqiongqiu@126.com>
 */ 
export default class ${repositoryClassName} {
  /**
   * 列出所有记录，不带分页。
   * @param ctx
   */ 
  public static async ${schemaNameCamelLower}List(ctx: Context) {
    const ${schemaNameCamelLower}Repository = getManager().getRepository(${schemaNameCamelUpper});
    const list = await ${schemaNameCamelLower}Repository.find();

    ctx.status = 200;
    ctx.body = list;
  }

  /**
   * 单表带分页，单条件排序
   * @param ctx
   */
  public static async categoryListPaging(ctx: Context) {
    const { offset = 0, limit = 10, orderBy = 'id', orderDirection = 'DESC' } = ctx.requset.body;

    const ${schemaNameCamelLower}Repository = getManager().getRepository(${schemaNameCamelUpper});
    const qb = ${schemaNameCamelLower}Repository.createQueryBuilder();
    const list = await qb
      .select()
      .orderBy(orderBy, orderDirection)
      .skip(offset) //从第?行开始取
      .take(limit) //取?条结果
      .getRawMany();

    //获取总条数
    const totalCount = await qb.select(\`COUNT(DISTINCT \u0024{orderBy}) as total\`).getRawOne();

    ctx.status = 200;
    ctx.body = { dataSet: list, ...totalCount };
  }

  public static async get${schemaNameCamelUpper}(ctx: Context) {
    const ${schemaNameCamelLower}Repository = getManager().getRepository(${schemaNameCamelUpper});
    const ${schemaNameCamelLower} = await ${schemaNameCamelLower}Repository.createQueryBuilder().where({ id: ctx.params.id }).getOne();
    ctx.status = 200;
    ctx.body = ${schemaNameCamelLower};
  }

  public static async save${schemaNameCamelUpper}(ctx: Context) {
    const ${schemaNameCamelLower}Repository = getManager().getRepository(${schemaNameCamelUpper});
    const new${schemaNameCamelUpper}=JSON.parse(ctx.request.body.${schemaNameCamelUpper});
    const ${schemaNameCamelLower} = await ${schemaNameCamelLower}Repository.save(new${schemaNameCamelUpper});
    ctx.status = 200;
    ctx.body = ${schemaNameCamelLower};
  }

  public static async deleteById(ctx: Context) {
    const ${schemaNameCamelLower}Repository = getManager().getRepository(${schemaNameCamelUpper});
    const id = ctx.request.body.id;
    if (isNil(id)) {
      return;
    }
    const qb = ${schemaNameCamelLower}Repository.createQueryBuilder();
    const result = await qb.delete().from(${schemaNameCamelUpper}).where(' id = :id', { id: id }).execute();
    ctx.status = 200;
    ctx.body = result;
  }
}

router.get('/api/${schemaNameCamelLower}-list', ${repositoryClassName}.${schemaNameCamelLower}List);
router.get('/api/${schemaNameCamelLower}/:id', ${repositoryClassName}.get${schemaNameCamelUpper});
router.post('/api/${schemaNameCamelLower}/save', ${repositoryClassName}.save${schemaNameCamelUpper});
router.delete('/api/${schemaNameCamelLower}/:id', ${repositoryClassName}.deleteById);
`;
  return {
    filePath: repositoryFilePath,
    fileContent: repositoryFileContent,
  };
}

module.exports.generateRepositoryTemplate = generateRepositoryTemplate;
