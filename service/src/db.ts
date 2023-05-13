/*
 * @Author: yxd3 abc8350712@gmail.com
 * @Date: 2023-05-12 20:28:59
 * @LastEditors: yxd3 abc8350712@gmail.com
 * @LastEditTime: 2023-05-13 10:34:55
 * @FilePath: /chatgpt-web/service/src/db.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import Redis from 'ioredis'
const client = new Redis('redis://default:59fe96a363b44a84ae66c650a751eb74@usw1-gorgeous-ibex-34232.upstash.io:34232')
export default client
