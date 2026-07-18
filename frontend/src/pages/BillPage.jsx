import { Home } from 'lucide-react'
import { image } from '../data/menuData'
import { getCartSummary, getItemsSummary, money } from '../utils/pricing'

function BillPage({ cart, orderItems = [], setScreen, user }) {
  const { items, total, gst, serviceTip, grandTotal } = orderItems.length ? getItemsSummary(orderItems) : getCartSummary(cart)
  const date = new Date()

  return (
    <main className="min-h-screen bg-[#f8f8f8] pb-12">
      <nav className="flex h-16 items-center justify-center gap-3 bg-[#d8222f] px-4 text-white">
        <img src={image('logo.png')} className="h-12 w-12 object-contain" alt="Scan N Order" />
        <span className="text-xl font-semibold tracking-wide">SCAN N ORDER</span>
      </nav>

      <section className="mx-auto max-w-4xl px-4 py-6 text-center">
        <h1 className="text-2xl font-semibold text-green-700">Order Successful !!</h1>
        <div className="mt-5 rounded-xl border-2 border-[#d8222f] bg-white p-4 text-left shadow-lg lg:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="text-sm leading-7">
              <p><strong>Name:</strong> {user?.fullname || 'Guest User'}</p>
              <p><strong>Date:</strong> {date.toLocaleDateString()}</p>
              <p><strong>Time:</strong> {date.toLocaleTimeString()}</p>
            </div>
            <button className="rounded-lg bg-[#d8222f] px-4 py-2 text-sm font-semibold text-white">Download Bill</button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead className="bg-red-50">
                <tr>
                  <th className="border p-2 text-left">Item Name</th>
                  <th className="border p-2">Qty</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2 text-center">{item.quantity}</td>
                    <td className="border p-2 text-center">{money(item.price)}</td>
                    <td className="border p-2 text-center">{money(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 space-y-1 text-right text-sm">
            <p>Items Total: {money(total)}</p>
            <p>GST (18%): {money(gst)}</p>
            <p>Service Tip (10%): {money(serviceTip)}</p>
            <hr className="my-3" />
            <h2 className="text-xl font-semibold">Grand Total: {money(grandTotal)}</h2>
          </div>
          <hr className="my-4" />
          <h3 className="text-center text-lg font-semibold">Thank you!</h3>
        </div>

        <button onClick={() => setScreen('home')} className="mt-6 inline-grid h-14 w-14 place-items-center rounded-full bg-[#d8222f] text-white shadow-lg" aria-label="Back to home">
          <Home size={26} strokeWidth={2.5} />
        </button>
        <div className="mt-2 font-semibold text-[#d8222f]">Back to Home</div>
      </section>
    </main>
  )
}

export default BillPage
