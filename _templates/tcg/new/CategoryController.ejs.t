---
to: ./src/test/test2/test3/CategoryController.ts
---

/**
 * This file is genarated by typeorm-code-generator, it may be overwrited at any time. 
 * Please do NOT modify this file mannually.
 * 
 * NOTE: There must be a @koa/router config file in your project for the generated controllers.
 */

import { Context } from 'koa';
import { isNil } from 'lodash';
import { getManager } from 'typeorm';
import { Category } from './Category';
import { router } from '../router';//@koa/router config in your project.

/**
 * @class CategoryController
 * @author 大漠穷秋<damoqiongqiu@126.com>
 */ 
export default class CategoryController {
  /**
   * 列出所有记录，不带分页。
   * @param ctx
   */ 
  public static async categoryList(ctx: Context) {
    const categoryRepository = getManager().getRepository(Category);
    const list = await categoryRepository.find();

    ctx.status = 200;
    ctx.body = list;
  }

  /**
   * 单表带分页，单条件排序
   * @param ctx
   */
  public static async categoryListPaging(ctx: Context) {
    const { offset = 0, limit = 10, orderBy = 'id', orderDirection = 'DESC' } = ctx.requset.body;

    const categoryRepository = getManager().getRepository(Category);
    const qb = categoryRepository.createQueryBuilder();
    const list = await qb
      .select()
      .orderBy(orderBy, orderDirection)
      .skip(offset) //从第?行开始取
      .take(limit) //取?条结果
      .getRawMany();

    //获取总条数
    const totalCount = await qb.select(`COUNT(DISTINCT ${orderBy}) as total`).getRawOne();

    ctx.status = 200;
    ctx.body = { dataSet: list, ...totalCount };
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
