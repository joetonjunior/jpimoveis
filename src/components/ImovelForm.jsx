import { Button, Col, Form, Image, Input, InputNumber, Row, Select, Upload } from "antd";
import { LuUpload } from "react-icons/lu";
import { useState } from "react";
import { APIurl } from "../services";
import { formatarCEP } from "../utils/formatadores";

const ESTADOS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

const obrigatorio = [{ required: true, message: "Campo obrigatório" }];

const Rotulo = ({ children }) => <span style={{ color: "#f1c289" }}>{children}</span>;

const Secao = ({ children }) => (
    <h3 className="text-[#f1c289] font-semibold text-base border-b border-[#f1c289]/30 pb-1 mb-3 mt-2">
        {children}
    </h3>
);

const Dinheiro = (props) => (
    <InputNumber
        {...props}
        prefix="R$"
        min={0}
        step={50}
        precision={2}
        decimalSeparator=","
        className="w-full!"
        placeholder="0,00"
    />
);

const Inteiro = (props) => <InputNumber {...props} min={0} precision={0} className="w-full!" placeholder="0" />;

/**
 * Formulário de imóvel usado tanto para criar quanto para editar.
 * - modo "criar": pede a imagem (obrigatória na API)
 * - modo "editar": mostra a imagem atual (a API não troca imagem na edição)
 */
