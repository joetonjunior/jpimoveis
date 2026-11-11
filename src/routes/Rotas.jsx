import { BrowserRouter, Route, Routes } from "react-router";
import Login from "../pages/login";

const Rotas = () => {
    return ( 
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />          
          </Routes>
        </BrowserRouter>
     );
}
 
export default Rotas;