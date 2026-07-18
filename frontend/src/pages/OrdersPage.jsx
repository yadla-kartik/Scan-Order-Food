import { ArrowLeft, Clock, Home, ReceiptText } from 'lucide-react'
import Header from '../components/Header'
import { getCartSummary, money } from '../utils/pricing'

function OrdersPage({ cart, orders, setScreen }) {
  const current = getCartSummary(cart)
  const visibleOrders = [
    ...orders,
    ...(current.items.length
      ? [{
          id: 'CURRENT',
          createdAt: new Date().toISOString(),
          status: 'In Cart',
          items: current.items,
          summary: current,
        }]
      : []),
  ]

  return (
    <main className="min-h-screen bg-[#f8f8f8]">
      <Header title="My Orders" showBack onBack={() => setScreen('home')} />

      <section className="mx-auto max-w-5xl px-4 py-5 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#d8222f]">Order history</p>
            <h1 className="text-2xl font-bold text-neutral-950 lg:text-3xl">Your orders</h1>
          </div>
          <button onClick={() => setScreen('home')} className="inline-flex items-center gap-2 rounded-xl bg-[#d8222f] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/20">
            <Home size={18} /> Menu
          </button>
        </div>

        {visibleOrders.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {visibleOrders.map((order, index) => (
              <article key={`${order.id}-${index}`} className="rounded-2xl bg-white p-4 shadow-lg shadow-neutral-200/80">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-red-50 text-[#d8222f]">
                      <ReceiptText size={22} />
                    </span>
                    <div>
                      <h2 className="font-bold">Order #{order.id}</h2>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-neutral-500">
                        <Clock size={14} /> {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-[#d8222f]">{order.status}</span>
                </div>

                <div className="mt-4 space-y-2">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.id}`} className="flex items-center justify-between gap-3 rounded-xl bg-neutral-50 px-3 py-2 text-sm">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-neutral-800">{item.name}</p>
                        <p className="text-xs text-neutral-500">Qty {item.quantity}</p>
                      </div>
                      <span className="font-bold">{money(item.amount)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t pt-3">
                  <span className="text-sm font-semibold text-neutral-500">Grand Total</span>
                  <span className="text-lg font-bold text-[#d8222f]">{money(order.summary.grandTotal)}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="grid min-h-[420px] place-items-center rounded-2xl bg-white p-8 text-center shadow-sm">
            <div>
              <ReceiptText className="mx-auto text-[#d8222f]" size={52} />
              <h2 className="mt-4 text-xl font-bold">No orders yet</h2>
              <p className="mt-2 text-sm text-neutral-500">Add items from the menu and place your first order.</p>
              <button onClick={() => setScreen('home')} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#d8222f] px-5 py-3 font-semibold text-white">
                <ArrowLeft size={18} /> Back to menu
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  )
}

export default OrdersPage
