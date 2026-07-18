import { useEffect, useState } from 'react'
import BottomBar from '../components/BottomBar'
import Header from '../components/Header'
import QuantityControl from '../components/QuantityControl'
import { categories, menuItems, offers } from '../data/menuData'
import { getCartSummary, money } from '../utils/pricing'

function HomePage({ cart, addItem, removeOne, setScreen, onLogout }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [slide, setSlide] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const filteredItems = activeCategory === 'all' ? menuItems : menuItems.filter((item) => item.category === activeCategory)
  const itemCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0)
  const { items: cartItems, grandTotal } = getCartSummary(cart)
  const activeCategoryLabel = categories.find((category) => category.id === activeCategory)?.label || 'Menu'

  useEffect(() => {
    const id = setInterval(() => setSlide((value) => (value + 1) % offers.length), 3000)
    return () => clearInterval(id)
  }, [])

  return (
    <main className="min-h-screen bg-[#f3f1ee] pb-28">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} setScreen={setScreen} onLogout={onLogout} />

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pt-4 lg:grid-cols-[390px_1fr] lg:px-8 lg:pt-6">
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="hidden overflow-hidden rounded-2xl bg-[#161616] text-white shadow-xl lg:block">
            <div className="relative min-h-[310px] p-6">
              <div className="absolute inset-x-0 bottom-0 h-32 bg-[#d8222f]" />
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <img src="/Images/logo.png" className="h-16 w-16 rounded-2xl bg-white object-contain p-1" alt="Scan N Order" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-100">Digital dining</p>
                    <h2 className="text-2xl font-bold">Scan N Order</h2>
                  </div>
                </div>
                <p className="mt-5 max-w-xs text-sm leading-6 text-neutral-200">
                  Scan table QR, explore fresh cafe items, customize quantity, pay fast, and send the order straight to the kitchen.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                  {['Scan', 'Pick', 'Pay'].map((step, index) => (
                    <div key={step} className="rounded-xl bg-white/10 p-3 backdrop-blur">
                      <div className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-bold text-[#d8222f]">{index + 1}</div>
                      <p className="mt-2 text-xs font-semibold">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[20px] bg-white shadow-lg lg:hidden">
            <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${slide * 100}%)` }}>
              {offers.map((offer) => (
                <img key={offer} src={offer} className="h-44 w-full shrink-0 object-fill sm:h-56 lg:h-48" alt="Offer" />
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-950">Categories</h2>
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-[#d8222f]">{itemCount} items</span>
            </div>
            <nav className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-1 lg:overflow-visible">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex shrink-0 items-center justify-between rounded-full border px-5 py-2 text-sm font-semibold shadow-sm transition active:scale-95 lg:rounded-xl lg:py-3 ${
                    activeCategory === category.id ? 'border-[#d8222f] bg-[#d8222f] text-white' : 'border-neutral-100 bg-neutral-50 text-neutral-800 hover:border-red-200'
                  }`}
                >
                  <span>{category.label}</span>
                  <span className="hidden text-xs opacity-70 lg:inline">
                    {category.id === 'all' ? menuItems.length : menuItems.filter((item) => item.category === category.id).length}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="hidden rounded-2xl bg-white p-4 shadow-sm lg:block">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-neutral-500">Current order</p>
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-[#d8222f]">{itemCount}</span>
            </div>
            <div className="mt-3 max-h-36 space-y-2 overflow-auto pr-1">
              {cartItems.length ? cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-neutral-700">{item.name} x{item.quantity}</span>
                  <span className="font-semibold">{money(item.amount)}</span>
                </div>
              )) : (
                <p className="text-sm text-neutral-500">Add items from the menu to start an order.</p>
              )}
            </div>
            <p className="mt-4 text-2xl font-bold text-[#d8222f]">{money(grandTotal)}</p>
            <button onClick={() => setScreen('cart')} className="mt-3 w-full rounded-lg bg-[#d8222f] py-2.5 font-semibold text-white">Review Order</button>
          </div>
        </aside>

        <section>
          <div className="mb-5 hidden overflow-hidden rounded-2xl bg-white shadow-sm lg:block">
            <div className="grid min-h-[230px] grid-cols-[1fr_310px]">
              <div className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d8222f]">Fresh menu</p>
                <h2 className="mt-2 max-w-xl text-4xl font-bold leading-tight text-neutral-950">Order faster from your table</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
                  Browse by category, add quantity from the card itself, then review and pay without waiting at the counter.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button onClick={() => setScreen('cart')} className="rounded-xl bg-[#d8222f] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/20">Go to cart</button>
                  <button onClick={() => setScreen('chef')} className="rounded-xl border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-800">Chef View</button>
                  <button onClick={() => setScreen('admin')} className="rounded-xl border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-800">Admin View</button>
                </div>
              </div>
              <div className="relative overflow-hidden bg-[#d8222f]">
                <div className="absolute inset-5 overflow-hidden rounded-2xl bg-white/15">
                  <div className="flex h-full transition-transform duration-700 ease-out" style={{ transform: `translateX(-${slide * 100}%)` }}>
                    {offers.map((offer) => (
                      <img key={offer} src={offer} className="h-full w-full shrink-0 object-cover" alt="Offer" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d8222f]">{activeCategoryLabel}</p>
              <h3 className="text-xl font-bold text-neutral-950 lg:text-2xl">Available items</h3>
            </div>
            <span className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-600">{filteredItems.length} dishes</span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
            {filteredItems.map((item, index) => (
              <article key={item.id} className="menu-card group flex min-h-[104px] items-center gap-3 rounded-xl border border-neutral-100 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg lg:min-h-[112px]" style={{ animationDelay: `${index * 35}ms` }}>
                <div className="relative shrink-0">
                  <img src={item.image} className="h-20 w-20 rounded-lg object-cover lg:h-[86px] lg:w-[86px]" alt={item.name} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-neutral-800 lg:text-base">{item.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">{item.description}</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900">{money(item.price)}</p>
                </div>
                <div className="shrink-0">
                  <QuantityControl compact quantity={cart[item.id] || 0} onAdd={() => addItem(item.id, item)} onRemove={() => removeOne(item.id, item)} />
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <div className="lg:hidden">
        <BottomBar left="Order" right={money(grandTotal)} onClick={() => setScreen('cart')} />
      </div>

      <button
        onClick={() => setScreen('cart')}
        className="fixed bottom-6 right-8 z-30 hidden items-center gap-4 rounded-full bg-[#d8222f] px-5 py-3 text-white shadow-2xl shadow-red-900/25 transition hover:-translate-y-0.5 active:scale-95 lg:flex"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-lg font-bold">{itemCount}</span>
        <span className="text-left">
          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-red-100">Go to cart</span>
          <span className="block text-base font-bold">{money(grandTotal)}</span>
        </span>
        <span className="text-xl font-bold">&gt;</span>
      </button>
    </main>
  )
}

export default HomePage
