import { App, Button, Drawer, Form, Input, Popconfirm, Table } from "antd";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { useBuscarLocatarios, useCriarLocatarios, useDeletarLocatarios, useEditarLocatarios } from "../hooks/locatariosHooks";
import { useState } from "react";


//Função de máscara para cpf/cnpj:

const formatCpfCnpj = (value) => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 14);

  if (digits.length <= 11) {
    // Máscara CPF: 000.000.000-00
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  // Máscara CNPJ: 00.000.000/0000-00
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};


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

const Locatarios = () => {

    const [mostrarCriar, setMostrarCriar] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const { notification } = App.useApp();
    const {data: locatarios, isLoading: loadingLocatarios} = useBuscarLocatarios();
    const { mutate: criarLocatarios, isLoading: loadingCriar} = useCriarLocatarios();
    const { mutate: editarLocatarios, isLoading: loadingEditar} = useEditarLocatarios();
    const { mutate: deletarLocatarios } = useDeletarLocatarios();

    const [formEditar] = Form.useForm();
    const [formCriar] = Form.useForm();

    const [tamanho, setTamanho] = useState(window.innerWidth);

    function criar(dados){
        criarLocatarios(dados,{
            onSuccess: ({ type, description}) => {
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

    function editar(dados){
        editarLocatarios(dados,{
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
        deletarLocatarios(id,{
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
            <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
                <h2 className="text-2xl md:text-3xl font-bold">Locatários</h2>
                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setMostrarCriar(true)}
                    style={{
                        backgroundColor: '#020202',
                        color: '#f1c289',
                        borderColor: '#f1c289',
                    }}
                >Novo locatário</Button>
            </div>
            <div>
                {tamanho > 500 ? ( <Table
                    dataSource={locatarios || []}
                    rowKey={"id"}
                    scroll={{ x: "max-content" }}
                    loading={loadingLocatarios}
                    pagination={{
                          pageSize: 5, // Quantidade de itens por página (padrão é 10)
                          showSizeChanger: false, // Mostra um seletor para mudar entre 10, 20, 50 itens
                          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} locatarios`, // Texto informativo
                      }}
                >
                    <Table.Column 
                        title="Nome"
                        render={(_, linha) => (
                        <div className="min-w-48 max-w-80">
                            <div className="font-medium">{linha.nome}</div>
                            <div className="text-xs text-gray-500">{linha.cpf_cnpj}</div>
                        </div>
                    )}
                    />
                    <Table.Column 
                        title="Telefone"
                        dataIndex="telefone"
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
                </Table>) : ( <Table
                    dataSource={locatarios || []}
                    rowKey={"id"}
                    scroll={{ x: "max-content" }}
                    loading={loadingLocatarios}
                    pagination={{
                          pageSize: 5, // Quantidade de itens por página (padrão é 10)
                          showSizeChanger: false, // Mostra um seletor para mudar entre 10, 20, 50 itens
                          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} locatarios`, // Texto informativo
                      }}
                >
                    <Table.Column 
                        title="Nome"
                        render={(_, linha) => (
                        <div className="min-w-48 max-w-80">
                            <div className="font-medium">{linha.nome}</div>
                            <div className="text-xs text-gray-500">{linha.telefone}</div>
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
                </Table>)}
               
            </div>
            <Drawer
            title="Criar Locatário"
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
                        label={<span style={{ color: '#f1c289' }}>Nome do Locatário</span>}
                        name="nome"
                        rules={[{ required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="Nome do Locatário"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Telefone do Locatário</span>}
                        name="telefone"
                        normalize={formatPhone}
                        rules={[{ required: true, message: "Campo obrigatório"},
                                {
                                    pattern: /^\(\d{2}\) \d{4,5}-\d{4}$/,
                                    message: 'Telefone inválido (use DDD + 8 ou 9 dígitos)',
                                },]}
                    >
                        <Input placeholder="(00) 0000-0000"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>CPF/CNPJ do Locatário</span>}
                        name="cpf_cnpj"
                        normalize={formatCpfCnpj}
                        rules={[{ required: true, message: "Campo obrigatório"},{
                                validator: (_, value) => {
                                const digits = (value || '').replace(/\D/g, '');
                                if (!digits || digits.length === 11 || digits.length === 14) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Digite um CPF ou CNPJ válido'));
                                },
                            },]}
                    >
                        <Input placeholder="000.000.000-00"/>
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
            title="Editar locatário"
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
                        label={<span style={{ color: '#f1c289' }}>Nome do Locatário</span>}
                        name="nome"
                        rules={[{ required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="Nome do locatário"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Telefone do Locatário</span>}
                        name="telefone"
                        normalize={formatPhone}
                        rules={[{ required: true, message: "Campo obrigatório"},
                                {
                                    pattern: /^\(\d{2}\) \d{4,5}-\d{4}$/,
                                    message: 'Telefone inválido (use DDD + 8 ou 9 dígitos)',
                                },]}
                    >
                        <Input placeholder="(00) 0000-0000"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>CPF/CNPJ do Locatário</span>}
                        name="cpf_cnpj"
                        normalize={formatCpfCnpj}
                        rules={[{ required: true, message: "Campo obrigatório"},{
                                validator: (_, value) => {
                                const digits = (value || '').replace(/\D/g, '');
                                if (!digits || digits.length === 11 || digits.length === 14) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Digite um CPF ou CNPJ válido'));
                                },
                            },]}
                    >
                        <Input placeholder="000.000.000-00"/>
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
 
export default Locatarios;
