function Header() {
  return (
    <div className="flex justify-between px-5 items-center p-5">
      <div className="flex gap-5 text-lg">
        <i className="fa-brands fa-instagram text-2xl text-black transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_6px_red]"></i>
        <i className="fa-brands fa-square-twitter text-2xl text-black transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_6px_red]"></i>
        <i className="fa-brands fa-square-facebook text-2xl text-black transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_6px_red]"></i>
        <i className="fa-brands fa-youtube text-2xl text-black transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_6px_red]"></i>
      </div>
      <div className="flex items-center w-[500px]">
        <input
          type="text"
          placeholder="earch"
          className="p-5 outline-none w-full rounded-s-md bg-slate-200 hover:"
        />
        <button
          type="button"
          className="p-5 bg-slate-500 rounded-e-md hover:bg-red-200 duration-300 hover:drop-shadow-[2px_2px_2px_red]"
        >
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
        <div className="p-5">
          <i className="fa-solid fa-right-from-bracket text-2xl text-black transition-all duration-300 hover:text-white hover:drop-shadow-[0_0_5px_black]"></i>
        </div>
      </div>
    </div>
  );
}

export default Header;
