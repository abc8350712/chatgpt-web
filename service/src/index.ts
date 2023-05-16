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

  // const username = req.params.username
  // const email = req.params.email
  // const password = req.params.password
  // // 为用户分配一个Redis key（例如，在递增计数器的基础上生成）
  // const userKey = username
  // const isUsernameExists = await client.exists(userKey)

  // // 使用 hmset 存储用户信息到 Redis hash
  // if (isUsernameExists) {
  //   // 返回错误状态和提示消息
  //   res.send({ message: 'Username already exists. Please choose another one.', isUsernameExists })
  // }
  // else {
  //   // client.hmset(username, {
  //   //   username,
  //   //   email,
  //   //   password,
  //   // })
  //   res.send({ message: 'User registered successfully', isUsernameExists })
  // }
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
// app.use('/api', router)
app.set('trust proxy', 1)
const port = 3002
app.listen(port, '0.0.0.0', () => globalThis.console.log('Server is running on port 3002'))
