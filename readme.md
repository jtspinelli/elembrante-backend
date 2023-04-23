<img src='./src/images/ElembranteLogo.png' width=330>

#### Aplicação para gerencimento de lembretes/notas.

## IT'S LIVE!

A aplicação está disponível [neste link](https://elembrante.vercel.app/).

## Backend

O Backend da aplicação basicamente consiste em um servidor [Node.js](https://nodejs.org/en) com uso do framework [Express](https://expressjs.com/pt-br/) para configuração de um endpoint root para servir o [front](https://github.com/jtspinelli/elembrante-react) (feito com React) e uma API para CRUD de Usuários e Lembretes.

## Implementações

- Criptografia de senha com [bcrypt](https://www.npmjs.com/package/bcrypt)
- Autenticação de usuário com JWT* ([jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken))
- HTTPS e cookies 'httponly'
- Banco de dados [MySQL](https://www.mysql.com/)
- ORM com [TypeORM](https://typeorm.io/)
- Arquitetura com Repositórios, Serviços e Controladores

<br>

\* os tokens possuem duração de 10 minutos.

## Rodando a aplicação localmente

A aplicação está disponível [neste link](https://elembrante.vercel.app/).

Mas se desejar rodar localmente, realize os seguintes ajustes:

### 1) Banco de dados

Configure um servidor local MySQL com um schema (database) de nome **elembrante**.

Isso é suficiente, pois o TypeORM criará automaticamente as tabelas necessárias.

### 2) Variáveis de ambiente

No diretório do projeto, crie um arquivo `.env` com 4 informações:

```
SECRET=elembrante_dev 
HOST=localhost
HOSTUSERNAME=<mysqlusername>
HOSTPASSWORD=<mysqlpassword>
```

- SECRET: adicione qualquer valor; será utilizada para gerar e posteriormente decodificar os tokens JWT
- HOST: insira 'localhost', como no exemplo acima
- HOSTUSERNAME: insira o username configurado ao instalar o MySQL (ignore no exemplo acima os sinais <>)
- HOSTPASSWORD: insira a senha configurada ao instalar o MySQL (ignore no exemplo acima os sinais <>)

### 3) Ajuste no dataSource.ts

No diretório raiz do projeto, abra o arquivo [dataSource.ts](https://github.com/jtspinelli/elembrante-backend/blob/master/src/dataSource.ts#L7) e descomente a seguinte linha:

```JS
dotenv.config();
```

### 4) Ajustes no index.ts

No diretório raiz do projeto, abra o arquivo [index.ts](https://github.com/jtspinelli/elembrante-backend/blob/master/src/index.ts) e **descomente todas as linhas comentadas**.

Por fim, comente a seguinte linha:

```JS
// app.listen(port, () => console.log("APP RUNNING ON PORT " + port));
```

### 5) Certificado SSL

Dentro do diretório `out` adicione um diretório `cert` e, dentro deste, os seguintes arquivos:

- [localhost.crt](https://drive.google.com/file/d/1veFWsZAqIo8ImnMF0Uj_a1uQO7L3lqNO/view?usp=share_link)
- [localhost.key](https://drive.google.com/file/d/1dSiFidCFtZv171C3JIZVe0TAC20KnEaH/view?usp=share_link)


### 6) Por fim

Instale as dependências utilizando o comando `npm install`.

Inicie a aplicação com o comando `npm start`.

Dirija-se a `https://localhost:8081` para encontrar a página inicial.

