import { useState } from 'react'
import BottomBar from '../components/BottomBar'
import Header from '../components/Header'
import { CouponModal, PolicyModal } from '../components/Modals'
import PriceCard from '../components/PriceCard'
import QuantityControl from '../components/QuantityControl'
import { image } from '../data/menuData'
import { getItemsSummary, money } from '../utils/pricing'

function CartPage({ apiCartItems = [], addItem, removeOne, removeItem, clearCart, setScreen }) {
  const [couponOpen, setCouponOpen] = useState(false)
  const [policyOpen, setPolicyOpen] = useState(false)
  const { items, total, gst, serviceTip, grandTotal } = getItemsSummary(apiCartItems)

  return (
    <main className="min-h-screen bg-[#f8f8f8] pb-28">
      <Header title="Review Order" showBack onBack={() => setScreen('home')} />

      {items.length ? (
        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-4 lg:grid-cols-[1fr_380px] lg:px-8">
          <div className="rounded-xl bg-white p-4 shadow-lg shadow-neutral-200/80">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your Items</h2>
              <button onClick={clearCart} className="rounded-md bg-[#d8222f] px-3 py-1.5 text-sm font-semibold text-white">Clear All</button>
            </div>
            <div className="grid gap-3 xl:grid-cols-2">
              {items.map((item) => (
                <article key={item.id} className="flex items-center gap-3 rounded-lg bg-white p-2 shadow">
                  <img src={item.image || item.imageUrl} className="h-[70px] w-[70px] rounded-md object-cover" alt={item.name} />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold">{item.name}</h3>
                    <p className="mt-1 text-sm font-medium">{money(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <QuantityControl compact quantity={item.quantity} onAdd={() => addItem(item.id, item)} onRemove={() => removeOne(item.id, item)} />
                    <button onClick={() => removeItem(item.id)} className="grid h-8 w-8 place-items-center rounded-full bg-neutral-200 font-bold">x</button>
                  </div>
                </article>
              ))}
            </div>
            <button onClick={() => setScreen('home')} className="mt-4 flex items-center gap-2 font-semibold text-neutral-900">
              <span className="text-xl text-[#d8222f]">+</span> Add more items
            </button>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <button onClick={() => setCouponOpen(true)} className="flex w-full items-center justify-between rounded-xl bg-white p-4 text-left shadow-lg shadow-neutral-200/80">
              <span className="flex items-center gap-3 text-lg font-semibold"><span className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-[#d8222f]">%</span> Apply Coupon</span>
              <span className="text-xl">&gt;</span>
            </button>
            <PriceCard total={total} gst={gst} serviceTip={serviceTip} grandTotal={grandTotal} />
            <div className="rounded-xl bg-white p-4 shadow-lg shadow-neutral-200/80">
              <p className="text-center text-sm font-medium text-[#d8222f]">Review your order and details to avoid cancellations</p>
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs leading-relaxed text-neutral-600">
                <span className="font-bold text-[#d8222f]">Note: </span>
                If you cancel within 60 seconds of placing your order, a 100% refund will be issued.
                <button onClick={() => setPolicyOpen(true)} className="mt-3 block font-semibold text-[#d8222f] underline">READ CANCELLATION POLICY</button>
              </div>
            </div>
          </aside>

          <BottomBar left="Pay Now" right={money(grandTotal)} onClick={() => setScreen('payment')} pill />
        </section>
      ) : (
        <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-sm flex-col items-center justify-center px-6 text-center">
          <img src={image('empty.png')} className="w-56" alt="Empty menu" />
          <h2 className="mt-3 text-lg font-semibold">Empty Menu</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-neutral-500">Looks like you have not made{'\n'}your choice yet...</p>
          <button onClick={() => setScreen('home')} className="mt-6 w-full rounded-lg bg-[#d8222f] py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/20">Back to Menu</button>
          <p className="mt-3 text-sm"><span className="text-[#d8222f]">Check what we have got for you </span><span className="text-neutral-500">and get it swished!</span></p>
        </section>
      )}

      {couponOpen && <CouponModal onClose={() => setCouponOpen(false)} />}
      {policyOpen && <PolicyModal onClose={() => setPolicyOpen(false)} />}
    </main>
  )
}

export default CartPage
