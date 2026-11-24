export const formatarMoeda = (valor) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(valor) || 0);

export const formatarNumero = (valor, casas = 0) =>
    new Intl.NumberFormat("pt-BR", { maximumFractionDigits: casas }).format(Number(valor) || 0);

export const formatarCEP = (valor) => {
    if (!valor) return "";
    const digitos = String(valor).replace(/\D/g, "").slice(0, 8);
    return digitos.length > 5 ? `${digitos.slice(0, 5)}-${digitos.slice(5)}` : digitos;
};

export const enderecoCompleto = (imovel) => {
    if (!imovel) return "";
    const complemento = imovel.complemento ? ` ${imovel.complemento}` : "";
    return `${imovel.logradouro}, ${imovel.numero}${complemento} - ${imovel.bairro}, ${imovel.cidade}/${imovel.estado}`;
};

// Mostra a resposta da API (que pode vir como objeto ou como lista de avisos) numa notificação do antd
export const notificar = (notification, resposta) => {
    const lista = Array.isArray(resposta) ? resposta : [resposta];
    lista.forEach((item) => {
        const tipo = ["success", "error", "warning", "info"].includes(item?.type) ? item.type : "info";
        notification[tipo]({
            description: item?.description || "Operação concluída.",
            placement: "bottomRight",
        });
    });
};

export const notificarErro = (notification, erro) => {
    const dados = erro?.response?.data;
    if (dados?.type) return notificar(notification, dados);
    notification.error({
        description: "Não foi possível falar com o servidor. Tente novamente.",
        placement: "bottomRight",
    });
};
