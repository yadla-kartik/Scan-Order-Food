const Food = require('../models/Food')
const User = require('../models/User')

function normalizePrice(value) {
  const parsed = Number(String(value).replace(/[^\d.]/g, ''))
  return Number.isFinite(parsed) ? parsed : 0
}

function getSummary(items) {
  const total = items.reduce((sum, item) => sum + normalizePrice(item.price) * Number(item.quantity || 1), 0)
  const gst = total * 0.18
  const serviceTip = total * 0.1
  return {
    total,
    gst,
    serviceTip,
    grandTotal: total + gst + serviceTip,
  }
}

async function getUserPendingItems(userId) {
  const foodItems = await Food.find({ 'userItem.createdBy': userId })
  return foodItems.flatMap((food) =>
    food.userItem.filter((item) =>
      String(item.createdBy) === String(userId) &&
      item.status === 'Pending' &&
      item.paymentStatus === 'Pending'
    )
  )
}

async function getDashboardOrders({ pendingOnly = false } = {}) {
  const users = await User.find({ isOrderDone: false }).lean()
  const foods = await Food.find({}).lean()
  const allItems = foods.flatMap((food) => food.userItem || [])

  return users.map((user, index) => {
    const items = allItems.filter((item) => {
      const sameUser = String(item.createdBy) === String(user._id)
      return pendingOnly ? sameUser && item.status === 'Pending' : sameUser
    })

    return {
      orderNo: 100 + index,
      user,
      items,
      summary: getSummary(items),
      paymentStatus: items[0]?.paymentStatus || 'Pending',
      paymentMode: items[0]?.payed || '',
      status: items.some((item) => item.status === 'Ready') ? 'Ready' : items[0]?.status || 'Pending',
    }
  }).filter((order) => order.items.length > 0)
}

function emitToDashboards(req, event, payload) {
  const io = req.app.get('io')
  if (!io) return
  io.to('admin').emit(event, payload)
  io.to('chef').emit(event, payload)
}

function emitToUser(req, userId, event, payload) {
  const io = req.app.get('io')
  if (!io || !userId) return
  io.to(`user:${userId}`).emit(event, payload)
}

module.exports = {
  emitToDashboards,
  emitToUser,
  getDashboardOrders,
  getSummary,
  getUserPendingItems,
  normalizePrice,
}
