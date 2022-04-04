<h1 align="center">TCG: typeorm-code-generator</h1>

typeorm-code-generator ，简称 TCG ，是基于 hygen 二次开发的代码生成工具。

TCG 用来生成两种类型的源代码：

- typeorm 定义的实体类
- 实体类对应的 Koa CRUD 接口

@see http://www.hygen.io
@see https://typeorm.io
@see https://koajs.com/

## 1. 安装 hygen

唯一需要手动安装的是 hygen ，需要手动把它安装到全局空间中:

```shell
npm i -g hygen
```

不同环境中的安装方法请参考官方文档，http://www.hygen.io/docs/quick-start

## 2. 验证环境是否 OK

进入此项目根目录下的 /test 目录，执行如下命令：

```shell

node test.js

```

如果成功生成了模板文件和对应的代码，则说明环境已经 ready:

```shell
test
└─_templates
    └─tcg
        └─new
                Category.ejs.t
                CategoryController.ejs.t
```

```shell
src
└─test
    └─test2
        └─test3
                Category.ts
                CategoryController.ts
```

## 3. TCG 用法

TCG 支持两种用法：

- 在命令行中调用，就像调用 cli 脚手架工具一样
- 在 nodejs(koa) 代码中调用

### 3.1 在命令行中调用

- 在你的项目中安装 tcg： npm i typeorm-code-generator --save (yarn add typeorm-code-generator)
- 编写配置文件：your_json_file.json ，语法参考 typeorm 官方文档 https://typeorm.io/#/separating-entity-definition ，唯一的注意点：所有 JS 内置的类型都需要采用字符串写法，例如 type:"String" ，而不能写成 type:String ，因为 JSON 格式不能接受函数类型，其它写法与 typeorm 官方定义的写法完全一致。
- 批量生成实体类和 CRUD 接口： tcg g -i your_json_file.json

```javascript
tcg g -i your_json_file.json
```

json 配置文件中的内容：

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

### 3.2 在 nodejs 代码中调用

```javascript
const { generate } = require('typeorm-code-generator');

// 默认把代码生成在 src/tcg-generated 目录中
// generate({ inputJSON: 'test.json' });
generate({ inputJSON: 'test.json', distPath: './src/test/test2/test3', entity: true, repository: true });
```

可以在 nodejs 代码中进行调用之后，我们就可以动态生成 json 配置文件，然后用代码来生成代码了，在 https://github.com/craft-codeless-designer/craft-codeless-designer-demo 中提供了完整的例子，用图形化的方式生成 json 文件，然后调用 tcg 大批量生成实体类和 CRUD 接口。

## 4. License

[MIT licensed](./LICENSE).
