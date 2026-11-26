import { App, Button, Drawer, Form, Input, Popconfirm, Select, Table } from "antd";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { useBuscarUsuario, useCriarUsuario, useDeletarUsuario, useEditarUsuario } from "../hooks/usuarioHooks";
import { useState } from "react";
import { useBuscarNiveis } from "../hooks/niveisHooks";

// Função para formatar fixo (10 dígitos) e celular (11 dígitos)
const formatPhone = (value) => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '').slice(0, 11);

    if (digits.length <= 2) return digits.length ? `(${digits}` : '';
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const Usuarios = () => {

    const [mostrarCriar, setMostrarCriar] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const { notification } = App.useApp();
    const { data: usuarios, isLoading: loadingUsuarios } = useBuscarUsuario();
    const { data: niveis = [] } = useBuscarNiveis();
    const { mutate: criarUsuarios, isLoading: loadingCriar } = useCriarUsuario();
    const { mutate: editarUsuarios, isLoading: loadingEditar } = useEditarUsuario();
    const { mutate: deletarUsuarios } = useDeletarUsuario();

    const [formEditar] = Form.useForm();
    const [formCriar] = Form.useForm();
    const [tamanho, setTamanho] = useState(window.innerWidth);

    function criar(dados) {
        criarUsuarios(dados, {
            onSuccess: ({ type, description }) => {
                setMostrarCriar(false);
                formCriar.resetFields();
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

    function editar(dados) {
        editarUsuarios(dados, {
            onSuccess: ({ type, description }) => {
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

    function deletar(id) {
        console.log(id)
        deletarUsuarios(id, {
            onSuccess: ({ type, description }) => {
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
            <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
                <h2 className="text-2xl md:text-3xl font-bold">Usuários</h2>
                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setMostrarCriar(true)}
                    style={{
                        backgroundColor: '#020202',
                        color: '#f1c289',
                        borderColor: '#f1c289',
                    }}
                >Novo usuário</Button>
            </div>
            <div>
                {tamanho > 500 ? (
                     <Table
                    dataSource={usuarios || []}
                    rowKey={"id"}
                    scroll={{ x: "max-content" }}
                    loading={loadingUsuarios}
                    pagination={{
                          pageSize: 5, // Quantidade de itens por página (padrão é 10)
                          showSizeChanger: false, // Mostra um seletor para mudar entre 10, 20, 50 itens
                          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} usuarios`, // Texto informativo
                      }}
                >
                    
                    <Table.Column
                        title="Nome"
                        render={(_, linha) => (
                        <div className="min-w-48 max-w-80">
                            <div className="font-medium">{linha.nome}</div>
                            <div className="text-xs text-gray-500">{linha.email}</div>
                        </div>
                          )}
                    />
                    
                    <Table.Column
                        title="Nível"
                        dataIndex={["nivel", "nome"]}
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
                                        formEditar.setFieldsValue({
                                            ...linha,
                                            nivel_id: linha.nivel_id ?? linha.nivel?.id,
                                        });
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
                ) : ( <Table
                    dataSource={usuarios || []}
                    rowKey={"id"}
                    scroll={{ x: "max-content" }}
                    loading={loadingUsuarios}
                    pagination={{
                          pageSize: 5, // Quantidade de itens por página (padrão é 10)
                          showSizeChanger: false, // Mostra um seletor para mudar entre 10, 20, 50 itens
                          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} usuarios`, // Texto informativo
                      }}
                >
                    
                    <Table.Column
                        title="Nome"
                        render={(_, linha) => (
                        <div className="min-w-48 max-w-80">
                            <div className="font-medium">{linha.nome}</div>
                            <div className="text-xs text-gray-500">{linha.email}</div>
                        </div>
                          )}
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
                                        formEditar.setFieldsValue({
                                            ...linha,
                                            nivel_id: linha.nivel_id ?? linha.nivel?.id,
                                        });
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
                </Table>)}
               
            </div>
            <Drawer
                title="Criar Usuário"
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
                    form={formCriar}
                >
                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Nome do Usuário</span>}
                        name="nome"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input placeholder="Nome do Usuário" />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>E-mail do Usuário</span>}
                        name="email"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input placeholder="email@email.com" />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Senha</span>}
                        name="senha"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input placeholder="********" />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Nível do Usuário</span>}
                        name="nivel_id"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Select
                            placeholder="Escolha um nível"
                            options={(niveis || []).map(nivel => {
                                return {
                                    label: nivel.nome,
                                    value: nivel.id
                                }
                            })
                        }

                        />
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
                title="Editar usuário"
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
                        label={<span style={{ color: '#f1c289' }}>Nome do Usuário</span>}
                        name="nome"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input placeholder="Nome do usuário" />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>E-mail do Usuário</span>}
                        name="email"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Input placeholder="email@email.com" />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Senha</span>}
                        name="senha"
                    >
                        <Input placeholder="********" />
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Nível do Usuário</span>}
                        name="nivel_id"
                        rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                        <Select
                            placeholder="Escolha um nível"
                            options={(niveis || []).map(nivel => {
                                return {
                                    label: nivel.nome,
                                    value: nivel.id
                                }
                            })
                        }

                        />
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

export default Usuarios;
