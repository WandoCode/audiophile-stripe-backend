var express = require('express')
var router = express.Router()
var prices = require('../pirces.test.json')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

/* GET home page. */
router.post('/make_payment', async function (req, res, next) {
  const { stripeDatas } = req.body
  const SHIPPING = 5000
  const cartPrice = stripeDatas.reduce((prevValue, stripeObject) => {
    const unitPrice = getItemPrice(stripeObject.slug)
    return prevValue + stripeObject.amount * unitPrice
  }, 0)

  const totalPrice = SHIPPING + cartPrice
  console.log(totalPrice)
  // TODO: validate amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalPrice,
    currency: 'eur',
    automatic_payment_methods: { enabled: true },
  })

  const { client_secret } = paymentIntent
  res.json({ client_secret })
})

module.exports = router

const getItemPrice = (slug) => {
  const itemDetails = prices.find((item) => item.slug === slug)

  return parseInt(itemDetails.price, 10)
}
