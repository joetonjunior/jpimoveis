import { Outlet, useLocation } from "react-router";
import Menu from "../components/Menu";
import { useState } from 'react';
import { BiMenu } from 'react-icons/bi';


const PageLayout = () => {
    const [mostraMenu, setMostraMenu] = useState(false);
    const localizacao = useLocation().pathname;
    return (
        <>
            <header className="h-21">
                <div className=" flex bg-[#020202] justify-center align-middle">
                    <div className="w-1/3 items-start flex group text-[#f1c289] hover:text-amber-200">
                        <BiMenu onClick={event => mostraMenu ? (setMostraMenu(false)) : (setMostraMenu(true))} className="cursor-pointer ml-8 size-17 mt-2" />
                    </div>
                    <div className="w-1/3 flex justify-center">
                        <img src="../logox.png" className="w-20 h-20 cursor-pointer object-contain"></img>
                    </div>
                    <div className="w-1/3"></div>
                </div>
                <div className="w-full h-1 bg-linear-to-b from-[#f6e2a4] to-[#b26f1f]"></div>
                <div
                    className={
                        mostraMenu
                            ? "border-2 border-red-200 flex duration-200 fixed w-full h-full z-30"
                            : "hidden opacity-0 invisible duration-200"
                    }
                >
                    <div
                        id="overlay"
                        onClick={() => setMostraMenu(false)}
                        className="w-full h-screen bg-[#292625]/70 fixed top-0 left-0 z-10 duration-200"
                    />
                    <div onClick={() => setMostraMenu(false)} className="relative z-20 duration-200">
                        <Menu />
                    </div>
                </div>
            </header>
            {localizacao == '/painel' ? (
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            ) : (
                <div className="flex-1 overflow-auto p-4">
                    <Outlet />
                </div>
            )}

        </>
    )
}

export default PageLayout;
