import { useMutation, useQuery } from "@tanstack/react-query"
import { AXIOS, QUERYCLIENT } from "../services"

// Campos numéricos opcionais que a API atual não converte quando chegam via multipart (form-data).
// Eles são gravados logo depois da criação, com um PUT em JSON.
const NUMERICOS_OPCIONAIS = ["matricula", "iptu", "valor_condominio"];

export const useBuscarImoveis = (query = false) => {
    return useQuery({
        // a query faz parte da chave para não misturar o cache de buscas diferentes
        queryKey: ["imoveis", query || ""],
        queryFn: async () => {
            const res = await AXIOS.get(query ? `/imoveis${query}` : "/imoveis");
            return res.data
        }
    });
}

// Recebe { campos, arquivo }: campos do formulário + arquivo da imagem (File)
export const useCriarImoveis = () => {
    return useMutation({
        mutationFn: async ({ campos, arquivo }) => {
            const formData = new FormData();
            const extras = {};

            Object.entries(campos).forEach(([chave, valor]) => {
                if (valor === undefined || valor === null || valor === "") return;
                if (NUMERICOS_OPCIONAIS.includes(chave)) {
                    extras[chave] = Number(valor);
                    return;
                }
                formData.append(chave, valor);
            });

            if (arquivo) formData.append("imagem", arquivo);

            const res = await AXIOS.post("/imoveis", formData);

            // A rota de criação não devolve o id; pegamos o imóvel mais recente para completar os extras.
            if (res.data?.type === "success" && Object.keys(extras).length > 0) {
                const { data: lista } = await AXIOS.get("/imoveis");
                const novo = [...(lista || [])].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                )[0];
                if (novo) await AXIOS.put(`/imoveis/${novo.id}`, extras);
            }

            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["imoveis"]
            })
        }
    })
}


export const useEditarImoveis = () => {
    return useMutation({
        mutationFn: async ({ id, ...dados }) => {
            const res = await AXIOS.put(`/imoveis/${id}`, dados);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["imoveis"]
            })
        }
    })
}

export const useDeletarImoveis = () => {
    return useMutation({
        mutationFn: async (id) => {
            const res = await AXIOS.delete(`/imoveis/${id}`);
            return res.data;
        },
        onSuccess: () => {
            QUERYCLIENT.invalidateQueries({
                queryKey: ["imoveis"]
            })
        }
    })
}
