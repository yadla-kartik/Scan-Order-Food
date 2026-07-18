import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { menuItems } from '../data/menuData'
import { api } from '../utils/api'
import { money } from '../utils/pricing'
import { getSocket } from '../utils/socket'

function AdminPage({ setScreen }) {
  const [orders, setOrders] = useState([])
  const revenue = orders.reduce((sum, order) => sum + order.summary.grandTotal, 0)
  const stats = [
    ['Today Orders', orders.length],
    ['Revenue', money(revenue)],
    ['Menu Items', menuItems.length],
    ['Pending', orders.filter((order) => order.status !== 'Served').length],
  ]

  async function loadOrders() {
    const data = await api.adminOrders()
    setOrders(data)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      loadOrders().catch(() => {})
    }, 0)
    const socket = getSocket()
    socket.connect()
    socket.emit('join', { role: 'admin' })
    socket.on('order:created', loadOrders)
    socket.on('order:updated', loadOrders)
    socket.on('payment:paid', loadOrders)
    socket.on('order:served', loadOrders)
    return () => {
      clearTimeout(timer)
      socket.off('order:created', loadOrders)
      socket.off('order:updated', loadOrders)
      socket.off('payment:paid', loadOrders)
      socket.off('order:served', loadOrders)
    }
  }, [])

  async function markPaid(userId) {
    await api.markPaid(userId)
    await loadOrders()
  }

  async function markServed(userId) {
    await api.markServed(userId)
    await loadOrders()
  }

  return (
    <main className="min-h-screen bg-[#f8f8f8]">
      <Header title="Admin Panel" showBack onBack={() => setScreen('home')} />
      <section className="mx-auto max-w-7xl px-4 py-5 lg:px-8">
        <div className="mb-5">
          <p className="text-sm font-semibold text-[#d8222f]">Scan N Order dashboard</p>
          <h1 className="text-3xl font-bold">Restaurant overview</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(([label, value]) => (
            <article key={label} className="rounded-xl bg-white p-4 shadow-lg shadow-neutral-200/80">
              <p className="text-sm font-semibold text-neutral-500">{label}</p>
              <p className="mt-2 text-2xl font-bold text-[#d8222f]">{value}</p>
            </article>
          ))}
        </div>

        <section className="mt-5 rounded-xl bg-white p-4 shadow-lg shadow-neutral-200/80">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Realtime Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-red-50">
                <tr>
                  <th className="p-3">Order</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.user._id} className="border-b last:border-0">
                    <td className="p-3 font-semibold">#{order.orderNo}</td>
                    <td className="p-3">{order.user.fullname}<br /><span className="text-xs text-neutral-500">{order.user.mobileNo}</span></td>
                    <td className="p-3">{order.items.map((item) => `${item.name} x${item.quantity}`).join(', ')}</td>
                    <td className="p-3">{order.paymentStatus}<br /><span className="text-xs text-neutral-500">{order.paymentMode || '-'}</span></td>
                    <td className="p-3"><span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold">{order.status}</span></td>
                    <td className="p-3 text-right font-semibold">{money(order.summary.grandTotal)}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-2">
                        {order.paymentStatus !== 'Paid' && <button onClick={() => markPaid(order.user._id)} className="rounded-lg border border-[#d8222f] px-3 py-2 text-xs font-semibold text-[#d8222f]">Paid</button>}
                        <button onClick={() => markServed(order.user._id)} className="rounded-lg bg-[#d8222f] px-3 py-2 text-xs font-semibold text-white">Served</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  )
}

export default AdminPage
