const express = require('express')
const Food = require('../../models/Food')
const User = require('../../models/User')
const { attachUser, requireAuth } = require('../../middlewares/auth')
const { generateJWT } = require('../../services/authService')
const { emitToDashboards, emitToUser, getDashboardOrders, getSummary, getUserPendingItems, normalizePrice } = require('../../services/orderService')

const router = express.Router()

router.use(attachUser)

function serializeItems(items) {
  return items.map((item) => {
    const plain = typeof item.toObject === 'function' ? item.toObject() : item
    return {
      ...plain,
      id: String(plain._id || plain.id),
      amount: normalizePrice(plain.price) * Number(plain.quantity || 1),
    }
  })
}

async function emitCart(req) {
  const rawItems = await getUserPendingItems(req.user._id)
  const items = serializeItems(rawItems)
  const payload = { user: req.user, items, summary: getSummary(items) }
  emitToUser(req, req.user._id, 'cart:updated', payload)
  emitToDashboards(req, 'order:cart-updated', payload)
  return payload
}

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Scan N Order API is healthy' })
})

router.post('/auth/login', async (req, res, next) => {
  try {
    const { fullname, mobileNo, role } = req.body
    let user = await User.findOne({ mobileNo })
    if (!user) {
      user = await User.create({ fullname: fullname || 'Guest User', mobileNo, role: role || 'customer' })
    }
    const token = generateJWT(user)
    res.cookie('userToken', token, { httpOnly: true, sameSite: 'lax' })
    res.json({ success: true, data: { user, token } })
  } catch (error) {
    next(error)
  }
})

router.post('/auth/logout', (req, res) => {
  res.clearCookie('userToken')
  res.json({ success: true })
})

router.get('/auth/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).lean()
    res.json({ success: true, data: { user } })
  } catch (error) {
    next(error)
  }
})

router.get('/cart', requireAuth, async (req, res, next) => {
  try {
    res.json({ success: true, data: await emitCart(req) })
  } catch (error) {
    next(error)
  }
})

router.post('/cart/items', requireAuth, async (req, res, next) => {
  try {
    const { name, description, price, imageUrl, itemImg } = req.body
    await Food.create({
      userItem: [{
        name,
        description,
        price: normalizePrice(price),
        imageUrl: imageUrl || itemImg,
        createdBy: req.user._id,
        quantity: 1,
        status: 'Pending',
        paymentStatus: 'Pending',
      }],
    })
    const payload = await emitCart(req)
    emitToDashboards(req, 'order:item-added', payload)
    res.status(201).json({ success: true, data: payload })
  } catch (error) {
    next(error)
  }
})

router.patch('/cart/items/:itemId', requireAuth, async (req, res, next) => {
  try {
    const quantity = Math.max(Number(req.body.quantity || 1), 1)
    await Food.updateOne({ 'userItem._id': req.params.itemId }, { $set: { 'userItem.$.quantity': quantity } })
    res.json({ success: true, data: await emitCart(req) })
  } catch (error) {
    next(error)
  }
})

router.delete('/cart/items/:itemId', requireAuth, async (req, res, next) => {
  try {
    await Food.updateOne({ 'userItem._id': req.params.itemId }, { $pull: { userItem: { _id: req.params.itemId } } })
    res.json({ success: true, data: await emitCart(req) })
  } catch (error) {
    next(error)
  }
})

router.delete('/cart', requireAuth, async (req, res, next) => {
  try {
    await Food.updateMany(
      { 'userItem.createdBy': req.user._id },
      { $pull: { userItem: { createdBy: req.user._id, status: 'Pending' } } }
    )
    res.json({ success: true, data: await emitCart(req) })
  } catch (error) {
    next(error)
  }
})

