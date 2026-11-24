import { useEffect, useState } from "react";

// Retorna true quando a largura da janela é menor que o breakpoint (padrão: 768px = "md" do Tailwind)
const useTelaPequena = (breakpoint = 768) => {
    const [pequena, setPequena] = useState(() => window.innerWidth < breakpoint);

    useEffect(() => {
        const aoRedimensionar = () => setPequena(window.innerWidth < breakpoint);
        window.addEventListener("resize", aoRedimensionar);
        return () => window.removeEventListener("resize", aoRedimensionar);
    }, [breakpoint]);

    return pequena;
};

export default useTelaPequena;
