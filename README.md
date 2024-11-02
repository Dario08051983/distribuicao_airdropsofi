## FAQ Detalhada - Projeto de Distribuição de Airdrops
Este documento serve como um guia passo a passo para iniciantes, cobrindo desde a configuração inicial até a conclusão bem-sucedida do projeto de distribuição de airdrops.
## Passo 1: Criação do Ambiente de Desenvolvimento
1. Crie uma pasta no seu computador para o projeto, onde todos os arquivos necessários serão organizados.
2. Instale Node.js e npm para gerenciar as dependências do projeto.
3. No terminal, navegue até a pasta do projeto e execute o comando `npm init -y` para criar um arquivo `package.json`, que armazena as informações e dependências do projeto.
## Passo 2: Configuração de Pacotes Necessários
Instale as bibliotecas essenciais usando o npm:
- `express` para criar o servidor web;
- `bcrypt` para criptografar senhas dos usuários;
- `dotenv` para gerenciar variáveis de ambiente de maneira segura.
Use o comando:
`npm install express bcrypt dotenv`
## Passo 3: Estrutura do Banco de Dados
1. Configure o MySQL ou XAMPP e crie um banco de dados com tabelas específicas para armazenar os dados dos usuários, airdrops, e informações relacionadas ao projeto.
2. Crie as tabelas `Usuarios`, `Carteiras`, e `Airdrops` com colunas para armazenar informações como ID, nome, e-mail, senha criptografada, e endereço da carteira dos usuários.
3. Use um gerenciador de banco de dados, como o phpMyAdmin, para verificar a estrutura das tabelas e certificar-se de que está tudo correto.
## Passo 4: Criação do Servidor com Express
1. No arquivo principal (`server.js`), importe as dependências configuradas.
2. Configure as rotas principais:
- Rota `/api/register` para registro de usuários.
- Rota `/api/auth/login` para login dos usuários e incremento de interações.
- Rota `/api/distribute` para a distribuição de airdrops aos usuários.
3. Adicione autenticação com Google usando o `passport` e `passport-google-oauth20`.
## Passo 5: Configuração das Variáveis de Ambiente
Para proteger dados sensíveis, como credenciais do Google, crie um arquivo `.env` na raiz do projeto e defina as variáveis:
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` para a autenticação Google;
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` para conexão com o banco de dados.
Certifique-se de que o `.env` é ignorado pelo Git adicionando-o ao `.gitignore`.
## Passo 6: Criação da Interface com HTML e Tailwind CSS
1. No arquivo `index.html`, adicione um layout responsivo e estilize-o com Tailwind CSS.
2. Crie uma seção de login e registro de usuário com formulários interativos.
3. Adicione uma seção para distribuição de airdrops para administradores.
4. Customize o visual com cores e layouts profissionais ajustados no arquivo `tailwind.css`.
## Passo 7: Resolução de Problemas Comuns
Durante o desenvolvimento, alguns erros podem surgir. Aqui estão soluções para alguns problemas comuns:
- **Erro de conexão com o banco de dados**: Verifique se o MySQL está ativo e as credenciais estão corretas.
- **Problemas com variáveis de ambiente**: Certifique-se de que o arquivo `.env` está bem configurado e carregado no início do `server.js`.
- **Autenticação Google não funciona**: Verifique as credenciais de API e o callback configurado no console do Google Developer.
Passo Final: Teste e Verificação
Após configurar tudo, inicie o servidor e teste as funcionalidades:
- Verifique o cadastro e login de usuários;
- Teste a distribuição de airdrops e autenticação via Google.
Confirme que todas as interações com o banco de dados estão funcionando corretamente e que a interface está apresentável.

