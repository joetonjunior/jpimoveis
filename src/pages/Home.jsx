import { Progress, Skeleton, Tooltip } from "antd";
import { useMemo } from "react";
import { NavLink } from "react-router";
import { LuArrowRight, LuBuilding2, LuHouse, LuKeyRound, LuReceipt, LuRuler, LuUsers } from "react-icons/lu";
import { useBuscarImoveis } from "../hooks/imoveisHooks";
import { useBuscarLocatarios } from "../hooks/locatariosHooks";
import { enderecoCompleto, formatarMoeda, formatarNumero } from "../utils/formatadores";


const soma = (lista, campo) => lista.reduce((total, item) => total + (Number(item[campo]) || 0), 0);

function calcularResumo(imoveis, locatarios) {
    const alugados = imoveis.filter((i) => i.locatario_id);
    const disponiveis = imoveis.filter((i) => !i.locatario_id);

    const receitaMensal = soma(alugados, "valor_aluguel");
    const receitaPotencial = soma(imoveis, "valor_aluguel");
    const aluguelParado = soma(disponiveis, "valor_aluguel");
    const ocupacao = imoveis.length ? Math.round((alugados.length / imoveis.length) * 100) : 0;
    const areaTotal = soma(imoveis, "metragem");

    // Receita e quantidade por tipo de imóvel
    const porTipo = {};
    imoveis.forEach((imovel) => {
        const nome = imovel.imoveis_tipo?.nome || "Sem tipo";
        porTipo[nome] ??= { nome, quantidade: 0, alugados: 0, receita: 0 };
        porTipo[nome].quantidade += 1;
        if (imovel.locatario_id) {
            porTipo[nome].alugados += 1;
            porTipo[nome].receita += Number(imovel.valor_aluguel) || 0;
        }
    });

    // Imóveis por bairro
    const porBairro = {};
    imoveis.forEach((imovel) => {
        const nome = imovel.bairro || "—";
        porBairro[nome] = (porBairro[nome] || 0) + 1;
    });

    return {
        total: imoveis.length,
        alugados: alugados.length,
        disponiveis,
        receitaMensal,
        receitaPotencial,
        aluguelParado,
        ocupacao,
        ticketMedio: alugados.length ? receitaMensal / alugados.length : 0,
        condominios: soma(alugados, "valor_condominio"),
        iptu: soma(alugados, "iptu"),
        areaTotal,
        valorM2: areaTotal ? receitaPotencial / areaTotal : 0,
        locatarios: locatarios.length,
        porTipo: Object.values(porTipo).sort((a, b) => b.receita - a.receita || b.quantidade - a.quantidade),
        porBairro: Object.entries(porBairro).sort((a, b) => b[1] - a[1]).slice(0, 5),
        maioresAlugueis: [...alugados].sort((a, b) => b.valor_aluguel - a.valor_aluguel).slice(0, 5),
    };
}

const Cartao = ({ titulo, acao, children, className = "" }) => (
    <section className={`bg-white rounded-xl border border-gray-200 p-4 md:p-5 ${className}`}>
        <div className="flex items-center justify-between mb-4 gap-2">
            <h3 className="text-base font-semibold text-gray-800">{titulo}</h3>
            {acao}
        </div>
        {children}
    </section>
);

const Indicador = ({ icone, titulo, valor, detalhe }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-3 items-start">
        <div className="shrink-0 size-10 rounded-lg bg-[#020202] text-[#f1c289] flex items-center justify-center text-lg">
            {icone}
        </div>
        <div className="min-w-0">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{titulo}</p>
            <p className="text-xl md:text-2xl font-bold text-gray-900 truncate">{valor}</p>
            {detalhe && <p className="text-xs text-gray-500 mt-0.5">{detalhe}</p>}
        </div>
    </div>
);

const LinkVerTodos = ({ para }) => (
    <NavLink to={para} className="text-xs font-medium text-[#b26f1f]! hover:underline flex items-center gap-1 whitespace-nowrap">
        Ver todos <LuArrowRight />
    </NavLink>
);

