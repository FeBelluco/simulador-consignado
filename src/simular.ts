import { buscarClientePorCpf } from "./clientes.js";
import { normalizarCpf } from "./cpf.js";
import {
  calcularMargemDisponivel,
  parcelaCabeNaMargem,
} from "./margem.js";
import {
  calcularMaiorValorPriceCentavos,
  calcularParcelaPriceCentavos,
} from "./price.js";

const VALOR_MINIMO_CENTAVOS = 50_000;
const PRAZO_MINIMO_MESES = 1;
const PRAZO_MAXIMO_MESES = 84;

export interface EntradaSimulacao {
  cpf: unknown;
  valorSolicitadoCentavos: unknown;
  prazoMeses: unknown;
}

export type ErroSimulacao =
  | "CPF_INVALIDO"
  | "CLIENTE_NAO_ENCONTRADO"
  | "VALOR_INVALIDO"
  | "PRAZO_INVALIDO";

export type ResultadoSimulacao =
  | { sucesso: false; erro: ErroSimulacao }
  | {
      sucesso: true;
      parcelaCentavos: number;
      margemDisponivelCentavos: number;
      cabe: true;
    }
  | {
      sucesso: true;
      parcelaCentavos: number;
      margemDisponivelCentavos: number;
      cabe: false;
      valorMaximoEmprestimoCentavos: number | null;
    };

// Recebe o valor solicitado em centavos; a conversão a partir de reais
// fica na borda HTTP. Não depende do Express.
export function simular(entrada: EntradaSimulacao): ResultadoSimulacao {
  const cpfNormalizado = normalizarCpf(entrada.cpf);

  if (cpfNormalizado === null) {
    return { sucesso: false, erro: "CPF_INVALIDO" };
  }

  const valorSolicitadoCentavos = entrada.valorSolicitadoCentavos;
  if (
    typeof valorSolicitadoCentavos !== "number" ||
    !Number.isSafeInteger(valorSolicitadoCentavos) ||
    valorSolicitadoCentavos < VALOR_MINIMO_CENTAVOS
  ) {
    return { sucesso: false, erro: "VALOR_INVALIDO" };
  }

  const prazoMeses = entrada.prazoMeses;
  if (
    typeof prazoMeses !== "number" ||
    !Number.isInteger(prazoMeses) ||
    prazoMeses < PRAZO_MINIMO_MESES ||
    prazoMeses > PRAZO_MAXIMO_MESES
  ) {
    return { sucesso: false, erro: "PRAZO_INVALIDO" };
  }

  const cliente = buscarClientePorCpf(cpfNormalizado);
  if (cliente === undefined) {
    return { sucesso: false, erro: "CLIENTE_NAO_ENCONTRADO" };
  }

  const { margemDisponivelCentavos } = calcularMargemDisponivel(
    cliente.rendaLiquidaCentavos,
    cliente.parcelasAtivasCentavos,
  );
  const parcelaCentavos = calcularParcelaPriceCentavos(
    valorSolicitadoCentavos,
    prazoMeses,
  );
  const cabe = parcelaCabeNaMargem(
    parcelaCentavos,
    margemDisponivelCentavos,
  );

  if (cabe) {
    return {
      sucesso: true,
      parcelaCentavos,
      margemDisponivelCentavos,
      cabe: true,
    };
  }

  const valorMaximoCalculadoCentavos = calcularMaiorValorPriceCentavos(
    margemDisponivelCentavos,
    prazoMeses,
  );

  return {
    sucesso: true,
    parcelaCentavos,
    margemDisponivelCentavos,
    cabe: false,
    valorMaximoEmprestimoCentavos:
      valorMaximoCalculadoCentavos >= VALOR_MINIMO_CENTAVOS
        ? valorMaximoCalculadoCentavos
        : null,
  };
}
