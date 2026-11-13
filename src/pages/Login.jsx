import { App, Button, Form, Input } from "antd";
import { useLogin } from "../hooks/usuarioHooks";
import { useState } from "react";
import { useNavigate } from "react-router";

const Login = () => {
    const [tamanho, setTamanho] = useState(window.innerWidth);

    const navigate = useNavigate();

    const { notification } = App.useApp();

    const { mutate: login, isPending: loginPending } = useLogin();

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
        <>
            {tamanho > 780 ? (
                <div className="relative h-170 bg-[#020202] flex flex-col items-center">
                    <img src="./banner.png" className="w-125 h-125 object-contain"></img>
                    <div className="absolute mt-100 w-125 p-4 bg-[#020202]">
                        <Form
                            layout="vertical"
                            onFinish={logar}
                        >
                            <Form.Item
                                label={<span className=" text-[#f1c289]">Email:</span>}
                                name={"email"}
                                rules={[{ required: true, message: "Campo obrigatório" }]}
                            >
                                <Input placeholder="email@email.com" />
                            </Form.Item>
                            <Form.Item
                                label={<span className=" text-[#f1c289]">Senha:</span>}
                                name={"senha"}
                                rules={[{ required: true, message: "Campo obrigatório" }]}
                            >
                                <Input.Password placeholder="******" />
                            </Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loginPending}
                                className="w-full px-6 py-6 bg-[#020202]! border border-amber-500! text-[#f1c289]! font-semibold rounded-lg shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-black/70! hover:text-amber-200! hover:border-amber-400! hover:shadow-amber-500/20!"
                            >Logar</Button>
                        </Form>

                    </div>
                </div>
            ) : (
                <div className="relative h-screen bg-[#020202] flex flex-col items-center">
                    <img src="./logox.png" className="w-80 h-80 object-contain"></img>
                    <div className="w-80 p-4 bg-[#020202]">
                        <Form
                            layout="vertical"
                            onFinish={logar}
                        >
                            <Form.Item
                                label={<span className=" text-[#f1c289]">Email:</span>}
                                name={"email"}
                                rules={[{ required: true, message: "Campo obrigatório" }]}
                            >
                                <Input placeholder="email@email.com" />
                            </Form.Item>
                            <Form.Item
                                label={<span className=" text-[#f1c289]">Senha:</span>}
                                name={"senha"}
                                rules={[{ required: true, message: "Campo obrigatório" }]}
                            >
                                <Input.Password placeholder="******" />
                            </Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loginPending}
                                className="w-full px-6 mt-4 py-6 bg-[#020202]! border border-amber-500! text-[#f1c289]! font-semibold rounded-lg shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-black/70! hover:text-amber-200! hover:border-amber-400! hover:shadow-amber-500/20!"
                            >Logar</Button>
                        </Form>

                    </div>
                </div>
            )}
        </>
    );
}

export default Login;