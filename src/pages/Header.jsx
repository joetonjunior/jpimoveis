import { useState } from 'react';
import { BiMenu } from 'react-icons/bi';


function App() {
  const [mostraMenu, setMostraMenu] = useState(false);
  return (
    <>
      <header className="max-h-dvh">
        <div className=" flex bg-[#020202] justify-center align-middle">
          <div className="w-1/3 items-start flex group text-[#f1c289] hover:text-amber-200">
            <BiMenu onClick={event => mostraMenu ? (setMostraMenu(false)) : (setMostraMenu(true))}  className="cursor-pointer ml-8 size-17 mt-2" />
          </div>
          <div className="w-1/3 flex justify-center">
            <img src="./logox.png" className="w-20 h-20 cursor-pointer object-contain"></img>
          </div>
          <div className="w-1/3"></div>
        </div>
        <div className="w-screen h-1 bg-linear-to-b from-[#f6e2a4] to-[#b26f1f]"></div>
        <div className={mostraMenu ? (" border-2 border-red-200 flex fixed w-full h-full") : ("hidden opacity-0 invisible")}>
          <div id="overlay" onClick={() => { setMostraMenu(false) }} className={mostraMenu ? ("w-full h-screen bg-[#292625]/70 fixed top-0 left-0 duration-200") : ("opacity-0 invisible")}></div>
          <ul className='border-3 h-[88%] border-[#f6e2a4] w-1/2 lg:w-1/4 flex flex-col items-center gap-10 relative z-10 bg-[#020202]'>
            <li className="w-full flex justify-center mt-10">
                      <button className="w-[75%] cursor-pointer bg-linear-to-b from-amber-200 via-yellow-400 to-amber-500 hover:from-amber-200 hover:via-yellow-300 hover:to-amber-400 text-black font-extrabold py-3 px-8 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:shadow-[0_0_30px_rgba(251,191,36,0.8)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
                        Home
                      </button>
                    </li>
            <li className="w-full flex justify-center">
                      <button className="w-[75%] cursor-pointer bg-linear-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-amber-200 hover:via-yellow-300 hover:to-amber-400 text-black font-extrabold py-3 px-8 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:shadow-[0_0_30px_rgba(251,191,36,0.8)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
                        Imóveis
                      </button>
                    </li>
            <li className="w-full flex justify-center">
                      <button className="w-[75%] cursor-pointer bg-linear-to-b from-amber-200 via-yellow-400 to-amber-500 hover:from-amber-200 hover:via-yellow-300 hover:to-amber-400 text-black font-extrabold py-3 px-8 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:shadow-[0_0_30px_rgba(251,191,36,0.8)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
                        Manutenção
                      </button>
                    </li>
            <li className="w-full flex justify-center">
                      <button className="w-[75%] cursor-pointer bg-linear-to-r from-amber-300 via-yellow-400 to-amber-500 hover:from-amber-200 hover:via-yellow-300 hover:to-amber-400 text-black font-extrabold py-3 px-8 rounded-lg shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:shadow-[0_0_30px_rgba(251,191,36,0.8)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
                        Usuários
                      </button>
                    </li>
          </ul>
        </div>
      </header>
      <div className='items-center justify-center flex mt-30'>
        <button className="px-6 py-3 bg-[#020202] border border-amber-500 text-[#f1c289] font-semibold rounded-lg shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-black/70 hover:text-amber-200 hover:border-amber-400 hover:shadow-amber-500/20">
          Clique Aqui
        </button>
      </div>   
    </>
  )
}

export default App
