import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { api } from '../utils/api'
import { money } from '../utils/pricing'
import { getSocket } from '../utils/socket'

function ChefPage({ setScreen }) {
  const [orders, setOrders] = useState([])

  async function loadOrders() {
    const data = await api.chefOrders()
    setOrders(data)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrders().catch(() => {})
    }, 0)
    const socket = getSocket()
    socket.connect()
    socket.emit('join', { role: 'chef' })
    socket.on('order:created', loadOrders)
    socket.on('order:updated', loadOrders)
    socket.on('order:ready', loadOrders)
    socket.on('order:served', loadOrders)
    return () => {
      clearTimeout(timer)
      socket.off('order:created', loadOrders)
      socket.off('order:updated', loadOrders)
      socket.off('order:ready', loadOrders)
      socket.off('order:served', loadOrders)
    }
  }, [])

  async function updateStatus(userId, status) {
    await api.updateChefStatus(userId, status)
    await loadOrders()
  }

  return (
    <main className="min-h-screen bg-[#f8f8f8]">
      <Header title="Chef Panel" showBack onBack={() => setScreen('home')} />
      <section className="mx-auto max-w-7xl px-4 py-5 lg:px-8">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#d8222f]">Kitchen live queue</p>
            <h1 className="text-3xl font-bold">Orders to prepare</h1>
          </div>
          <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold shadow-sm">
            Active orders: <span className="text-[#d8222f]">{orders.length}</span>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {orders.map((order) => (
            <article key={order.user._id} className="rounded-xl bg-white p-4 shadow-lg shadow-neutral-200/80">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Order #{order.orderNo}</p>
                  <h2 className="text-xl font-bold">{order.user.fullname}</h2>
                </div>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">{order.status}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {order.items.map((item) => (
                  <li key={item._id} className="rounded-lg bg-neutral-50 px-3 py-2 text-sm font-medium">{item.name} x{item.quantity}</li>
                ))}
              </ul>
              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <span className="text-sm text-neutral-500">{money(order.summary.grandTotal)}</span>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(order.user._id, 'Preparing')} className="rounded-lg border border-[#d8222f] px-3 py-2 text-sm font-semibold text-[#d8222f]">Preparing</button>
                  <button onClick={() => updateStatus(order.user._id, 'Ready')} className="rounded-lg bg-[#d8222f] px-3 py-2 text-sm font-semibold text-white">Ready</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default ChefPage
