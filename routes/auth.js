const crypto = require('crypto')
const path = require('path')
const { Router } = require('express')
const multer = require('multer')
const debug = require('debug')('app:auth')
const { User } = require('../models/index.js')
const router = Router()
const upload = multer({ dest: path.join(__dirname, '..', 'public', 'uploads') })
const { toYmd } = require('../lib/date.js')

const SALT = 'abcdefg';

router.get('/signup', (req, res, next) => {
  return res.render('signup', {})
})

const check = async login => {
  if (!typeof login === 'string') {
    return 'weired'
  }
  if (!/^\w+$/.test(login)) {
    return 'username can only contain lowercase letters [a-z] and numbers [0-9]'
  }
  if (login === 'admin') {
    return 'you tried to create an admin user, srsly?'
  }

  debug('login', typeof login)
  const existing = await User.findOne({ where: { login }})
  if (existing) {
    return 'username already exists, please choose a different one'
  }
  // no error
  return null
}

const sphynx = login => {
  const token = tokenize(login, 'man')
  return {
    question: 'Which creature walks on four legs in the morning two legs in the afternoon and three legs in the evening?',
    token,
  }
}

const tokenize = (login, cypher) =>
  crypto.createHmac('sha256', login + SALT).update(cypher).digest('base64')

router.post('/signup', async (req, res, next) => {
  const { login } = req.body
  debug('/signup with login', login)
  console.log(req.body)
  const error = await check(login)
  if (error) {
    return res.render('signup', { error })
  }
  const { question, token } = await sphynx(login)
  return res.render('challenge', { login, question, token })
})

router.post('/challenge', async (req, res, next) => {
  const { attempt, login, question, token } = req.body
  debug('/signup with login', login)

  const challenge = tokenize(login, attempt)
  debug({challenge, token})
  if (challenge !== token) {
    return res.render('signup', { error: 'incorrect answer', login })
  }
  const secret = Math.random().toString(36).slice(2)
  return res.render('success', { login, secret })
})

module.exports = router
