---
to: ../src/test/test2/test3/User.ts
---

/**
 * This file is genarated by typeorm-code-generator, it may be overwrited at any time. 
 * Please do NOT modify this file mannually.
 * 
 * NOTE: There must be a @koa/router config file in your project for the generated controllers.
 */

import {EntitySchema} from "typeorm";

/**
 * @class User
 * @author 大漠穷秋<damoqiongqiu@126.com>
 */ 
export const User = new EntitySchema(JSON.parse('{"name":"User","columns":{"id":{"name":"id","type":"varchar","primary":false,"generated":false,"nullable":false,"length":128},"name":{"name":"name","type":"varchar","primary":false,"generated":false,"nullable":true,"length":128}},"relations":{"roles":{"type":"many-to-many","target":"Role","joinTable":{"target":"Role"}}}}'));
