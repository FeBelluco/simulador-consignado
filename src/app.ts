import express, {
    type NextFunction,
    type Request,
    type Response,
} from "express";
import * as dinheiro from "./dinheiro.js";
import { simular } from "./simular.js";

const app = express();

app.use(express.json());

app.post("/simulacoes", (req, res) => {

    const bodyRecebido: unknown = req.body;

    if (
        typeof bodyRecebido !== "object" ||
        bodyRecebido === null ||
        Array.isArray(bodyRecebido)
    ) {
        return res.status(400).json({ erro: "CORPO_INVALIDO" });
    }

    const dados = bodyRecebido as Record<string, unknown>;

    const valorReais = dados.valor;

    if (
        typeof valorReais !== "number" ||
        !Number.isFinite(valorReais)
    ) {
        return res.status(400).json({ erro: "VALOR_INVALIDO" });
    }

    const valorCentavos = dinheiro.reaisParaCentavos(valorReais);
    const valorConvertidoDeVolta = dinheiro.centavosParaReais(valorCentavos);

    if (valorConvertidoDeVolta !== valorReais) {
        return res.status(400).json({ erro: "VALOR_INVALIDO" });
    }

    const resultado = simular({
        cpf: dados.cpf,
        valorSolicitadoCentavos: valorCentavos,
        prazoMeses: dados.prazo,
    });

    if (!resultado.sucesso) {
        const status =
            resultado.erro === "CLIENTE_NAO_ENCONTRADO" ? 404 : 400;

        return res.status(status).json({ erro: resultado.erro });
    }

    const respostaBase = {
        valorSolicitado: dinheiro.centavosParaReais(valorCentavos),
        prazoMeses: dados.prazo,
        parcela: dinheiro.centavosParaReais(resultado.parcelaCentavos),
        margemDisponivel: dinheiro.centavosParaReais(
            resultado.margemDisponivelCentavos,
        ),
    };

    if (resultado.cabe) {
        return res.status(200).json({
            ...respostaBase,
            cabe: true,
        });
    }

    return res.status(200).json({
        ...respostaBase,
        cabe: false,
        valorMaximoEmprestimo:
            resultado.valorMaximoEmprestimoCentavos === null
                ? null
                : dinheiro.centavosParaReais(
                    resultado.valorMaximoEmprestimoCentavos,
                ),
    });
});

app.use(
    (
        erro: unknown,
        _req: Request,
        res: Response,
        next: NextFunction,
    ) => {
        if (res.headersSent) {
            return next(erro);
        }

        const erroDeJsonMalformado =
            typeof erro === "object" &&
            erro !== null &&
            "type" in erro &&
            erro.type === "entity.parse.failed";

        if (erroDeJsonMalformado) {
            return res.status(400).json({ erro: "JSON_INVALIDO" });
        }

        return next(erro);
    },
);



export { app };
