import { Outlet } from "react-router";
import Menu from "../components/Menu";
import { useEffect, useState } from 'react';
import { BiMenu } from 'react-icons/bi';


const PageLayout = () => {
    const [mostraMenu, setMostraMenu] = useState(false);

    // fecha o menu com a tecla Esc
    useEffect(() => {
        const aoTeclar = (e) => e.key === "Escape" && setMostraMenu(false);
        window.addEventListener("keydown", aoTeclar);
        return () => window.removeEventListener("keydown", aoTeclar);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="sticky top-0 z-20">
                <div className="flex bg-[#020202] items-center h-16 md:h-20 px-3 md:px-8">
                    <div className="w-1/3 flex text-[#f1c289] hover:text-amber-200">
                        <button
                            type="button"
                            aria-label="Abrir menu"
                            onClick={() => setMostraMenu(!mostraMenu)}
                            className="cursor-pointer"
                        >
                            <BiMenu className="size-10 md:size-14" />
                        </button>
                    </div>
                    <div className="w-1/3 flex justify-center">
                        <img src="/logox.png" alt="JP Imóveis" className="w-14 h-14 md:w-20 md:h-20 object-contain" />
                    </div>
                    <div className="w-1/3"></div>
                </div>
                <div className="w-full h-1 bg-linear-to-b from-[#f6e2a4] to-[#b26f1f]"></div>
            </header>

            {/* Menu lateral (abre por cima do conteúdo em qualquer tamanho de tela) */}
            <div
                className={`fixed inset-0 z-30 transition-opacity duration-200 ${mostraMenu ? "opacity-100 visible" : "opacity-0 invisible"}`}
            >
                <div onClick={() => setMostraMenu(false)} className="absolute inset-0 bg-[#292625]/70" />
                <div
                    onClick={() => setMostraMenu(false)}
                    className={`relative h-full w-fit transition-transform duration-200 ${mostraMenu ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <Menu />
                </div>
            </div>

            <main className="flex-1">
                <div className="p-3 sm:p-4 md:p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default PageLayout;