const Home = () => {
    const { data: dadosImoveis, isLoading: carregandoImoveis } = useBuscarImoveis("?tipo=true&locatario=true");
    const { data: dadosLocatarios, isLoading: carregandoLocatarios } = useBuscarLocatarios();

    const usuario = JSON.parse(sessionStorage.getItem("usuario") || "{}");
    const primeiroNome = (usuario?.nome || "").split(" ")[0];
    const mesAtual = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date());

    const r = useMemo(
        () => calcularResumo(
            Array.isArray(dadosImoveis) ? dadosImoveis : [],
            Array.isArray(dadosLocatarios) ? dadosLocatarios : []
        ),
        [dadosImoveis, dadosLocatarios]
    );

    if (carregandoImoveis || carregandoLocatarios) {
        return (
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <Skeleton active paragraph={{ rows: 8 }} />
            </div>
        );
    }

    const maiorReceitaTipo = Math.max(...r.porTipo.map((t) => t.receita), 1);
    const maiorBairro = Math.max(...r.porBairro.map(([, qtd]) => qtd), 1);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-4 md:space-y-6">
            <div>
                <h2 className="text-2xl md:text-3xl font-bold">
                    {primeiroNome ? `Olá, ${primeiroNome}!` : "Resumo"}
                </h2>
                <p className="text-gray-500 first-letter:uppercase">Resumo da carteira · {mesAtual}</p>
            </div>

            {/* Destaque: receita do mês */}
            <section className="rounded-2xl bg-[#020202] text-white p-5 md:p-8 relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-[#f6e2a4] to-[#b26f1f]" />
                <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] items-center">
                    <div>
                        <p className="text-sm uppercase tracking-widest text-[#f1c289]/80">Receita de aluguéis no mês</p>
                        <p className="text-4xl md:text-5xl font-bold text-[#f1c289] mt-2 break-words">
                            {formatarMoeda(r.receitaMensal)}
                        </p>
                        <p className="text-sm text-gray-300 mt-2">
                            {r.alugados} {r.alugados === 1 ? "imóvel alugado" : "imóveis alugados"} · potencial de{" "}
                            <strong className="text-white">{formatarMoeda(r.receitaPotencial)}</strong> com a carteira cheia
                        </p>
                    </div>
                    <div className="flex items-center gap-5">
                        <Progress
                            type="circle"
                            percent={r.ocupacao}
                            size={110}
                            strokeColor={{ "0%": "#f6e2a4", "100%": "#b26f1f" }}
                            railColor="#2a2a2a"
                            format={(p) => <span className="text-white text-xl font-bold">{p}%</span>}
                        />
                        <div className="text-sm space-y-1">
                            <p className="text-[#f1c289] font-semibold">Taxa de ocupação</p>
                            <p className="text-gray-300">{r.alugados} de {r.total} ocupados</p>
                            {r.aluguelParado > 0 && (
                                <p className="text-gray-300">
                                    <span className="text-white font-semibold">{formatarMoeda(r.aluguelParado)}</span>/mês em imóveis vagos
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Indicadores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
                <Indicador icone={<LuBuilding2 />} titulo="Imóveis cadastrados" valor={r.total} detalhe={`${r.disponiveis.length} disponíveis para locação`} />
                <Indicador icone={<LuKeyRound />} titulo="Aluguel médio" valor={formatarMoeda(r.ticketMedio)} detalhe="entre os imóveis alugados" />
                <Indicador icone={<LuUsers />} titulo="Locatários" valor={r.locatarios} detalhe={`${r.alugados} com imóvel ativo`} />
                <Indicador icone={<LuReceipt />} titulo="Condomínios (alugados)" valor={formatarMoeda(r.condominios)} detalhe="soma mensal cadastrada" />
                <Indicador icone={<LuHouse />} titulo="IPTU (alugados)" valor={formatarMoeda(r.iptu)} detalhe="soma dos valores cadastrados" />
                <Indicador icone={<LuRuler />} titulo="Área total" valor={`${formatarNumero(r.areaTotal)} m²`} detalhe={`${formatarMoeda(r.valorM2)}/m² de aluguel em média`} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <Cartao titulo="Receita mensal por tipo de imóvel">
                    {r.porTipo.length === 0 ? (
                        <p className="text-sm text-gray-500">Nenhum imóvel cadastrado ainda.</p>
                    ) : (
                        <ul className="space-y-3">
                            {r.porTipo.map((tipo) => (
                                <Tooltip
                                    key={tipo.nome}
                                    title={`${tipo.nome}: ${formatarMoeda(tipo.receita)} · ${tipo.alugados}/${tipo.quantidade} alugados`}
                                >
                                    <li className="cursor-default">
                                        <div className="flex justify-between text-sm mb-1 gap-2">
                                            <span className="text-gray-700 truncate">
                                                {tipo.nome} <span className="text-gray-400">· {tipo.alugados}/{tipo.quantidade} alugados</span>
                                            </span>
                                            <span className="font-semibold text-gray-900 whitespace-nowrap">{formatarMoeda(tipo.receita)}</span>
                                        </div>
                                        <div className="h-2.5 rounded bg-gray-100">
                                            <div
                                                className="h-full rounded bg-[#b26f1f]"
                                                style={{ width: `${(tipo.receita / maiorReceitaTipo) * 100}%`, minWidth: tipo.receita ? 4 : 0 }}
                                            />
                                        </div>
                                    </li>
                                </Tooltip>
                            ))}
                        </ul>
                    )}
                </Cartao>

                <Cartao titulo="Maiores aluguéis" acao={<LinkVerTodos para="/painel/imoveis" />}>
                    {r.maioresAlugueis.length === 0 ? (
                        <p className="text-sm text-gray-500">Nenhum imóvel alugado no momento.</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {r.maioresAlugueis.map((imovel) => (
                                <li key={imovel.id} className="py-2.5 flex justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{imovel.locatarios?.nome || "Locatário"}</p>
                                        <p className="text-xs text-gray-500 truncate">{enderecoCompleto(imovel)}</p>
                                    </div>
                                    <span className="text-sm font-semibold whitespace-nowrap">{formatarMoeda(imovel.valor_aluguel)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Cartao>

                <Cartao titulo={`Imóveis disponíveis (${r.disponiveis.length})`} acao={<LinkVerTodos para="/painel/imoveis" />}>
                    {r.disponiveis.length === 0 ? (
                        <p className="text-sm text-gray-500">Carteira 100% ocupada. 🎉</p>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {r.disponiveis.slice(0, 5).map((imovel) => (
                                <li key={imovel.id} className="py-2.5 flex justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">
                                            {imovel.imoveis_tipo?.nome || "Imóvel"} · {imovel.quartos} quarto(s)
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{enderecoCompleto(imovel)}</p>
                                    </div>
                                    <span className="text-sm font-semibold whitespace-nowrap">{formatarMoeda(imovel.valor_aluguel)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </Cartao>

                <Cartao titulo="Imóveis por bairro">
                    {r.porBairro.length === 0 ? (
                        <p className="text-sm text-gray-500">Nenhum imóvel cadastrado ainda.</p>
                    ) : (
                        <ul className="space-y-3">
                            {r.porBairro.map(([bairro, quantidade]) => (
                                <li key={bairro}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-700 truncate">{bairro}</span>
                                        <span className="font-semibold text-gray-900">{quantidade}</span>
                                    </div>
                                    <div className="h-2.5 rounded bg-gray-100">
                                        <div className="h-full rounded bg-[#020202]" style={{ width: `${(quantidade / maiorBairro) * 100}%` }} />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </Cartao>
            </div>
        </div>
    );
}

export default Home;
