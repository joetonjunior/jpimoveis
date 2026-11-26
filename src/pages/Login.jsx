import { App, Button, Form, Input } from "antd";
import { useLogin } from "../hooks/usuarioHooks";
import { useContext } from "react";
import { useNavigate } from "react-router";
import { AdminContext } from "../contexts/AdminProvider";

const acesso = "true";

const Login = () => {
    const navigate = useNavigate();

    const { notification } = App.useApp();

    const { mutate: login, isPending: loginPending } = useLogin();
    const { setToken } = useContext(AdminContext);

    function logar(dados) {
        login(dados, {
            onSuccess: ({ type, description, usuario, token }) => {
                notification[type]({
                    description,
                    className: "bg-amber-200/50!"
                });
                if (type == "success") {
                    sessionStorage.setItem("token", token);
                    sessionStorage.setItem("usuario", JSON.stringify(usuario));
                    if (usuario.acesso === "true") {
                        sessionStorage.setItem("acesso", acesso);
                    } else {
                        sessionStorage.removeItem("acesso");
                    }
                    setToken(token)
                    navigate("/painel");
                }
            },
            onError: ({ response: { data: { type, description } } }) => {
                notification[type]({
                    description,
                    className: "bg-amber-200/50!"
                });
            }
        })

    }

    return (
        <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center px-4 py-8">
            <img src="/logox.png" alt="JP Imóveis" className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-contain" />
            <div className="w-full max-w-sm p-4 bg-[#020202]">
                <Form
                    layout="vertical"
                    onFinish={logar}
                >
                    <Form.Item
                        label={<span className=" text-[#f1c289]">Email:</span>}
                        name={"email"}
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input placeholder="email@email.com" type="email" autoComplete="email" />
                    </Form.Item>
                    <Form.Item
                        label={<span className=" text-[#f1c289]">Senha:</span>}
                        name={"senha"}
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input.Password placeholder="******" autoComplete="current-password" />
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loginPending}
                        className="w-full px-6 mt-2 py-6 bg-[#020202]! border border-amber-500! text-[#f1c289]! font-semibold rounded-lg shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-black/70! hover:text-amber-200! hover:border-amber-400! hover:shadow-amber-500/20!"
                    >Logar</Button>
                </Form>
            </div>
        </div>
    );
}

export default Login;
