import { readFileSync } from "node:fs";
import { reaisParaCentavos } from "./dinheiro.js";

interface ClienteEmReais {
  cpf: string;
  rendaLiquida: number;
  parcelasAtivas: number[];
}

export interface Cliente {
  cpf: string;
  rendaLiquidaCentavos: number;
  parcelasAtivasCentavos: number[];
}

const arquivoClientes = new URL("../clientes.json", import.meta.url);
const clientesEmReais = JSON.parse(
  readFileSync(arquivoClientes, "utf8"),
) as ClienteEmReais[];

const clientes: Cliente[] = clientesEmReais.map((cliente) => ({
  cpf: cliente.cpf,
  rendaLiquidaCentavos: reaisParaCentavos(cliente.rendaLiquida),
  parcelasAtivasCentavos: cliente.parcelasAtivas.map(reaisParaCentavos),
}));

// Recebe o CPF normalizado por normalizarCpf, somente com 11 dígitos.
export function buscarClientePorCpf(cpfNormalizado: string): Cliente | undefined {
  return clientes.find((cliente) => cliente.cpf === cpfNormalizado);
}
