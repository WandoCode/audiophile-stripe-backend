exports.getItemPrice = (slug, itemsPrice) => {
  const itemDetails = itemsPrice.find((item) => item.slug === slug)

  return parseInt(itemDetails.price, 10) * 100
}
