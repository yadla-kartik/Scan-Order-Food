import { money } from '../utils/pricing'

function PriceCard({ total, gst, serviceTip, grandTotal, sticky = false }) {
  return (
    <div className={`rounded-xl bg-white p-4 shadow-lg shadow-neutral-200/80 ${sticky ? 'lg:sticky lg:top-24' : ''}`}>
      <h2 className="mb-3 text-lg font-semibold">Payment Details</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between font-medium">
          <span>Items Total</span>
          <span>{money(total)}</span>
        </div>
        <div className="flex justify-between text-neutral-600">
          <span>GST (18%)</span>
          <span>{money(gst)}</span>
        </div>
        <div className="flex justify-between text-neutral-600">
          <span>Service Tip (10%)</span>
          <span>{money(serviceTip)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t pt-3 text-base font-semibold">
          <span>Grand Total</span>
          <span>{money(grandTotal)}</span>
        </div>
      </div>
    </div>
  )
}

export default PriceCard
