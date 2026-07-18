import { useEffect, useMemo, useState } from 'react'
import './App.css'
import AdminPage from './pages/AdminPage'
import BillPage from './pages/BillPage'
import CartPage from './pages/CartPage'
import ChefPage from './pages/ChefPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import OrdersPage from './pages/OrdersPage'
import PaymentPage from './pages/PaymentPage'
import { menuItems } from './data/menuData'
import { api } from './utils/api'
import { getSocket } from './utils/socket'

function apiItemsToCart(items = []) {
  return items.reduce((nextCart, item) => {
    const menuItem = menuItems.find((entry) => entry.name === item.name)
    nextCart[menuItem?.id || item.id || item._id] = item.quantity || 1
    return nextCart
  }, {})
}

function App() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('scanOrderToken')
    const user = localStorage.getItem('scanOrderUser')
    return token ? { token, user: user ? JSON.parse(user) : null } : null
  })
  const [screen, setScreen] = useState('home')
  const [cart, setCart] = useState({})
  const [apiCartItems, setApiCartItems] = useState([])
  const [orders, setOrders] = useState([])
  const [lastOrder, setLastOrder] = useState(null)
  const [notice, setNotice] = useState('')

  function applyCartPayload(payload) {
    const items = payload?.items || []
    setApiCartItems(items)
    setCart(apiItemsToCart(items))
  }

  useEffect(() => {
    if (!auth?.token) return

    api.getCart().then(applyCartPayload).catch(() => {})
    api.myOrders().then((data) => {
      if (data?.items?.length) {
        setOrders([{
          id: 'SAVED',
          createdAt: new Date().toISOString(),
          status: 'Saved',
          items: data.items,
          summary: data.summary,
        }])
      }
    }).catch(() => {})
  }, [auth?.token])

  useEffect(() => {
    if (!auth?.token || !auth.user?._id) return

    const socket = getSocket()
    socket.connect()
    socket.emit('join', { role: 'customer', userId: auth.user._id })

    socket.on('cart:updated', applyCartPayload)
    socket.on('order:ready', (payload) => setNotice(payload?.message || 'Your order is ready.'))
    socket.on('order:preparing', (payload) => setNotice(payload?.message || 'Your order is being prepared.'))
    socket.on('payment:paid', (payload) => setNotice(payload?.message || 'Payment confirmed.'))

    return () => {
      socket.off('cart:updated', applyCartPayload)
      socket.off('order:ready')
      socket.off('order:preparing')
      socket.off('payment:paid')
    }
  }, [auth?.token, auth?.user?._id])

  const actions = useMemo(() => ({
    addItem: async (id, menuItem) => {
      const existing = apiCartItems.find((item) => item.name === menuItem.name)
      if (existing) {
        const data = await api.updateCartItem(existing.id || existing._id, Number(existing.quantity || 1) + 1)
        applyCartPayload(data)
        return
      }
      const data = await api.addCartItem({
        name: menuItem.name,
        description: menuItem.description,
        price: menuItem.price,
        imageUrl: menuItem.image,
      })
      applyCartPayload(data)
    },
    removeOne: async (id, menuItem) => {
      const existing = apiCartItems.find((item) => item.name === menuItem.name)
      if (!existing) return

      if (Number(existing.quantity || 1) <= 1) {
        const data = await api.removeCartItem(existing.id || existing._id)
        applyCartPayload(data)
        return
      }

      const data = await api.updateCartItem(existing.id || existing._id, Number(existing.quantity || 1) - 1)
      applyCartPayload(data)
    },
    removeItem: async (id) => {
      const data = await api.removeCartItem(id)
      applyCartPayload(data)
    },
    clearCart: async () => {
      const data = await api.clearCart()
      applyCartPayload(data)
    },
  }), [apiCartItems])

  async function placeOrder(paymentMode) {
    const data = await api.checkout(paymentMode)
    const order = {
      id: String(100 + orders.length),
      createdAt: new Date().toISOString(),
      status: 'Placed',
      items: data.items,
      summary: data.summary,
    }
    setLastOrder(order)
    setOrders((current) => [{
      ...order,
      id: String(100 + current.length),
    }, ...current])
    setApiCartItems([])
    setCart({})
    setScreen('bill')
  }

  async function handleLogin(loginData) {
    const data = await api.login(loginData)
    const user = data.user
    localStorage.setItem('scanOrderToken', data.token)
    localStorage.setItem('scanOrderUser', JSON.stringify(user))
    setAuth({ token: data.token, user })
    setScreen('home')
  }

  function handleLogout() {
    localStorage.removeItem('scanOrderToken')
    localStorage.removeItem('scanOrderUser')
    getSocket().disconnect()
    setAuth(null)
    setCart({})
    setApiCartItems([])
    setOrders([])
    setLastOrder(null)
    setScreen('home')
  }

  function navigate(nextScreen) {
    const protectedScreens = ['cart', 'payment', 'bill', 'orders']
    if (!auth?.token && protectedScreens.includes(nextScreen)) {
      setScreen('home')
      return
    }
    setScreen(nextScreen)
  }

  if (!auth?.token) return <LoginPage onLogin={handleLogin} />

  return (
    <>
      {screen === 'cart' && <CartPage cart={cart} apiCartItems={apiCartItems} setScreen={navigate} {...actions} />}
      {screen === 'payment' && <PaymentPage cartItems={apiCartItems} setScreen={navigate} onPlaceOrder={placeOrder} />}
      {screen === 'bill' && <BillPage cart={cart} orderItems={lastOrder?.items || apiCartItems} setScreen={navigate} user={auth.user} />}
      {screen === 'orders' && <OrdersPage cart={cart} orders={orders} setScreen={navigate} />}
      {screen === 'chef' && <ChefPage setScreen={navigate} />}
      {screen === 'admin' && <AdminPage setScreen={navigate} />}
      {screen === 'home' && <HomePage cart={cart} setScreen={navigate} addItem={actions.addItem} removeOne={actions.removeOne} onLogout={handleLogout} />}

      {notice && (
        <button onClick={() => setNotice('')} className="fixed bottom-6 left-1/2 z-[60] max-w-[90vw] -translate-x-1/2 rounded-full bg-[#d8222f] px-5 py-3 text-sm font-semibold text-white shadow-2xl">
          {notice}
        </button>
      )}
    </>
  )
}

export default App
