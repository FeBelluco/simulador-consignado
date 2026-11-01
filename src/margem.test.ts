import test from "node:test";
import assert from "node:assert/strict";
import {
  calcularMargemDisponivel,
  parcelaCabeNaMargem,
} from "./margem.js";

test("calcula a margem disponível como 35% da renda menos as parcelas ativas", () => {
  const resultado = calcularMargemDisponivel(260_000, [31_000, 44_500]);

  assert.deepEqual(resultado, {
    margemTotalCentavos: 91_000,
    totalParcelasAtivasCentavos: 75_500,
    margemDisponivelCentavos: 15_500,
  });
});

test("permite uma parcela igual à margem disponível", () => {
  assert.equal(parcelaCabeNaMargem(15_500, 15_500), true);
});

test("não permite parcela quando a margem é negativa", () => {
  const resultado = calcularMargemDisponivel(151_800, [26_500, 18_000, 11_000]);

  assert.equal(resultado.margemDisponivelCentavos, -2_370);
  assert.equal(parcelaCabeNaMargem(1, resultado.margemDisponivelCentavos), false);
});

test("arredonda o limite de 35% para baixo em centavos", () => {
  const resultado = calcularMargemDisponivel(5, []);

  assert.equal(resultado.margemTotalCentavos, 1);
});

test("cliente sem contratos tem a margem total disponível", () => {
  const resultado = calcularMargemDisponivel(415_000, []);

  assert.deepEqual(resultado, {
    margemTotalCentavos: 145_250,
    totalParcelasAtivasCentavos: 0,
    margemDisponivelCentavos: 145_250,
  });
});

test("parcela um centavo acima da margem não cabe", () => {
  assert.equal(parcelaCabeNaMargem(15_501, 15_500), false);
});