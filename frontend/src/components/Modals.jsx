import { coupons } from '../data/menuData'

export function CouponModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-4 shadow-2xl animate-in">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Best coupon</h2>
          <button onClick={onClose} className="text-2xl text-neutral-500">x</button>
        </div>
        <div className="space-y-3">
          {coupons.map(([tag, code, subtitle]) => (
            <div key={code} className="flex overflow-hidden rounded-lg bg-white shadow">
              <div className="grid w-14 place-items-center bg-[#d8222f] px-2 text-center text-sm font-bold text-white [writing-mode:vertical-rl]">{tag}</div>
              <div className="flex-1 p-4">
                <div className="flex justify-between font-bold">
                  <span>{code}</span>
                  <button onClick={onClose} className="text-sm text-[#d8222f]">APPLY</button>
                </div>
                <p className="mt-1 text-sm font-medium text-green-700">{subtitle}</p>
                <p className="mt-1 text-xs text-neutral-500">Use code {code} on this order. Maximum discount applied at checkout.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PolicyModal({ onClose }) {
  const policies = [
    'Full refund available if cancelled within 60 seconds of order placement.',
    'No refund for cancellations after 60 seconds as preparation begins immediately.',
    'Delivery cancellations not permitted once rider has collected your order.',
    'Wrong address provided by customer will not be eligible for refund.',
    'Special orders cannot be cancelled once placed.',
    'Refunds will be processed within 5-7 business days to original payment method.',
  ]

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl animate-in">
        <h2 className="text-center font-semibold text-[#d8222f]">Cancellation Policy</h2>
        <div className="mt-4 space-y-3">
          {policies.map((policy, index) => (
            <div key={policy} className="flex gap-3 text-sm text-neutral-600">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#d8222f] text-xs font-bold text-white">{index + 1}</span>
              <p>{policy}</p>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mx-auto mt-5 grid h-10 w-10 place-items-center rounded-full bg-[#d8222f] text-xl text-white">x</button>
      </div>
    </div>
  )
}
