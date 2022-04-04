/**
 * This file is genarated by typeorm-code-generator, it may be overwrited at any time. 
 * Please do NOT modify this file mannually.
 * 
 * NOTE: There must be a @koa/router config file in your project for the generated controllers.
 */

import { Context } from 'koa';
import { isNil } from 'lodash';
import { getManager } from 'typeorm';
import { User } from './User';
import { router } from '../router';// 实际运行时 Koa 的路由配置文件，在自动生成的代码中，编辑器可能会提示报错，请忽略，只要代码真正运行时能获取到这份配置文件即可。

/**
 * @class UserController
 * @author 大漠穷秋<damoqiongqiu@126.com>
 */ 
export default class UserController {
  /**
   * 列出所有记录，不带分页。
   * @param ctx
   */ 
  public static async userList(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const list = await userRepository.find();

    ctx.status = 200;
    ctx.body = list;
  }

  /**
   * 单表带分页，单条件排序
   * @param ctx
   */
  public static async categoryListPaging(ctx: Context) {
    const { offset = 0, limit = 10, orderBy = 'id', orderDirection = 'DESC' } = ctx.requset.body;

    const userRepository = getManager().getRepository(User);
    const qb = userRepository.createQueryBuilder();
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

  public static async getUser(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.createQueryBuilder().where({ id: ctx.params.id }).getOne();
    ctx.status = 200;
    ctx.body = user;
  }

  public static async saveUser(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const newUser=JSON.parse(ctx.request.body.User);
    const user = await userRepository.save(newUser);
    ctx.status = 200;
    ctx.body = user;
  }

  public static async deleteById(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const id = ctx.request.body.id;
    if (isNil(id)) {
      return;
    }
    const qb = userRepository.createQueryBuilder();
    const result = await qb.delete().from(User).where(' id = :id', { id: id }).execute();
    ctx.status = 200;
    ctx.body = result;
  }
}

router.get('/api/user-list', UserController.userList);
router.get('/api/user/:id', UserController.getUser);
router.post('/api/user/save', UserController.saveUser);
router.delete('/api/user/:id', UserController.deleteById);
