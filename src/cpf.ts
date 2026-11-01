const CPF_SEM_FORMATACAO = /^\d{11}$/;
const CPF_FORMATADO = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

/**
 * Aceita CPF com 11 dígitos ou no formato 000.000.000-00.
 * Retorna os 11 dígitos sem pontuação; retorna null se o formato for inválido.
 * Não verifica dígitos verificadores nem sequências repetidas.
 */
export function normalizarCpf(valor: unknown): string | null {
  if (typeof valor !== "string") {
    return null;
  }

  if (CPF_SEM_FORMATACAO.test(valor)) {
    return valor;
  }

  if (CPF_FORMATADO.test(valor)) {
    return valor.replace(/[.-]/g, "");
  }

  return null;
}
