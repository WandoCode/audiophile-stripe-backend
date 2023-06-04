const { getItemPrice } = require('../helpers/number')
const getItemsPrice = require('../store/getItemsPrice')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.postInitPaiement = async (req, res) => {
  const SHIPPING = 5000
  const { stripeDatas } = req.body

  try {
    const itemsSlug = getItemsSlug(stripeDatas)
    const itemsPrice = await getItemsPrice(itemsSlug)
    const totalPrice = await getTotalAmount(stripeDatas, itemsPrice, SHIPPING)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice,
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
    })

    const { client_secret } = paymentIntent
    res.json({ client_secret })
  } catch (error) {
    if (error?.response?.status)
      res.status(error.response.status).json({ error: error.message })
    else res.status(500).json({ error: error.message })

    return
  }
}

const getTotalAmount = async (stripeDatas, itemsPrice, SHIPPING) => {
  const cartAmount = getCartAmount(stripeDatas, itemsPrice)

  const totalPrice = SHIPPING + cartAmount

  return totalPrice
}

const getCartAmount = (stripeDatas, itemsPrice) => {
  const cartAmount = stripeDatas.reduce((prevValue, stripeObject) => {
    const unitPrice = getItemPrice(stripeObject.slug, itemsPrice)
    return prevValue + stripeObject.amount * unitPrice
  }, 0)

  return cartAmount
}

const getItemsSlug = (stripeDatas) => {
  return stripeDatas.map((item) => item.slug)
}

// TODO: dans le readme, préciser que j'ai utilisé un template comme boilerplate comme base à l'app express
