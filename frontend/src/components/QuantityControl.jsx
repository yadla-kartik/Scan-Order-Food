function QuantityControl({ quantity = 0, onAdd, onRemove, compact = false }) {
  if (!quantity) {
    return (
      <button onClick={onAdd} className="inline-flex h-8 items-center justify-center rounded-full border-2 border-[#d8222f] px-4 text-sm font-bold text-[#d8222f] transition hover:bg-[#d8222f] hover:text-white active:scale-95">
        ADD
      </button>
    )
  }

  return (
    <div className={`inline-flex w-fit items-center overflow-hidden rounded-full border border-[#d8222f] bg-white text-[#d8222f] shadow-sm ${compact ? 'h-8' : 'h-8'}`}>
      <button onClick={onRemove} className={`${compact ? 'h-8 w-8' : 'h-8 w-9'} grid place-items-center rounded-l-full text-base font-bold transition active:scale-90`} aria-label="Decrease quantity">
        -
      </button>
      <span className="min-w-7 text-center text-sm font-bold">{quantity}</span>
      <button onClick={onAdd} className={`${compact ? 'h-8 w-8' : 'h-8 w-9'} grid place-items-center rounded-r-full bg-[#d8222f] text-base font-bold text-white transition active:scale-90`} aria-label="Increase quantity">
        +
      </button>
    </div>
  )
}

export default QuantityControl
