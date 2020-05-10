const debug = require('debug')('app:message')
const path = require('path')
const { Router } = require('express')
const multer = require('multer')
const { Message, User, sequelize } = require('../models/index.js')
const router = Router()
const upload = multer({ dest: path.join(__dirname, '..', 'public', 'uploads') })
const { toYmd } = require('../lib/date.js')

const rootMesssage = {
  id: 0,
  title : 'welcome',
  body: 'please be polite',
  createdAt: new Date(),
  User: {
    login: 'root', uuid: 'root'
  }
}


const hierarchy = async id => {
  const query = `
  WITH RECURSIVE paths(id, name, path) AS (
      SELECT id, title, title from Messages where parent_id = 0
      UNION
      SELECT Messages.id, Messages.title, paths.path || '/' || Messages.title
      FROM Messages JOIN paths WHERE Messages.parent_id = Messages.id
  )
  SELECT id, path FROM paths`
  const h = await sequelize.query(query);
  console.log(h)
}

const parents = async id => {
  const query = `
  WITH RECURSIVE parents(id, title, parent_id) AS (
      SELECT id, title, parent_id from Messages where id = ${id || 0}
      UNION ALL
      SELECT Messages.id, Messages.title, Messages.parent_id
      FROM Messages, parents
      WHERE parents.parent_id = Messages.id AND Messages.id > 0
  )
  SELECT id, title, parent_id FROM parents`

  const list = await sequelize.query(query)
  return list
}

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
    const id = parseInt(req.params.id, 10) || 0

    const message = id
      ? await Message.findOne({
        where: { id },
        include: [User],
      })
      : rootMesssage

    const parent = message.parent_id > 0
    ? await Message.findOne({
        where: { id: message.parent_id },
        include: [User],
      })
    : rootMesssage

    const contributions = await Message.findAll({
      where: { parent_id: id },
      // order: [['createdAt', 'DESC']],
      include: [User],
    })
    const { title, body, createdAt, User: author } = message
    console.log({ message, user: message.User })

    const breadcrumbs = await parents(id).then(br => br.shift().reverse())

    return res.render('message', {
      id,
      title,
      body,
      createdAt,
      author,
      parent,
      contributions,
      breadcrumbs,
      toYmd,
    })
  } catch (err) {
    return next(err)
  }
})

router.post('/p', upload.single('message'), async (req, res, next) => {
  try {
    const { parent_id, title, body, file, login, secret } = req.body
    const auth = await User.findAndCountAll({
      where: { login, secret }
    })
    if (!auth.count) {
      return next()
    }
    console.log('user', auth.rows[0].id, 'parent', parent_id)
    const message = await Message.create({
      parent_id: Number(parent_id),
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
})

router.get('/new', (req, res, next) => {
  return res.render('new', {})
})

module.exports = router
