import { useContext } from "react";
import { NavLink } from "react-router";
import { LuLogOut } from "react-icons/lu";
import { AdminContext } from "../contexts/AdminProvider";

const NIVEL_ADMIN = '1e088d37-943d-4cba-a7e0-457fed7f6298';

const estiloNav = "flex flex-col *:border-amber-500 *:text-center *:w-40 *:leading-10 *:font-semibold *:text-[#f1c289]! *:hover:bg-amber-200/25! gap-4 md:gap-6 mt-4 *:text-xl md:*:text-2xl *:rounded *:duration-200! *:[&.active]:border-amber-500! *:[&.active]:border-2! *:[&.active]:text-amber-200!";

const Menu = () => {
    const { logout } = useContext(AdminContext);
    const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");
    const ehAdmin = usuario?.nivel_id == NIVEL_ADMIN;

    return (
        <aside className="w-56 h-full overflow-y-auto bg-[#020202] p-4 flex flex-col items-center">
            <img src="/logox.png" alt="JP Imóveis" className="w-28 h-28 md:w-40 md:h-40 object-contain" />
            <nav className={estiloNav}>
                <NavLink end to="/painel">Dashboard</NavLink>
                <NavLink end to="/painel/imoveis">Imóveis</NavLink>
                <NavLink end to="/painel/locatarios">Locatários</NavLink>
                {ehAdmin && (
                    <>
                        <NavLink end to="/painel/niveis">Níveis</NavLink>
                        <NavLink end to="/painel/imoveis-tipo">Tipos Imóveis</NavLink>
                        <NavLink end to="/painel/usuarios">Usuários</NavLink>
                    </>
                )}
            </nav>
            <button
                type="button"
                onClick={logout}
                className="mt-auto pt-6 flex items-center gap-2 text-[#f1c289]/80 hover:text-amber-200 cursor-pointer"
            >
                <LuLogOut /> Sair
            </button>
        </aside>
    );
}

export default Menu;
