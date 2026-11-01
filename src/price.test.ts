import test from "node:test";
import assert from "node:assert/strict";
import { calcularParcelaPriceCentavos } from "./price.js";

test("calcula a parcela Price de R$ 6.000 em 72 meses", () => {
  assert.equal(calcularParcelaPriceCentavos(600_000, 72), 14_934);
});
