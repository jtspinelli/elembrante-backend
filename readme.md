<img src='./ElembranteLogo.png' width=330>

#### Aplicação para gerencimento de lembretes/notas.

## IT'S LIVE!

A aplicação está disponível [neste link](https://elembrante.vercel.app/).

## Backend

O Backend da aplicação basicamente consiste em um servidor [Node.js](https://nodejs.org/en) com uso do framework [Express](https://expressjs.com/pt-br/) para configuração de um endpoint root para servir o [front](https://github.com/jtspinelli/elembrante-react) (feito com React) e uma API para CRUD de Usuários e Lembretes.

## Implementações

- Criptografia de senha com [bcrypt](https://www.npmjs.com/package/bcrypt)
- Autenticação de usuário com JWT* ([jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken))
- HTTPS e cookies 'httponly'
- Banco de dados [PostgreSQL](https://www.postgresql.org/)
- ORM com [TypeORM](https://typeorm.io/)
- Arquitetura com Repositórios, Serviços e Controladores

<br>

\* os tokens possuem duração de 10 minutos.

<span id="runlocal"> 

## Rodando a aplicação localmente
</span>

A aplicação está disponível [neste link](https://elembrante.vercel.app/).

Mas se desejar rodar localmente, realize os seguintes ajustes*:

### 1) Banco de dados

Configure um servidor local PostgreSQL com um schema (database) de nome **elembrante**.

Isso é suficiente, pois usaremos o TypeORM para criar automaticamente as tabelas necessárias.

### 2) Variáveis de ambiente

No diretório do projeto, crie um arquivo `.env` com 3 informações:

```
SECRET=elembrante_dev 
DB_URL=<url de conexão com o database>
PORT=8081
```

- SECRET: adicione qualquer valor; será utilizada para gerar e posteriormente decodificar os tokens JWT
- DB_URL: url de conexão com o banco de dados postgreSQL
- PORT: porta para a aplicação ouvir requisições; pode ser outra

### 3) Ajuste no appEnv.ts

No diretório `src/app/env`, abra o arquivo [appEnv.ts](https://github.com/jtspinelli/elembrante-backend/blob/master/src/app/env/appEnv.ts#L3C1-L3C1) e descomente a seguinte linha:

```JS
...
dotenv.config();
...
```

### 4) Gerando as tabelas no banco de dados

O projeto já possui um script para gerar as tabelas no banco de dados.
Basta executar o comando:

```
npm run migration:r
```


### 5) Ajustes no index.ts

No diretório `src/main`, abra o arquivo [index.ts](https://github.com/jtspinelli/elembrante-backend/blob/master/src/main/index.ts) e **descomente todas as linhas comentadas**.

Por fim, comente a seguinte linha:

```JS
// app.listen(port, () => console.log("APP RUNNING ON PORT " + port));
```

### 6) Certificado SSL

Dentro do diretório `out` adicione um diretório `cert` e, dentro deste, os seguintes arquivos:

- [localhost.crt](https://drive.google.com/file/d/1veFWsZAqIo8ImnMF0Uj_a1uQO7L3lqNO/view?usp=share_link)
- [localhost.key](https://drive.google.com/file/d/1dSiFidCFtZv171C3JIZVe0TAC20KnEaH/view?usp=share_link)


### 7) Por fim

7.1 Instale as dependências utilizando o comando `npm install`.

7.2 Atualize o output do projeto com o comando `tsc`.

7.3 Inicie a aplicação com o comando `npm start`.

Dirija-se a `https://localhost:8081` para encontrar a página inicial.

<br>

#### * Certifique-se de ter [Node.js](https://nodejs.org/en) instalado em sua máquina, bem como [Typescript](https://www.npmjs.com/package/typescript) globalmente ou no diretório do projeto.

<br>

## Testando os endpoints

Baixe a [coleção](https://drive.google.com/file/d/1AFydxLs-STYykDWChfveuvSfpsuS2rYF/view?usp=share_link) de _requests_ para o Postman para testar os endpoints da API.

<br>

## Rodando Testes

A aplicação possui suítes de **testes unitários** e de **integração**.

Para executar os testes, clone o projeto e realize os passos descritos acima, na seção [Rodando a aplicação localmente](#runlocal), (com exceção do último passo, 7.3).

Caso deseje apenas rodar o testes, sem iniciar a aplicação localmente, os passos 1 e 4 podem ser ignorados.

**Testes unitários:** `npm run test:unit` ou `npm run test:unit:verbose` para output mais detalhado

**Testes integrados:** `npm run test:integration` ou `npm run test:integration:verbose` para output mais detalhado

Para **Cobertura de código:** `npm run test:coverage`.