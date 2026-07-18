import { useState } from 'react'
import { LogIn } from 'lucide-react'
import { image } from '../data/menuData'

function LoginPage({ onLogin }) {
  const [mobileError, setMobileError] = useState('')
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const fullname = String(formData.get('fullname') || '').trim()
    const mobileNo = String(formData.get('mobileNo') || '').trim()

    if (!fullname || !mobileNo) return
    if (!/^[6-9]\d{9}$/.test(mobileNo)) {
      setMobileError('Enter a valid 10 digit mobile number starting with 6, 7, 8, or 9.')
      return
    }

    setLoading(true)
    setFormError('')
    try {
      await onLogin({ fullname, mobileNo })
    } catch (error) {
      setFormError(error.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f3f1ee] px-4 py-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-neutral-300/70 lg:grid-cols-[1fr_420px]">
        <div className="bg-[#d8222f] p-8 text-white lg:p-10">
          <img src={image('logo.png')} className="h-20 w-20 rounded-2xl bg-white object-contain p-2" alt="Scan N Order" />
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.22em] text-red-100">Welcome</p>
          <h1 className="mt-2 text-4xl font-bold leading-tight">Scan N Order</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-red-50">
            Enter your name and mobile number to start ordering from your table.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 text-center">
            {['Login', 'Select', 'Pay'].map((step, index) => (
              <div key={step} className="rounded-2xl bg-white/15 p-4">
                <div className="mx-auto grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-bold text-[#d8222f]">{index + 1}</div>
                <p className="mt-2 text-xs font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 lg:p-8">
          <h2 className="text-2xl font-bold text-neutral-950">Login</h2>
          <p className="mt-1 text-sm text-neutral-500">Token banne ke baad hi menu, cart, payment aur bill access hoga.</p>

          <label className="mt-6 block text-sm font-semibold text-neutral-700">
            Full name
            <input name="fullname" className="mt-2 w-full rounded-xl border border-neutral-200 px-4 py-3 outline-none transition focus:border-[#d8222f]" placeholder="Enter your name" required />
          </label>

          <label className="mt-4 block text-sm font-semibold text-neutral-700">
            Mobile number
            <input
              name="mobileNo"
              className={`mt-2 w-full rounded-xl border px-4 py-3 outline-none transition focus:border-[#d8222f] ${mobileError ? 'border-[#d8222f]' : 'border-neutral-200'}`}
              placeholder="Enter mobile number"
              inputMode="numeric"
              maxLength={10}
              minLength={10}
              pattern="[6-9][0-9]{9}"
              onInput={(event) => {
                event.currentTarget.value = event.currentTarget.value.replace(/\D/g, '').slice(0, 10)
                setMobileError('')
              }}
              required
            />
            {mobileError && <p className="mt-2 text-xs font-semibold text-[#d8222f]">{mobileError}</p>}
          </label>

          {formError && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-[#d8222f]">{formError}</p>}

          <button disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#d8222f] px-5 py-3 font-semibold text-white shadow-lg shadow-red-900/20 disabled:bg-neutral-400">
            <LogIn size={19} /> {loading ? 'Logging in...' : 'Continue to menu'}
          </button>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
