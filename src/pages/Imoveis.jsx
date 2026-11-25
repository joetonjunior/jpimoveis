import { App, Button, Drawer, Form, Image, Input, Popconfirm, Table, Tag } from "antd";
import { LuImageOff, LuPencil, LuPlus, LuSearch, LuTrash2 } from "react-icons/lu";
import { useMemo, useState } from "react";
import { useBuscarImoveis, useCriarImoveis, useDeletarImoveis, useEditarImoveis } from "../hooks/imoveisHooks";
import { useBuscarImoveisTipo } from "../hooks/imoveisTipoHooks";
import { useBuscarLocatarios } from "../hooks/locatariosHooks";
import { APIurl } from "../services";
import ImovelForm from "../components/ImovelForm";
import useTelaPequena from "../hooks/useTelaPequena";
import { enderecoCompleto, formatarMoeda, notificar, notificarErro } from "../utils/formatadores";



const estiloBotao = { backgroundColor: "#020202", color: "#f1c289", borderColor: "#f1c289" };

const estiloDrawer = {
    header: { backgroundColor: "#020202", color: "#f1c289", borderBottom: "1px solid #f1c28933" },
    body: { backgroundColor: "#020202" },
};

// Campos que a API aceita na edição (PUT) — relações e datas ficam de fora
const CAMPOS_EDITAVEIS = [
    "matricula", "logradouro", "numero", "complemento", "bairro", "cidade", "estado", "cep",
    "valor_aluguel", "iptu", "valor_condominio", "metragem", "quartos", "suites", "banheiros",
    "garagens", "tipo_id", "locatario_id",
];
const NUMERICOS = ["matricula", "valor_aluguel", "iptu", "valor_condominio", "metragem", "quartos", "suites", "banheiros", "garagens"];

function montarDadosEdicao(valores) {
    const dados = { id: valores.id };
    CAMPOS_EDITAVEIS.forEach((campo) => {
        let valor = valores[campo];
        if (valor === undefined || valor === "") valor = null;
        if (valor !== null && NUMERICOS.includes(campo)) valor = Number(valor);
        dados[campo] = valor;
    });
    return dados;
}

