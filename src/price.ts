const TAXA_MENSAL = 0.018;

// Recebe principal em centavos e prazo em meses.
// Assume que os valores já foram validados por quem chama.
export function calcularParcelaPriceCentavos(
  principalCentavos: number,
  prazoMeses: number,
): number {
  const parcelaNaoArredondadaCentavos =
    (principalCentavos * TAXA_MENSAL) /
    (1 - (1 + TAXA_MENSAL) ** -prazoMeses);

  return Math.round(parcelaNaoArredondadaCentavos);
}