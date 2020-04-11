const path = require('path')
const { Router } = require('express')
const multer = require('multer')
const { Message, User } = require('../models/index.js')
const router = Router()
const upload = multer({ dest: path.join(__dirname, '..', 'public', 'uploads') })
const { toYmd } = require('../lib/date.js')

router.get('/', async (req, res, next) => {
  try {
    const contributions = await Message.findAll({
      where: { parent_id: 0 },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'title', 'createdAt'],
      include: [User],
    })
    console.log({ contributions, us: contributions.User })
    return res.render('list', { contributions, toYmd })
  } catch (err) {
    return next(err)
  }
})

router.get('/:id(\\d+)', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10)
    if (id === 0) {
      return res.redirect(301, '/m/')
    }
    const message = await Message.findOne({
      where: { id },
      include: [User],
    })
    const contributions = await Message.findAll({
      where: { parent_id: id },
      // order: [['createdAt', 'DESC']],
      include: [User],
    })
    const { title, body, createdAt, User: author } = message
    console.log({ message, user: message.User })

    return res.render('message', {
      id,
      title,
      body,
      createdAt,
      author,
      contributions,
      toYmd,
    })
  } catch (err) {
    return next(err)
  }
})

router.post('/p', upload.single('message'), async (req, res, next) => {
  try {
    const { parent, title, body, file, login, secret } = req.body
    const auth = await User.findAndCountAll({
      where: { login, secret }
    })
    if (!auth.count) {
      return next()
    }
    console.log('user', auth.rows[0].id, 'parent', parent)
    const message = await Message.create({
      parent_id: Number(parent),
      title,
      body,
      file,
      user_id: auth.rows[0].id
    })

    if (message) {
      console.log(message)
      return res.redirect(`/m/${message.id}`)
    }

  } catch (err) {
    return next(err)
  }
  return Message.create({
    title,
    body,
    file,
  })
    .then(message => res.redirect(301, '/message'))
    .catch(err => {
      console.log(
        '***There was an error creating a message',
        JSON.stringify(message),
      )
      return res.status(400).send(err)
    })
})

router.get('/new', (req, res, next) => {
  return res.render('new', {})
})

module.exports = router
