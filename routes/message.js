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
    const message = await Message.findByPk(id)
    const contributions = await Message.findAll({
      where: { parent_id: id },
      // order: [['createdAt', 'DESC']],
      include: [User],
    })
    const { title, body, createdAt } = message

    return res.render('message', {
      id,
      title,
      body,
      createdAt,
      contributions,
      toYmd,
    })
  } catch (err) {
    return next(err)
  }
})

router.post('/', upload.single('message'), (req, res, next) => {
  console.log(req.body, req)
  const title = req.body.title || 'untitled'
  const file = req.file.filename
  console.log(req.file.filename)

  return Message.create({
    title,
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
