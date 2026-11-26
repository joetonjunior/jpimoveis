import { ConfigProvider } from "antd";
import { NavLink } from "react-router";

const Menu = () => {
    let usuario = JSON.parse(sessionStorage.getItem("usuario"))
    const nivel_id = usuario.nivel_id
    if(nivel_id == '1e088d37-943d-4cba-a7e0-457fed7f6298'){console.log(nivel_id)};
    return ( 
        <header className="w-55 h-screen bg-[#020202] p-4 justify-items-center">
            <img src="../logox.png" className="w-40 h-40 object-contain"></img>
            {nivel_id == '1e088d37-943d-4cba-a7e0-457fed7f6298'? (
                <nav className="flex flex-col *:border-amber-500 *:text-center *:w-40 *:leading-10 *:font-semibold *:text-[#f1c289]! *:hover:bg-amber-200/25! gap-8 mt-4 *:text-2xl *:rounded *:duration-200! *:[&.active]:border-amber-500! *:[&.active]:border-2! *:[&.active]:text-amber-200!">
                
                    <NavLink end to="/painel">Dashboard</NavLink>
                    <NavLink end to="/painel/imoveis">Imoveis</NavLink>
                    <NavLink end to="/painel/locatarios">Locatários</NavLink>
                    <NavLink end to="/painel/niveis">Niveis</NavLink>
                    <NavLink end to="/painel/imoveis-tipo">Tipos Imóveis</NavLink>
                    <NavLink end to="/painel/usuarios">Usuários</NavLink>
                </nav>
            ) : (
                <nav className="flex flex-col *:border-amber-500 *:text-center *:w-40 *:leading-10 *:font-semibold *:text-[#f1c289]! *:hover:bg-amber-200/25! gap-8 mt-4 *:text-2xl *:rounded *:duration-200! *:[&.active]:border-amber-500! *:[&.active]:border-2! *:[&.active]:text-amber-200!">
                
                    <NavLink end to="/painel">Home</NavLink>
                    <NavLink end to="/painel/imoveis">Imoveis</NavLink>
                    <NavLink end to="/painel/locatarios">Locatários</NavLink>
                </nav>
            )}
            
        </header>
        
     );
}
 
export default Menu;