const ImovelForm = ({ form, modo, onFinish, loading, tipos, locatarios, imagemAtual }) => {
    const [buscandoCEP, setBuscandoCEP] = useState(false);

    async function buscarCEP(valor) {
        const cep = (valor || "").replace(/\D/g, "");
        if (cep.length !== 8) return;
        try {
            setBuscandoCEP(true);
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = await res.json();
            if (dados.erro) return;
            form.setFieldsValue({
                logradouro: dados.logradouro?.slice(0, 50) || form.getFieldValue("logradouro"),
                bairro: dados.bairro?.slice(0, 50) || form.getFieldValue("bairro"),
                cidade: dados.localidade?.slice(0, 50) || form.getFieldValue("cidade"),
                estado: dados.uf || form.getFieldValue("estado"),
            });
        } catch {
            // sem internet ou ViaCEP fora do ar: o usuário preenche manualmente
        } finally {
            setBuscandoCEP(false);
        }
    }

    return (
        <Form name={`imovel-${modo}`} layout="vertical" onFinish={onFinish} form={form} initialValues={{ garagens: 0, suites: 0 }}>
            <Form.Item name="id" hidden>
                <Input />
            </Form.Item>

            <Secao>Endereço</Secao>
            <Row gutter={12}>
                <Col xs={24} sm={10}>
                    <Form.Item label={<Rotulo>CEP</Rotulo>} name="cep" rules={obrigatorio} normalize={formatarCEP}>
                        <Input.Search
                            placeholder="00000-000"
                            loading={buscandoCEP}
                            onSearch={buscarCEP}
                            onBlur={(e) => buscarCEP(e.target.value)}
                            enterButton={false}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={14}>
                    <Form.Item label={<Rotulo>Logradouro</Rotulo>} name="logradouro" rules={obrigatorio}>
                        <Input placeholder="Rua, avenida..." maxLength={50} />
                    </Form.Item>
                </Col>
                <Col xs={12} sm={8}>
                    <Form.Item label={<Rotulo>Número</Rotulo>} name="numero" rules={obrigatorio}>
                        <Input placeholder="00" maxLength={15} />
                    </Form.Item>
                </Col>
                <Col xs={12} sm={16}>
                    <Form.Item label={<Rotulo>Complemento</Rotulo>} name="complemento">
                        <Input placeholder="Apto, bloco..." maxLength={15} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={10}>
                    <Form.Item label={<Rotulo>Bairro</Rotulo>} name="bairro" rules={obrigatorio}>
                        <Input placeholder="Bairro" maxLength={50} />
                    </Form.Item>
                </Col>
                <Col xs={16} sm={9}>
                    <Form.Item label={<Rotulo>Cidade</Rotulo>} name="cidade" rules={obrigatorio}>
                        <Input placeholder="Cidade" maxLength={50} />
                    </Form.Item>
                </Col>
                <Col xs={8} sm={5}>
                    <Form.Item label={<Rotulo>UF</Rotulo>} name="estado" rules={obrigatorio}>
                        <Select
                            placeholder="UF"
                            showSearch
                            options={ESTADOS.map((uf) => ({ label: uf, value: uf }))}
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Secao>Características</Secao>
            <Row gutter={12}>
                <Col xs={24} sm={12}>
                    <Form.Item label={<Rotulo>Tipo</Rotulo>} name="tipo_id" rules={obrigatorio}>
                        <Select
                            placeholder="Escolha o tipo"
                            showSearch
                            optionFilterProp="label"
                            options={(tipos || []).map((tipo) => ({ label: tipo.nome, value: tipo.id }))}
                        />
                    </Form.Item>
                </Col>
                <Col xs={12} sm={6}>
                    <Form.Item label={<Rotulo>Metragem (m²)</Rotulo>} name="metragem" rules={obrigatorio}>
                        <InputNumber min={0} step={1} decimalSeparator="," className="w-full!" placeholder="0" />
                    </Form.Item>
                </Col>
                <Col xs={12} sm={6}>
                    <Form.Item label={<Rotulo>Matrícula</Rotulo>} name="matricula">
                        <Inteiro placeholder="00000" />
                    </Form.Item>
                </Col>
                <Col xs={12} sm={6}>
                    <Form.Item label={<Rotulo>Quartos</Rotulo>} name="quartos" rules={obrigatorio}>
                        <Inteiro />
                    </Form.Item>
                </Col>
                <Col xs={12} sm={6}>
                    <Form.Item label={<Rotulo>Suítes</Rotulo>} name="suites" rules={obrigatorio}>
                        <Inteiro />
                    </Form.Item>
                </Col>
                <Col xs={12} sm={6}>
                    <Form.Item label={<Rotulo>Banheiros</Rotulo>} name="banheiros" rules={obrigatorio}>
                        <Inteiro />
                    </Form.Item>
                </Col>
                <Col xs={12} sm={6}>
                    <Form.Item label={<Rotulo>Garagens</Rotulo>} name="garagens">
                        <Inteiro />
                    </Form.Item>
                </Col>
            </Row>

            <Secao>Valores mensais</Secao>
            <Row gutter={12}>
                <Col xs={24} sm={8}>
                    <Form.Item label={<Rotulo>Aluguel</Rotulo>} name="valor_aluguel" rules={obrigatorio}>
                        <Dinheiro />
                    </Form.Item>
                </Col>
                <Col xs={12} sm={8}>
                    <Form.Item label={<Rotulo>Condomínio</Rotulo>} name="valor_condominio">
                        <Dinheiro />
                    </Form.Item>
                </Col>
                <Col xs={12} sm={8}>
                    <Form.Item label={<Rotulo>IPTU</Rotulo>} name="iptu">
                        <Dinheiro />
                    </Form.Item>
                </Col>
            </Row>

            <Secao>Locação</Secao>
            <Form.Item label={<Rotulo>Locatário</Rotulo>} name="locatario_id" extra={<span className="text-[#f1c289]/60">Deixe vazio se o imóvel está disponível.</span>}>
                <Select
                    placeholder="Disponível (sem locatário)"
                    allowClear
                    showSearch
                    optionFilterProp="label"
                    options={(locatarios || []).map((l) => ({ label: l.nome, value: l.id }))}
                />
            </Form.Item>

            <Secao>Foto</Secao>
            {modo === "criar" ? (
                <Form.Item
                    name="imagem"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                    rules={[
                        { required: true, message: "Envie uma foto do imóvel" },
                        {
                            validator: (_, lista) => {
                                const arquivo = lista?.[0]?.originFileObj;
                                if (arquivo && arquivo.size > 5 * 1024 * 1024) {
                                    return Promise.reject(new Error("A imagem deve ter no máximo 5 MB"));
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <Upload
                        listType="picture"
                        maxCount={1}
                        accept="image/jpeg,image/png,image/webp"
                        beforeUpload={() => false}
                    >
                        <Button icon={<LuUpload />}>Escolher imagem</Button>
                    </Upload>
                </Form.Item>
            ) : (
                <div className="mb-4">
                    {imagemAtual ? (
                        <Image src={APIurl + imagemAtual} width={160} className="rounded object-cover" />
                    ) : (
                        <p className="text-[#f1c289]/60 text-sm">Imóvel sem foto.</p>
                    )}
                    <p className="text-[#f1c289]/60 text-xs mt-2">A troca de foto ainda não é suportada pela API.</p>
                </div>
            )}

            <div className="flex justify-end">
                <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="w-full sm:w-auto"
                    style={{ backgroundColor: "#020202", color: "#f1c289", borderColor: "#f1c289" }}
                >
                    {modo === "criar" ? "Cadastrar imóvel" : "Salvar alterações"}
                </Button>
            </div>
        </Form>
    );
};

export default ImovelForm;
