import util from 'util'
import express from 'express'
import cors from 'cors'
import type { RequestProps } from './types'
import type { ChatMessage } from './chatgpt'
import { chatConfig, chatReplyProcess, currentModel } from './chatgpt'
import { auth } from './middleware/auth'
import { limiter } from './middleware/limiter'
import { isNotEmptyString } from './utils/is'
import client from './db'
const getAsync = util.promisify(client.get).bind(client)

const app = express()
const router = express.Router()
app.use(cors())

app.use(express.static('public'))
app.use(express.json())

app.all('*', (_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'authorization, Content-Type')
  res.header('Access-Control-Allow-Methods', '*')
  next()
})

router.get('/api/data', async (req, res) => {
  const data = await getAsync('foo')
  // console.log('ss===================')
  // console.log('Data:', data) // 输出获取到的数据

  res.status(200).json({ message: '/api/data call successful' })
})

router.post('/api/get_key/:key', async (req, res) => {
  const key = req.params.key
  // console.log('ss===================')
  // console.log('Data:', data) // 输出获取到的数据
  const value = await client.get(key)

  res.status(200).json({ key, value })
})

router.post('/api/get_hash/:key', async (req, res) => {
  const key = req.params.key
  // console.log('ss===================')
  // console.log('Data:', data) // 输出获取到的数据
  const hash = await client.hgetall(key)
  // res.status(200).json({ key, hash })

  res.send({ status: 'Success', message: '', data: { key, hash } })
})

// 确认请求的secret_key是否存在
router.post('/api/get_secret_key/:key', async (req, res) => {
  // const key = req.params
  // const { name, secret_key } = req.body
  const secret_key = req.params.key

  // const hash = await client.hgetall(key)
  // const secret_key = hash.secret_key
  // client = redis.createClient({ host: 'redis', port: 6379 })
  // _secret_key 是redis的list的key
  // 每个list的value是一个json
  // json和格式为{
  //  "cardID": "42767720-43a0-4eb1-ac59-a8b19e8f08fb",}
  client.lrange('_secret_key', 0, -1, (err, reply) => {
    if (err) {
      res.status(500).send({ status: 'Error', message: err.message, data: {} })
      return
    }
    const found = reply.some((item) => {
      const parsedItem = JSON.parse(item)
      return parsedItem.cardID === secret_key
    })
    if (found) {
      const key = 'yxd'
      const field = 'expire_datetime'
      const daysToAdd = 30

      client.hget(key, field, (err, value) => {
        if (err) {
          console.error('Error:', err)
          return
        }
        let newExpireDate
        if (value === null) {
          // 如果不存在expire_datetime，将其设置为当前日期加30天
          newExpireDate = new Date()
          newExpireDate.setDate(newExpireDate.getDate() + daysToAdd)
        }
        else {
          // 如果已存在expire_datetime，为其添加30天
          newExpireDate = new Date(value)
          newExpireDate.setDate(newExpireDate.getDate() + daysToAdd)
        }
        // 更新expire_datetime
        client.hmset(key, field, newExpireDate.toISOString(), () => {
          client.quit()
        })
      })
      res.send({ status: 'Success', message: 'Secret found!', data: { isFound: found } })
    }

    else { res.status(404).send({ status: 'Failed', message: 'Secret key not found', data: { isFound: found } }) }
  })
})

// 确认请求的secret_key是否存在
router.post('/api/decrease_chat_count/:key', async (req, res) => {
  const key = req.params.key
  // console.log('ss===================')
  // console.log('Data:', data) // 输出获取到的数据
  const hash = await client.hgetall(key)
  let free_count = hash.free_count

  const requestTimeString = hash.request_time
  const requestTime = new Date(requestTimeString)
  const nowTime = new Date()
  const expire_datetime_string = hash.expire_datetime
  const expire_datetime = new Date(expire_datetime_string)

  function areDatesInSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear()
      && date1.getMonth() === date2.getMonth()
      && date1.getDate() === date2.getDate()
  }
  const isSameDay = areDatesInSameDay(requestTime, nowTime)
  if (!isSameDay) {
    if (nowTime < expire_datetime)
      free_count = await client.get('_pay_count')

    else
      free_count = await client.get('_free_count')
  }
  if (+free_count === 0)
    res.send({ status: 'Success', message: ' free_count decreasetd!', data: { count: 0 } })
  const count = +(free_count) - 1

  client.hset(key, 'free_count', count.toString())
  client.hset(key, 'request_time', (new Date()).toISOString())

  res.send({ status: 'Success', message: ' free_count decreasetd!', data: { count } })
})

router.post('/api/update_request_time', async (req, res) => {
  client.hset('request_time', (new Date()).toString())
  res.send({ status: 'Success', message: ' free_count decreasetd!', data: {} })
})

router.post('/api/increase_chat_count/:key', async (req, res) => {
  const key = req.params.key
  // console.log('ss===================')
  // console.log('Data:', data) // 输出获取到的数据
  const hash = await client.hgetall(key)
  const free_count = hash.free_count

  client.hset(key, 'free_count', (+(free_count) + 100).toString())
  res.send({ status: 'Success', message: ' free_count decreasetd!', data: {} })
})

router.post('/api/register/:key', async (req, res) => {
  const key = req.params.key
  const { username, email, password } = req.body
  // console.log('ss===================')
  // console.log('Data:', data) // 输出获取到的数据
  const hash = await client.hgetall(key)
  // res.status(200).json({ key, hash })
  const isUsernameExists = await client.exists(username)

  if (isUsernameExists) {
    res.send({ status: 'Success', message: '', data: { key, hash, isUsernameExists } })
  }
  else {
    client.hmset(username, {
      username,
      email,
      password,
    })
    res.send({ status: 'Success', message: '', data: { key, hash, isUsernameExists } })
  }
})

router.post('/chat-process', [auth, limiter], async (req, res) => {
  res.setHeader('Content-type', 'application/octet-stream')

  try {
    const { prompt, options = {}, systemMessage, temperature, top_p } = req.body as RequestProps
    let firstChunk = true
    await chatReplyProcess({
      message: prompt,
      lastContext: options,
      process: (chat: ChatMessage) => {
        res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`)
        firstChunk = false
      },
      systemMessage,
      temperature,
      top_p,
    })
  }
  catch (error) {
    res.write(JSON.stringify(error))
  }
  finally {
    res.end()
  }
})

router.post('/config', auth, async (req, res) => {
  try {
    const response = await chatConfig()
    res.send(response)
  }
  catch (error) {
    res.send(error)
  }
})

router.post('/session', async (req, res) => {
  try {
    const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
    const hasAuth = isNotEmptyString(AUTH_SECRET_KEY)
    res.send({ status: 'Success', message: '', data: { auth: hasAuth, model: currentModel() } })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body as { token: string }
    if (!token)
      throw new Error('Secret key is empty')

    if (process.env.AUTH_SECRET_KEY !== token)
      throw new Error('密钥无效 | Secret key is invalid')

    res.send({ status: 'Success', message: 'Verify successfully', data: null })
  }
  catch (error) {
    res.send({ status: 'Fail', message: error.message, data: null })
  }
})

app.use('', router)
app.use('/api', router)
app.set('trust proxy', 1)
const port = 3002
app.listen(port, '0.0.0.0', () => globalThis.console.log('Server is running on port 3002'))
