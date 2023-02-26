var express = require('express')
const { postInitPaiement } = require('../controllers')
var router = express.Router()

/* POST home page. */
router.post('/init_payment', postInitPaiement)

module.exports = router
