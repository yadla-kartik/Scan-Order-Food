import { ChefHat, LogOut, Menu, ReceiptText, ShieldCheck, X } from 'lucide-react'
import { image } from '../data/menuData'

function Header({ title = 'Scan N Order', showBack = false, onBack, menuOpen = false, setMenuOpen, setScreen, onLogout }) {
  return (
    <header className="sticky top-0 z-40 bg-[#d8222f] text-white shadow-lg shadow-red-900/10">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {showBack ? (
            <button onClick={onBack} className="grid h-10 w-10 place-items-center rounded-full text-2xl transition active:scale-95" aria-label="Go back">
              &lt;
            </button>
          ) : (
            <img src={image('logo.png')} className="h-12 w-12 shrink-0 object-contain" alt="Scan N Order" />
          )}
          <h1 className="truncate text-xl font-semibold sm:text-2xl">{title}</h1>
        </div>

        {!showBack && (
          <button onClick={() => setMenuOpen?.((value) => !value)} className="grid h-10 w-10 place-items-center rounded-full text-2xl transition active:scale-95" aria-label="Open menu">
            {menuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
          </button>
        )}
      </div>

      {menuOpen && !showBack && (
        <div className="absolute right-4 top-[70px] z-50 w-48 rounded-xl bg-white p-3 text-[#d8222f] shadow-2xl animate-in">
          <button onClick={() => setScreen?.('orders')} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-semibold hover:bg-red-50"><ReceiptText size={18} /> My Orders</button>
          <button onClick={() => setScreen?.('chef')} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-semibold hover:bg-red-50"><ChefHat size={18} /> Chef Panel</button>
          <button onClick={() => setScreen?.('admin')} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-semibold hover:bg-red-50"><ShieldCheck size={18} /> Admin Panel</button>
          <button onClick={onLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left font-semibold hover:bg-red-50"><LogOut size={18} /> Logout</button>
        </div>
      )}
    </header>
  )
}

export default Header
