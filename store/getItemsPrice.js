const axios = require('axios')

const environment = process.env.NODE_ENV

const BASE_URL = 'https://audiophile-backend-production.up.railway.app'

const getItemsPrice = async (itemsSlug) => {
  const rep = await axios.post(BASE_URL + '/api/products/prices', itemsSlug)

  return rep.data
}

module.exports = getItemsPrice
