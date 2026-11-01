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

export function calcularMaiorValorPriceCentavos(
  margemDisponivelCentavos: number,
  prazoMeses: number,
): number {
  if (margemDisponivelCentavos <= 0) {
    return 0;
  }

  let limiteQueCabeCentavos = 0;
  let limiteQueNaoCabeCentavos = 1;

    // Encontra um limite superior cuja parcela já não caiba.
  while (
    calcularParcelaPriceCentavos(limiteQueNaoCabeCentavos, prazoMeses) <=
    margemDisponivelCentavos
  ) {
    limiteQueNaoCabeCentavos *= 2;
  }

    // Busca o maior principal inteiro em centavos cuja parcela caiba.
  while (limiteQueNaoCabeCentavos - limiteQueCabeCentavos > 1) {
    const candidatoCentavos = Math.floor(
      (limiteQueCabeCentavos + limiteQueNaoCabeCentavos) / 2,
    );

    const parcelaCentavos = calcularParcelaPriceCentavos(
      candidatoCentavos,
      prazoMeses,
    );

    if (parcelaCentavos <= margemDisponivelCentavos) {
      limiteQueCabeCentavos = candidatoCentavos;
    } else {
      limiteQueNaoCabeCentavos = candidatoCentavos;
    }
  }

  return limiteQueCabeCentavos;
}