import { useState } from 'react'
import BottomBar from '../components/BottomBar'
import Header from '../components/Header'
import PriceCard from '../components/PriceCard'
import { image } from '../data/menuData'
import { getItemsSummary } from '../utils/pricing'

function PaymentPage({ cartItems = [], setScreen, onPlaceOrder }) {
  const [method, setMethod] = useState('')
  const [qrVisible, setQrVisible] = useState(false)
  const [paid, setPaid] = useState(false)
  const { total, gst, serviceTip, grandTotal } = getItemsSummary(cartItems)
  const canContinue = method === 'cash' || (method === 'upi' && paid)

  function toggleMethod(nextMethod) {
    setMethod((current) => {
      const updated = current === nextMethod ? '' : nextMethod
      if (updated !== 'upi') setPaid(false)
      return updated
    })
  }

  return (
    <main className="min-h-screen bg-[#f5f5f5] pb-28">
      <Header title="Payment" showBack onBack={() => setScreen('cart')} />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-4 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="space-y-4">
          <h2 className="text-sm font-semibold tracking-wide">PAYMENT OPTIONS</h2>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <label onClick={() => toggleMethod('upi')} className="flex cursor-pointer items-center justify-between gap-3 py-2">
              <span className="flex items-center gap-3 font-medium"><input type="radio" name="pay-method" checked={method === 'upi'} readOnly /> UPI (Pay via any App)</span>
              <img src={image('upi.png')} className="h-10 w-12 object-contain" alt="UPI" />
            </label>
            {method === 'upi' && (
              <div className="mt-3 text-center">
                <button onClick={() => setPaid(true)} className="rounded-full bg-[#d8222f] px-8 py-2 font-semibold text-white">Pay Now</button>
                {paid && <p className="mt-3 font-medium text-green-600">Payment Success</p>}
              </div>
            )}
            <label onClick={() => toggleMethod('cash')} className="mt-3 flex cursor-pointer items-center justify-between gap-3 border-t pt-4">
              <span className="flex items-center gap-3 font-medium"><input type="radio" name="pay-method" checked={method === 'cash'} readOnly /> Cash on Counter (Cash/UPI)</span>
              <img src={image('cashon.png')} className="h-10 w-10 object-contain" alt="Cash" />
            </label>
          </div>

          <h2 className="text-sm font-semibold tracking-wide">UPI QR</h2>
          <div className="flex flex-col items-center gap-4 rounded-xl bg-white p-5 text-center shadow-sm">
            {!qrVisible ? (
              <button onClick={() => setQrVisible(true)} className="rounded-md bg-[#d8222f] px-4 py-2 font-semibold text-white">Generate QR Code</button>
            ) : (
              <>
                <img src={image('qr-code.png')} className="h-32 w-32 rounded-md object-contain" alt="Payment QR" />
                <div className="text-sm text-neutral-700">
                  <p><strong>Recipient:</strong> Yadla Kartik</p>
                  <p>Scan the QR using any UPI app</p>
                </div>
              </>
            )}
            <div className="flex items-center justify-center gap-3">
              {['phonepe.png', 'googlepay.png', 'paytm.png', 'bhmi.png'].map((logo) => (
                <img key={logo} src={image(logo)} className="h-8 w-8 object-contain" alt="" />
              ))}
            </div>
            <span className="rounded-full border border-green-800/20 bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">Upto Rs 50 cashback</span>
          </div>
        </div>

        <PriceCard total={total} gst={gst} serviceTip={serviceTip} grandTotal={grandTotal} sticky />
      </section>

      <BottomBar left={canContinue ? 'Continue' : 'Select payment method'} right="" onClick={() => onPlaceOrder(method === 'upi' ? 'Online' : 'Cash On Counter')} pill disabled={!canContinue} />
    </main>
  )
}

export default PaymentPage
