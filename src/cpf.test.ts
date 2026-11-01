import test from "node:test";
import assert from "node:assert/strict";
import { normalizarCpf } from "./cpf.js";

test("aceita CPF com 11 dígitos", () => {
  assert.equal(normalizarCpf("11111111111"), "11111111111");
});

test("aceita CPF formatado e remove a pontuação", () => {
  assert.equal(normalizarCpf("111.111.111-11"), "11111111111");
});

test("recusa tipos e formatos inválidos", () => {
  const entradasInvalidas: unknown[] = [
    "111.111.111-1A",
    "1111111111A",
    "111.111111-11",
    " 111.111.111-11",
    "111111111",
    11111111111,
  ];

  for (const entrada of entradasInvalidas) {
    assert.equal(normalizarCpf(entrada), null);
  }
});
