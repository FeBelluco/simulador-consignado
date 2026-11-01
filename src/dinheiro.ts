export function reaisParaCentavos(valorEmReais: number): number {
  return Math.round(valorEmReais * 100);
}

export function centavosParaReais(valorEmCentavos: number): number {
  return valorEmCentavos / 100;
}