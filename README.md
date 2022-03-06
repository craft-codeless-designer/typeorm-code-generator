<h1 align="center">typeorm-code-generator</h1>

typeorm-code-generator ，简称 tcg ，是一个小工具，专门用来生成 typeorm 定义的实体类，以及对应的 Koa CRUD 接口，没有其它用途。

@see https://typeorm.io
@see https://koajs.com/

## 1. 用法

typeorm-code-generator 支持两种用法：

- 在命令行中调用，就像调用 cli 脚手架工具一样
- 在 nodejs(koa) 代码中调用

用法细节请参考下面的例子。

### 1.1 在命令行中调用

- 在你的项目中安装 tcg： npm i typeorm-code-generator --save (yarn add typeorm-code-generator)
- 编写配置文件：your_json_file.json ，语法参考 typeorm 官方文档 https://typeorm.io/#/separating-entity-definition ，唯一的注意点：所有 JS 内置的类型都需要采用字符串写法，例如 type:"String" ，而不能写成 type:String ，因为 JSON 格式不能接受函数类型，其它写法与 typeorm 官方定义的写法完全一致。
- 批量生成实体类和 CRUD 接口： tcg g -i your_json_file.json

```javascript
tcg g -i your_json_file.json
```

json 文件中的内容：

```javascript
[
  {
    columns: {
      age: {
        nullable: false,
        type: 'Number',
      },
      firstName: {
        length: 30,
        type: 'String',
      },
      id: {
        generated: 'increment',
        primary: true,
        type: 'int',
      },
      lastName: {
        length: 50,
        nullable: false,
        type: 'String',
      },
    },
    name: 'category',
  },
];
```

生成的代码示例：

```javascript
/**
 * This file is genarated by typeorm-code-generator, it may be overwrited at any time.
 * Please do NOT modify this file mannually.
 */

import { EntitySchema } from 'typeorm';

/**
 * @class Category
 * @author 大漠穷秋<damoqiongqiu@126.com>
 */
export const Category = new EntitySchema(
  JSON.parse(
    '{"columns":{"age":{"nullable":false,"type":Number},"firstName":{"length":30,"type":String},"id":{"generated":"increment","primary":true,"type":"int"},"lastName":{"length":50,"nullable":false,"type":String}},"name":"Category"}',
  ),
);
```

```javascript

/**
 * This file is genarated by typeorm-code-generator, it may be overwrited at any time.
 * Please do NOT modify this file mannually.
 */

import { Context } from 'koa';
import { isNil } from 'lodash';
import { getManager } from 'typeorm';
import { Category } from './Category';
import { router } from '../router';

/**
 * @class CategoryController
 * @author 大漠穷秋<damoqiongqiu@126.com>
 */
export default class CategoryController {
  /**
   * 列出所有记录，不带分页。
   */
  public static async categoryList(ctx: Context) {
    const categoryRepository = getManager().getRepository(Category);
    const list = await categoryRepository.find();

    ctx.status = 200;
    ctx.body = list;
  }

  public static async getCategory(ctx: Context) {
    const categoryRepository = getManager().getRepository(Category);
    const category = await categoryRepository.createQueryBuilder().where({ id: ctx.params.id }).getOne();
    ctx.status = 200;
    ctx.body = category;
  }

  public static async saveCategory(ctx: Context) {
    const categoryRepository = getManager().getRepository(Category);
    const newCategory=JSON.parse(ctx.request.body.Category);
    const category = await categoryRepository.save(newCategory);
    ctx.status = 200;
    ctx.body = category;
  }

  public static async deleteById(ctx: Context) {
    const categoryRepository = getManager().getRepository(Category);
    const id = ctx.request.body.id;
    if (isNil(id)) {
      return;
    }
    const qb = categoryRepository.createQueryBuilder();
    const result = await qb.delete().from(Category).where(' id = :id', { id: id }).execute();
    ctx.status = 200;
    ctx.body = result;
  }
}

router.get('/api/category-list', CategoryController.categoryList);
router.get('/api/category/:id', CategoryController.getCategory);
router.post('/api/category/save', CategoryController.saveCategory);
router.delete('/api/category/:id', CategoryController.deleteById);

```

### 1.2 在 nodejs 代码中调用

```javascript
const { generate } = require('typeorm-code-generator');

// 默认把代码生成在 src/tcg-generated 目录中
// generate({ inputJSON: 'test.json' });
generate({ inputJSON: 'test.json', distPath: './src/test/test2/test3', entity: true, repository: true });
```

## 2. 注意点

tcg 的 peerDependencies 如下（已在 package.json 中定义，会自动安装）：

- "@koa/cors": "^3.1.0",
- "@koa/router": "^10.0.0",
- "camelcase": "^6.2.0",
- "commander": "^7.2.0",
- "cross-env": "^7.0.3",
- "hygen": "^6.1.0",
- "koa": "^2.13.1",
- "koa-bodyparser": "^4.3.0",
- "koa-jwt": "^4.0.1",
- "lodash": "^4.17.21",
- "shelljs": "^0.8.4",
- "typeorm": "^0.2.32"

其中，核心组件是 hygen ，它提供了模板代码的写法和生成工具。

## 3. License

[MIT licensed](./LICENSE).
