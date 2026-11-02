# Simulador de crédito consignado

API pequena para simular empréstimos consignados. A regra de margem e os cálculos da Tabela Price ficam separados da rota Express.

## Requisitos

- Node.js 20 ou superior
- npm

## Instalar e executar

Na raiz do projeto:

```powershell
npm install
npm test
npm start
```

O `npm test` compila o TypeScript e executa os testes automatizados sobre o JavaScript gerado em `dist/`. O servidor inicia em `http://localhost:3000`.

## Endpoint

`POST /simulacoes`

Exemplo de corpo:

```json
{
  "cpf": "111.111.111-11",
  "valor": 7000,
  "prazo": 72
}
```

Exemplo de resposta quando a parcela não cabe:

```json
{
  "valorSolicitado": 7000,
  "prazoMeses": 72,
  "parcela": 174.22,
  "margemDisponivel": 155,
  "cabe": false,
  "valorMaximoEmprestimo": 6227.78
}
```

Os valores monetários da API estão em reais. `parcela` corresponde ao valor solicitado. Quando não cabe, `valorMaximoEmprestimo` é o principal máximo que cabe no mesmo prazo; será `null` quando nenhum empréstimo de pelo menos R$ 500 couber.

Para testar manualmente no PowerShell, com o servidor rodando:

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/simulacoes" -Method Post -ContentType "application/json" -Body '{"cpf":"111.111.111-11","valor":7000,"prazo":72}'
```

## Testes

Os testes automatizados cobrem a normalização de CPF, o cálculo de margem e os cálculos Price. A rota também foi conferida manualmente em cenários em que a parcela cabe e não cabe.

## Dados de exemplo

Os três clientes do desafio ficam em `clientes.json`. A aplicação carrega esses dados em memória; não usa banco de dados.
