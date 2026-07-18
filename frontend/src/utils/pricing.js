import { menuItems } from '../data/menuData'

export function money(value) {
  return `Rs ${value.toFixed(2)}`
}

export function getCartItems(cart) {
  return menuItems
    .filter((item) => cart[item.id])
    .map((item) => ({
      ...item,
      quantity: cart[item.id],
      amount: item.price * cart[item.id],
    }))
}

export function getCartSummary(cart) {
  const items = getCartItems(cart)
  return getItemsSummary(items)
}

export function getItemsSummary(items = []) {
  const total = items.reduce((sum, item) => sum + item.amount, 0)
  const gst = total * 0.18
  const serviceTip = total * 0.1
  const grandTotal = total + gst + serviceTip

  return { items, total, gst, serviceTip, grandTotal }
}
