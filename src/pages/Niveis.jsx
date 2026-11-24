import { App, Button, Drawer, Form, Input, Popconfirm, Table } from "antd";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { useBuscarNiveis, useCriarNivel, useDeletarNivel, useEditarNivel } from "../hooks/niveisHooks";
import { useState } from "react";

const Niveis = () => {

    const [mostrarCriar, setMostrarCriar] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const { notification } = App.useApp();
    const {data: niveis, isLoading: loadingNiveis} = useBuscarNiveis();
    const { mutate: criarNivel, isLoading: loadingCriar} = useCriarNivel();
    const { mutate: editarNivel, isLoading: loadingEditar} = useEditarNivel();
    const { mutate: deletarNivel } = useDeletarNivel();

    const [formEditar] = Form.useForm();

    function criar(dados){
        criarNivel(dados,{
            onSuccess: ({ type, description}) => {
                setMostrarCriar(false);
                notification[type]({
                    description,
                    placement: "bottomRight"
                })

            },
            onError: ({ response: { data: { type, description } } }) => {
                notification[type]({
                    description,
                    className: "bg-amber-200/50!"
                });
            }
        })
    }

    function editar(dados){
        editarNivel(dados,{
            onSuccess: ({ type, description}) => {
                setMostrarEditar(false);
                notification[type]({
                    description,
                    placement: "bottomRight"
                })

            },
            onError: ({ response: { data: { type, description } } }) => {
                notification[type]({
                    description,
                    className: "bg-amber-200/50!"
                });
            }
        })
    }

    function deletar(id){
        console.log(id)
        deletarNivel(id,{
            onSuccess: ({ type, description}) => {
                setMostrarCriar(false);
                notification[type]({
                    description,
                    placement: "bottomRight"
                })

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
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">Níveis</h2>
                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setMostrarCriar(true)}
                    style={{
                        backgroundColor: '#020202',
                        color: '#f1c289',
                        borderColor: '#f1c289',
                    }}
                >Novo nível</Button>
            </div>
            <div>
                <Table
                    dataSource={niveis || []}
                    rowKey={"id"}
                    loading={loadingNiveis}
                    pagination={{
                          pageSize: 5, // Quantidade de itens por página (padrão é 10)
                          showSizeChanger: false, // Mostra um seletor para mudar entre 10, 20, 50 itens
                          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} níveis`, // Texto informativo
                      }}
                >
                    <Table.Column 
                        title="Nome"
                        dataIndex="nome"
                    />
                    <Table.Column 
                        title="Ações"
                        className="w-25"
                        render={(_, linha) => (
                            <div className="flex gap-2">
                                <Button 
                                    icon={<LuPencil />}
                                    onClick={() => {
                                        // formEditar.setFieldValue("id", linha.id);
                                        // formEditar.setFieldValue("nome", linha.nome);
                                        formEditar.setFieldsValue(linha);
                                        setMostrarEditar(true);
                                    }}
                                    style={{
                                        backgroundColor: '#020202',
                                        color: '#f1c289',
                                        borderColor: '#f1c289',
                                    }}
                                />
                                <Popconfirm
                                    title="Aviso:"
                                    description="Deseja realmente apagar este registro?"
                                    okText="Sim"
                                    cancelText="Não"
                                    onConfirm={() => deletar(linha.id)}
                                >
                                    <Button 
                                    icon={<LuTrash2 />}
                                    style={{
                                        backgroundColor: '#020202',
                                        color: '#f1c289',
                                        borderColor: '#f1c289',
                                    }}
                                    />

                                </Popconfirm>
                            </div>
                        )}
                    />
                </Table>
            </div>
            <Drawer
            title="Criar Nível"
            open={mostrarCriar}
            onClose={() => setMostrarCriar(false)}
            style={{
                        backgroundColor: '#020202',
                        color: '#f1c289',
                        borderColor: '#f1c289',
                    }}
            >
                <Form
                    layout="vertical"
                    onFinish={criar}
                >
                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Nome do Nível</span>}
                        name="nome"
                        rules={[{ required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="Nome do Nível"/>
                    </Form.Item>

                    <div className="flex justify-end text-amber-300">
                        <Button
                        type="primary"
                        htmlType="submit"
                        loading={loadingCriar}
                        style={{
                        backgroundColor: '#020202',
                        color: '#f1c289',
                        borderColor: '#f1c289',
                    }}
                        >Enviar</Button>
                    </div>


                </Form>

            </Drawer>
            <Drawer
            title="Editar Nível"
            open={mostrarEditar}
            onClose={() => setMostrarEditar(false)}
            style={{
                        backgroundColor: '#020202',
                        color: '#f1c289',
                        borderColor: '#f1c289',
                    }}
            >
                <Form
                    layout="vertical"
                    onFinish={editar}
                    form={formEditar}
                >
                    <Form.Item
                        name="id"
                        hidden
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Nome do Nível</span>}
                        name="nome"
                        rules={[{ required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="Nome do Nível"/>
                    </Form.Item>

                    <div className="flex justify-end text-amber-300">
                        <Button
                        type="primary"
                        htmlType="submit"
                        loading={loadingEditar}
                        style={{
                        backgroundColor: '#020202',
                        color: '#f1c289',
                        borderColor: '#f1c289',
                    }}
                        >Enviar</Button>
                    </div>


                </Form>

            </Drawer>
        </div>
     );
}
 
export default Niveis;
