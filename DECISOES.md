# Decisões

- **Dinheiro:** os valores da API estão em reais; internamente, os cálculos usam centavos inteiros.
- **Margem:** calculo 35% da renda líquida e arredondo esse limite para baixo em centavos, para não ultrapassar o máximo. A margem disponível pode ser negativa. Uma parcela igual à margem disponível cabe.
- **Parcela Price:** uso a taxa mensal fixa de 1,8% e arredondo a parcela para o centavo mais próximo antes de compará-la com a margem.
- **Valor máximo:** interpreto “maior valor que caberia nesse prazo” como o principal máximo do empréstimo no prazo solicitado, não como a parcela máxima. A parcela máxima é representada pela margem disponível. O limite é encontrado por busca em centavos, usando o mesmo arredondamento da parcela Price.
- **Mínimo do empréstimo:** se o principal máximo calculado for inferior a R$ 500, retorno `null` em `valorMaximoEmprestimo`, pois não existe uma proposta válida que caiba nas regras do desafio.
- **Resposta da API:** incluo `valorSolicitado` e `prazoMeses` para deixar explícito a qual pedido a parcela se refere. Os valores monetários são números em reais.
- **CPF:** valido o formato, com ou sem pontuação, e normalizo para 11 dígitos. Não valido dígitos verificadores nem sequências repetidas, para aceitar os CPFs de exemplo do desafio. Um CPF bem formatado que não esteja na lista retorna 404.
- **Entradas inválidas:** corpo JSON malformado retorna 400 com `JSON_INVALIDO`; corpo, CPF, valor ou prazo inválido retorna 400. O prazo aceito é um inteiro de 1 a 84 meses e o valor solicitado deve ser de pelo menos R$ 500, com no máximo duas casas decimais.
- **Escopo:** os clientes vêm de um JSON fixo. Banco de dados, autenticação, interface e integração com bancos ficaram de fora porque não são necessários para o teste.
- **Testes:** há testes automatizados para CPF, margem e Price. A rota foi conferida manualmente em casos em que a parcela cabe e não cabe; não foi criado teste automatizado de integração HTTP.
