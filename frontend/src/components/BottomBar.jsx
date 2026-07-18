function BottomBar({ left, right, onClick, pill = false, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`fixed bottom-4 left-1/2 z-30 flex w-[calc(100%-32px)] max-w-2xl -translate-x-1/2 items-center justify-between bg-[#d8222f] px-5 py-4 text-white shadow-2xl shadow-red-900/25 transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-neutral-400 disabled:shadow-none ${
        pill ? 'rounded-full' : 'rounded-xl'
      }`}
    >
      <span className="font-semibold">{left}</span>
      <span className="font-semibold">{right}</span>
    </button>
  )
}

export default BottomBar