const Imoveis = () => {
    const [mostrarCriar, setMostrarCriar] = useState(false);
    const [imovelEditando, setImovelEditando] = useState(null);
    const [busca, setBusca] = useState("");
    const { notification } = App.useApp();
    const telaPequena = useTelaPequena();
    //verifica tamanho da tela para melhorar a responsividade
    const [celular, setCelular] = useState(window.innerWidth);

    const { data: imoveis, isLoading: loadingImoveis } = useBuscarImoveis("?tipo=true&locatario=true");
    const { data: tipos } = useBuscarImoveisTipo();
    const { data: locatarios } = useBuscarLocatarios();
    const { mutate: criarImoveis, isPending: loadingCriar } = useCriarImoveis();
    const { mutate: editarImoveis, isPending: loadingEditar } = useEditarImoveis();
    const { mutate: deletarImoveis } = useDeletarImoveis();

    const [formEditar] = Form.useForm();
    const [formCriar] = Form.useForm();

    const imoveisFiltrados = useMemo(() => {
        const lista = Array.isArray(imoveis) ? imoveis : [];
        const termo = busca.trim().toLowerCase();
        if (!termo) return lista;
        return lista.filter((imovel) =>
            [enderecoCompleto(imovel), imovel.imoveis_tipo?.nome, imovel.locatarios?.nome, imovel.matricula]
                .filter(Boolean)
                .some((texto) => String(texto).toLowerCase().includes(termo))
        );
    }, [imoveis, busca]);

    function criar(valores) {
        const { imagem, ...resto } = valores;
        const campos = { ...resto };
        delete campos.id;
        const arquivo = imagem?.[0]?.originFileObj;
        criarImoveis({ campos, arquivo }, {
            onSuccess: (resposta) => {
                notificar(notification, resposta);
                if (resposta?.type === "success") {
                    setMostrarCriar(false);
                    formCriar.resetFields();
                }
            },
            onError: (erro) => notificarErro(notification, erro),
        });
    }

    function abrirEdicao(imovel) {
        formEditar.resetFields();
        formEditar.setFieldsValue(
            CAMPOS_EDITAVEIS.reduce((acc, campo) => ({ ...acc, [campo]: imovel[campo] ?? undefined }), { id: imovel.id })
        );
        setImovelEditando(imovel);
    }

    function editar(valores) {
        editarImoveis(montarDadosEdicao(valores), {
            onSuccess: (resposta) => {
                notificar(notification, resposta);
                if (resposta?.type === "success") setImovelEditando(null);
            },
            onError: (erro) => notificarErro(notification, erro),
        });
    }

    function deletar(id) {
        deletarImoveis(id, {
            onSuccess: (resposta) => notificar(notification, resposta),
            onError: (erro) => notificarErro(notification, erro),
        });
    }

    const tamanhoDrawer = telaPequena ? "100%" : 640;

    return (
        <div>
            <div className="flex flex-wrap gap-3 justify-between items-center mb-4">
                <h2 className="text-2xl md:text-3xl font-bold">Imóveis</h2>
                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    <Input
                        allowClear
                        prefix={<LuSearch />}
                        placeholder="Buscar endereço, tipo, locatário..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="flex-1 sm:w-72!"
                    />
                    <Button
                        type="primary"
                        icon={<LuPlus />}
                        onClick={() => setMostrarCriar(true)}
                        style={estiloBotao}
                    >Novo imóvel</Button>
                </div>
            </div>

            <Table
                dataSource={imoveisFiltrados}
                rowKey="id"
                loading={loadingImoveis}
                scroll={{ x: "max-content" }}
                size={telaPequena ? "small" : "middle"}
                pagination={{
                    pageSize: 5,
                    showSizeChanger: false,
                    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} imóveis`,
                }}
            >
                <Table.Column
                    title="Foto"
                    responsive={["md"]}
                    render={(_, linha) => linha.imagem ? (
                        <Image width={80} height={60} className="object-cover rounded" src={APIurl + linha.imagem} />
                    ) : (
                        <div className="w-20 h-15 bg-slate-300 rounded flex justify-center items-center">
                            <LuImageOff />
                        </div>
                    )}
                />
                <Table.Column
                    title="Endereço"
                    render={(_, linha) => (
                        <div className="min-w-48 max-w-80">
                            <div className="font-medium">{linha.logradouro}, {linha.numero}{linha.complemento ? ` ${linha.complemento}` : ""}</div>
                            <div className="text-xs text-gray-500">{linha.bairro}, {linha.cidade}/{linha.estado}</div>
                        </div>
                    )}
                />
  
                <Table.Column
                    title="Aluguel"
                    align="right"
                    responsive={["md"]}
                    sorter={(a, b) => (a.valor_aluguel || 0) - (b.valor_aluguel || 0)}
                    render={(_, linha) => <span className="whitespace-nowrap">{formatarMoeda(linha.valor_aluguel)}</span>}
                />
                <Table.Column title="Quartos" dataIndex="quartos" align="center" responsive={["lg"]} />
                <Table.Column title="Banheiros" dataIndex="banheiros" align="center" responsive={["lg"]} />
                <Table.Column title="Garagens" align="center" responsive={["lg"]} render={(_, linha) => linha.garagens ?? "---"} />
                <Table.Column title="Tipo" dataIndex={["imoveis_tipo", "nome"]} align="center" responsive={["md"]} />
                <Table.Column
                    title="Locatário"
                    align="center"
                    responsive={["md"]}
                    render={(_, linha) => linha.locatarios
                        ? <span className="whitespace-nowrap">{linha.locatarios.nome}</span>
                        : <Tag color="gold">Disponível</Tag>}
                />
                <Table.Column
                    title="Ações"
                    fixed={telaPequena ? undefined : "right"}
                    render={(_, linha) => (
                        <div className="flex gap-2">
                            <Button icon={<LuPencil />} aria-label="Editar imóvel" onClick={() => abrirEdicao(linha)} style={estiloBotao} />
                            <Popconfirm
                                title="Aviso:"
                                description="Deseja realmente apagar este registro?"
                                okText="Sim"
                                cancelText="Não"
                                onConfirm={() => deletar(linha.id)}
                            >
                                <Button icon={<LuTrash2 />} aria-label="Apagar imóvel" style={estiloBotao} />
                            </Popconfirm>
                        </div>
                    )}
                />
            </Table>

            <Drawer
                title={<span style={{ color: "#f1c289" }}>Novo imóvel</span>}
                open={mostrarCriar}
                onClose={() => setMostrarCriar(false)}
                size={tamanhoDrawer}
                styles={estiloDrawer}
                destroyOnHidden={false}
            >
                <ImovelForm
                    form={formCriar}
                    modo="criar"
                    onFinish={criar}
                    loading={loadingCriar}
                    tipos={tipos}
                    locatarios={locatarios}
                />
            </Drawer>

            <Drawer
                title={<span style={{ color: "#f1c289" }}>Editar imóvel</span>}
                open={!!imovelEditando}
                onClose={() => setImovelEditando(null)}
                size={tamanhoDrawer}
                styles={estiloDrawer}
                forceRender
            >
                <ImovelForm
                    form={formEditar}
                    modo="editar"
                    onFinish={editar}
                    loading={loadingEditar}
                    tipos={tipos}
                    locatarios={locatarios}
                    imagemAtual={imovelEditando?.imagem}
                />
            </Drawer>
        </div>
    );
}

export default Imoveis;
