import test from "node:test";
import assert from "node:assert/strict";
import { calcularMaiorValorPriceCentavos, calcularParcelaPriceCentavos } from "./price.js";

test("calcula a parcela Price de R$ 6.000 em 72 meses", () => {
  assert.equal(calcularParcelaPriceCentavos(600_000, 72), 14_934);
});


test("encontra o maior principal que cabe na margem", () => {
  const margemCentavos = 15_500;
  const prazoMeses = 72;
  const maiorPrincipalCentavos = calcularMaiorValorPriceCentavos(
    margemCentavos,
    prazoMeses,
  );
  assert.equal(maiorPrincipalCentavos, 622_778);
  assert.ok(
    calcularParcelaPriceCentavos(maiorPrincipalCentavos, prazoMeses) <=
      margemCentavos,
  );
  assert.ok(
    calcularParcelaPriceCentavos(maiorPrincipalCentavos + 1, prazoMeses) >
      margemCentavos,
  );
});