import { App, Button, Drawer, Form, Image, Input, Popconfirm, Table } from "antd";
import { LuImageOff, LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { useBuscarImoveis, useCriarImoveis, useDeletarImoveis, useEditarImoveis } from "../hooks/imoveisHooks";
import { useState } from "react";
import { useBuscarImoveisTipo } from "../hooks/imoveisTipoHooks";
import { useBuscarLocatarios } from "../hooks/locatariosHooks";
import { APIurl } from "../services";


// //Função de máscara para CEP:
// const formatCEP = (value: string) => {
//   if (!value) return value;

//   // Remove tudo que não for número e limita a 8 dígitos
//   const digits = value.replace(/\D/g, '').slice(0, 8);

//   // Adiciona o hífen após os 5 primeiros dígitos
//   if (digits.length > 5) {
//     return `${digits.slice(0, 5)}-${digits.slice(5)}`;
//   }

//   return digits;
// };


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

const Imoveis = () => {

    const [mostrarCriar, setMostrarCriar] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const { notification } = App.useApp();
    const {data: imoveis, isLoading: loadingImoveis} = useBuscarImoveis("?tipo=true&locatario=true");
    const {data: tipos} = useBuscarImoveisTipo();
    const {data: locatarios} = useBuscarLocatarios();
    const { mutate: criarImoveis, isLoading: loadingCriar} = useCriarImoveis();
    const { mutate: editarImoveis, isLoading: loadingEditar} = useEditarImoveis();
    const { mutate: deletarImoveis } = useDeletarImoveis();

    const [formEditar] = Form.useForm();
    const [formCriar] = Form.useForm();

    function criar(dados){
        criarImoveis(dados,{
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
        editarImoveis(dados,{
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
        deletarImoveis(id,{
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
                <h2 className="text-3xl font-bold">Imóveis</h2>
                <Button
                    type="primary"
                    icon={<LuPlus />}
                    onClick={() => setMostrarCriar(true)}
                    style={{
                        backgroundColor: '#020202',
                        color: '#f1c289',
                        borderColor: '#f1c289',
                    }}
                >Novo imóvel</Button>
            </div>
            <div>
                <Table
                    dataSource={imoveis || []}
                    rowKey={"id"}
                    loading={loadingImoveis}
                    pagination={{
                          pageSize: 5, // Quantidade de itens por página (padrão é 10)
                          showSizeChanger: false, // Mostra um seletor para mudar entre 10, 20, 50 itens
                          showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} imoveis`, // Texto informativo
                      }}
                >
                    <Table.Column 
                        title="Foto"
                        render={(_, linha) =>{
                            return linha.imagem? (
                                <Image
                                    width={80}
                                    height={60}
                                    className="object-contain"
                                    src={APIurl + linha?.imagem}
                                />
                            ) : (
                                <div className="w-20 h-15 bg-slate-300 flex justify-center items-center">
                                    <LuImageOff/>
                                </div>
                            )
                        }}
                    />
                    <Table.Column 
                        title="Endereço"
                        render={(_, linha) =>(
                            `${linha.logradouro}, ${linha.numero} ${linha?.complemento}, ${linha.bairro}, ${linha.cidade}-${linha.estado}`
                        )}
                    />

                    <Table.Column 
                        title="Quartos"
                        dataIndex="quartos"
                        align="center"
                    />

                    <Table.Column 
                        title="Banheiros"
                        dataIndex="banheiros"
                        align="center"
                    />

                    <Table.Column 
                        title="Garagens"
                        render={(_, linha) => linha.garagens ?? "---"}
                        align="center"
                    />
                    <Table.Column 
                        title="Tipo"
                        dataIndex={["imoveis_tipo", "nome"]}
                        align="center"
                    />
                    <Table.Column 
                        title="Locatário"
                        render={(_,linha) => (linha.locatario? linha.locatario.nome : "Disponível")}
                        align="center"
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
            title="Criar Imóvel"
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
                        label={<span style={{ color: '#f1c289' }}>Matricula</span>}
                        name="matricula"
                    >
                        <Input placeholder="00000"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Bairro</span>}
                        name="bairro"
                        rules={[{ required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="Bairro do imóvel"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Cidade</span>}
                        name="cidade"
                        rules={[{ required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="Cidade"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Estado</span>}
                        name="estado"
                        rules={[{ required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="CE"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Número</span>}
                        name="numero"
                        rules={[{ required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="00"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Complemento</span>}
                        name="complemento"
                    >
                        <Input placeholder="Complemento"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>CEP</span>}
                        name="cep"
                        rules={[{ required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="00.000-000"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Valor Aluguel</span>}
                        name="valor_aluguel"
                        rules={[{ required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="R$ 0.000,00"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>IPTU</span>}
                        name="iptu"
                        rules={[{ required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="R$ 0.000,00"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Valor Condomínio</span>}
                        name="valor_condominio"
                    >
                        <Input placeholder="R$ 0.000,00"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Metragem</span>}
                        name="metragem"
                        rules={[{ required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="0"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Quartos</span>}
                        name="quartos"
                        rules={[{ required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="0"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Suítes</span>}
                        name="suites"
                        rules={[{ required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="0"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Banheiros</span>}
                        name="banheiros"
                        rules={[{ required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="0"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Garagens</span>}
                        name="garagens"
                    >
                        <Input placeholder="0"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Tipo</span>}
                        name="tipo_id"
                        rules={[{ required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="Tipo do Imóvel"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Locatário</span>}
                        name="locatario_id"
                    >
                        <Input placeholder="Locatário do Imóvel"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Logradouro</span>}
                        name="logradouro"
                        rules={[{ required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="Logradouro"/>
                    </Form.Item>
                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Imagem</span>}
                        name="imagem"
                    >
                        <Input placeholder="Imagem do Imóvel"/>
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
            title="Editar imóvel"
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
                        label={<span style={{ color: '#f1c289' }}>Nome do Imóvel</span>}
                        name="nome"
                        rules={[{ required: true, message: "Campo obrigatório"}]}
                    >
                        <Input placeholder="Nome do imóvel"/>
                    </Form.Item>

                    <Form.Item
                        label={<span style={{ color: '#f1c289' }}>Telefone do Imóvel</span>}
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
                        label={<span style={{ color: '#f1c289' }}>CPF/CNPJ do Imóvel</span>}
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
 
export default Imoveis;
