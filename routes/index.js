const express = require('express')
const router = express.Router()
const rev = require('../lib/rev.js')

const version = rev().substring(0, 7)

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express', version })
})

module.exports = router
