import { ConfigProvider } from "antd";
import { NavLink } from "react-router";

const Menu = () => {
    return ( 
        <header className="w-55 h-screen bg-[#020202] p-4 justify-items-center">
            <img src="../logox.png" className="w-40 h-40 cursor-pointer object-contain"></img>
            <nav className="flex flex-col *:border-amber-500 *:text-center *:w-40 *:leading-10 *:font-semibold *:text-[#f1c289]! *:hover:bg-amber-200/25! gap-8 mt-4 *:text-2xl *:rounded *:duration-200! *:[&.active]:border-amber-500! *:[&.active]:border-2! *:[&.active]:text-amber-200!">
                <NavLink end to="/painel">Home</NavLink>
                <NavLink end to="/painel/niveis">Niveis</NavLink>
                <NavLink end to="/painel/imoveis-tipo">Imóveis</NavLink>
            </nav>
        </header>
        
     );
}
 
export default Menu;