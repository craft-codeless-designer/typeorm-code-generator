/**
 * This file is genarated by typeorm-code-generator, it may be overwrited at any time. 
 * Please do NOT modify this file mannually.
 * 
 * NOTE: There must be a @koa/router config file in your project for the generated controllers.
 */

import {EntitySchema} from "typeorm";

/**
 * @class Category
 * @author 大漠穷秋<damoqiongqiu@126.com>
 */ 
export const Category = new EntitySchema(JSON.parse('{"columns":{"age":{"nullable":false,"type":Number},"firstName":{"length":30,"type":String},"id":{"generated":"increment","primary":true,"type":"int"},"lastName":{"length":50,"nullable":false,"type":String}},"name":"Category"}'));
