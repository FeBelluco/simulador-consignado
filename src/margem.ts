const PERCENTUAL_MAXIMO = 35;

export interface ResultadoMargem {
  margemTotalCentavos: number;
  totalParcelasAtivasCentavos: number;
  margemDisponivelCentavos: number;
}

// Assume entradas válidas, não negativas e expressas em centavos inteiros
export function calcularMargemDisponivel(
  rendaLiquidaCentavos: number,
  parcelasAtivasCentavos: number[],
): ResultadoMargem {
  const totalParcelasAtivasEmCentavos = parcelasAtivasCentavos.reduce(
    (total, parcela) => total + parcela,
    0,
  );

  // floor: "no máximo 35%" — nunca arredonda a margem para cima
  const margemTotalEmCentavos = Math.floor(
    (rendaLiquidaCentavos * PERCENTUAL_MAXIMO) / 100,
  );
  const margemDisponivelEmCentavos =
    margemTotalEmCentavos - totalParcelasAtivasEmCentavos;

  return {
    margemTotalCentavos: margemTotalEmCentavos,
    totalParcelasAtivasCentavos: totalParcelasAtivasEmCentavos,
    margemDisponivelCentavos: margemDisponivelEmCentavos,
  };
}

export function parcelaCabeNaMargem(
  parcelaNovaCentavos: number,
  margemDisponivelCentavos: number,
): boolean {
  return parcelaNovaCentavos <= margemDisponivelCentavos;
}
