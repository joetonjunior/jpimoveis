import { ConfigProvider } from "antd";
import { NavLink } from "react-router";

const Menu = () => {
    return ( 
        <header className="w-55 h-screen bg-blue-500 p-4">
            <h1 className="text-4xl mb-5 font-semibold text-white">Tetos</h1>
            <nav className="flex flex-col *:leading-10 *:font-semibold *:text-white! *:hover:bg-white/25! *:rounded *:duration-200! *:[&.active]:bg-white! *:[&.active]:text-blue-500! *:pl-4">
                <NavLink end to="/painel">Home</NavLink>
                <NavLink end to="/painel/niveis">Niveis</NavLink>
            </nav>
        </header>
     );
}
 
export default Menu;