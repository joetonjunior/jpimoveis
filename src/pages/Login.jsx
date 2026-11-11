import { Button, Form, Input } from "antd";
import { useLogin } from "../hooks/usuarioHooks";

const Login = () => {

    const {mutate: login, isPending: loginPending} = useLogin();

    function logar(dados){
        login(dados,{
            onSuccess: (res) => {
                alert(res.description)
            }
        })
        
    }

    return ( 
        <div className="relative h-screen bg-[#020202] flex flex-col items-center">
            <img src="./banner.png" className="absolute w-100 h-100 cursor-pointer object-contain"></img>
            <div className="absolute mt-[313px] w-100 p-4 bg-[#020202] rounded-2xl">
                <Form
                    layout="vertical"
                    onFinish={logar}
                >
                    <Form.Item
                        label={<span className=" text-[#f1c289]">Email:</span>}
                        name={"email"}
                        rules={[{required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="email@email.com" />
                    </Form.Item>
                    <Form.Item
                        label={<span className=" text-[#f1c289]">Senha:</span>}
                        name={"senha"}
                        rules={[{required: true, message: "Campo obrigatório"}]}
                    >
                        <Input.Password placeholder="******" />
                    </Form.Item>
                    <Button 
                    type="primary"
                    htmlType="submit"
                    className="w-full px-6 bg-[#020202]! border border-amber-500! text-[#f1c289]! font-semibold rounded-lg shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-black/70! hover:text-amber-200! hover:border-amber-400! hover:shadow-amber-500/20!"
                    >Logar</Button>
                </Form>

            </div>
        </div>
     );
}
 
export default Login;