router.post('/orders/checkout', requireAuth, async (req, res, next) => {
  try {
    const paymentMode = req.body.paymentMode === 'Online' ? 'Online' : 'Cash On Counter'
    const paymentStatus = paymentMode === 'Online' ? 'Paid' : 'Not Paid'
    const rawItems = await getUserPendingItems(req.user._id)
    const items = serializeItems(rawItems)

    if (!items.length) {
      return res.status(400).json({ success: false, message: 'Cart is empty' })
    }

    await User.findByIdAndUpdate(req.user._id, { isOrderDone: false })
    await Food.updateMany(
      { 'userItem.createdBy': req.user._id, 'userItem.status': 'Pending' },
      { $set: { 'userItem.$[elem].paymentStatus': paymentStatus, 'userItem.$[elem].payed': paymentMode } },
      { arrayFilters: [{ 'elem.createdBy': req.user._id, 'elem.status': 'Pending' }] }
    )

    const payload = { user: req.user, items, summary: getSummary(items), paymentMode, paymentStatus, status: 'Pending' }
    emitToUser(req, req.user._id, 'order:placed', payload)
    emitToDashboards(req, 'order:created', payload)
    res.status(201).json({ success: true, data: payload })
  } catch (error) {
    next(error)
  }
})

router.get('/orders/my', requireAuth, async (req, res, next) => {
  try {
    const foods = await Food.find({ 'userItem.createdBy': req.user._id }).lean()
    const items = serializeItems(foods.flatMap((food) => food.userItem || []).filter((item) => String(item.createdBy) === String(req.user._id)))
    res.json({ success: true, data: { items, summary: getSummary(items) } })
  } catch (error) {
    next(error)
  }
})

router.get('/chef/orders', async (req, res, next) => {
  try {
    res.json({ success: true, data: await getDashboardOrders({ pendingOnly: true }) })
  } catch (error) {
    next(error)
  }
})

router.get('/admin/orders', async (req, res, next) => {
  try {
    res.json({ success: true, data: await getDashboardOrders() })
  } catch (error) {
    next(error)
  }
})

router.patch('/chef/orders/:userId/status', async (req, res, next) => {
  try {
    const status = req.body.status === 'Preparing' ? 'Preparing' : 'Ready'
    await Food.updateMany(
      { 'userItem.createdBy': req.params.userId, 'userItem.status': { $in: ['Pending', 'Preparing'] } },
      { $set: { 'userItem.$[elem].status': status } },
      { arrayFilters: [{ 'elem.createdBy': req.params.userId, 'elem.status': { $in: ['Pending', 'Preparing'] } }] }
    )
    const event = status === 'Ready' ? 'order:ready' : 'order:preparing'
    const payload = { userId: req.params.userId, status, message: status === 'Ready' ? 'Your order is ready.' : 'Your order is being prepared.' }
    emitToUser(req, req.params.userId, event, payload)
    emitToDashboards(req, 'order:updated', payload)
    res.json({ success: true, data: payload })
  } catch (error) {
    next(error)
  }
})

router.patch('/admin/orders/:userId/paid', async (req, res, next) => {
  try {
    await Food.updateMany(
      { 'userItem.createdBy': req.params.userId, 'userItem.paymentStatus': { $in: ['Not Paid', 'Pending'] } },
      { $set: { 'userItem.$[elem].paymentStatus': 'Paid' } },
      { arrayFilters: [{ 'elem.createdBy': req.params.userId, 'elem.paymentStatus': { $in: ['Not Paid', 'Pending'] } }] }
    )
    const payload = { userId: req.params.userId, message: 'Payment confirmed.' }
    emitToUser(req, req.params.userId, 'payment:paid', payload)
    emitToDashboards(req, 'payment:paid', payload)
    res.json({ success: true, data: payload })
  } catch (error) {
    next(error)
  }
})

router.patch('/admin/orders/:userId/served', async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, { isOrderDone: true })
    await Food.updateMany(
      { 'userItem.createdBy': req.params.userId },
      { $set: { 'userItem.$[elem].status': 'Served' } },
      { arrayFilters: [{ 'elem.createdBy': req.params.userId }] }
    )
    const payload = { userId: req.params.userId, message: 'Order served. Thank you!' }
    emitToUser(req, req.params.userId, 'order:served', payload)
    emitToDashboards(req, 'order:served', payload)
    res.json({ success: true, data: payload })
  } catch (error) {
    next(error)
  }
})

module.exports = router
