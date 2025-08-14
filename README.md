# 🤖 Bot de Atendimento para WhatsApp

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=nodedotjs)
![WhatsApp Web JS](https://img.shields.io/badge/whatsapp--web.js-1.23.0-25D366?style=for-the-badge&logo=whatsapp)

> Um bot de atendimento automatizado para WhatsApp construído com Node.js e a biblioteca `whatsapp-web.js`. Ele utiliza um sistema de menu interativo e uma máquina de estados para gerenciar o fluxo da conversa com os usuários.

Este projeto foi desenvolvido para fornecer um primeiro nível de atendimento ao cliente, respondendo a solicitações comuns e encaminhando para atendentes humanos quando necessário.

---

## ✨ Funcionalidades Principais

-   **Menu Interativo**: Apresenta um menu de opções para guiar o usuário.
-   **Fluxo de Conversa Ramificado**: A conversa se desenrola de acordo com as escolhas do usuário.
-   **Gerenciamento de Estado (Checkpoints)**: Salva o progresso da conversa de cada usuário, permitindo que retomem o atendimento de onde pararam, mesmo que o bot seja reiniciado.
-   **Persistência de Sessão**: Salva a sessão de autenticação, evitando a necessidade de escanear o QR Code a cada inicialização.
-   **Seguro para Grupos**: O bot foi programado para ignorar todas as mensagens enviadas em grupos, respondendo apenas a chats privados.
-   **Opções de Atendimento Implementadas**:
    -   Consulta de saldo (simulado)
    -   Desbloqueio de cartão (simulado)
    -   Renovação de limite (simulado)
    -   Recuperação de senha por CPF (simulado)
    -   Encaminhamento para os setores Financeiro e Suporte.

---

## 🛠️ Tecnologias Utilizadas

-   [Node.js](https://nodejs.org/): Ambiente de execução JavaScript.
-   [whatsapp-web.js](https://wwebjs.dev/): Biblioteca para automatizar o WhatsApp Web.
-   [qrcode-terminal](https://www.npmjs.com/package/qrcode-terminal): Para exibir o QR Code de autenticação diretamente no terminal.

---

## 🚀 Começando

Siga as instruções abaixo para configurar e rodar o projeto em sua máquina local.

### Pré-requisitos

Você precisa ter o Node.js instalado em sua máquina.
-   **Node.js** (versão 18.x ou superior recomendada)

Você pode verificar se o Node.js está instalado com o comando:
```sh
node -v
```

### Instalação

1.  Clone o repositório para sua máquina local:
    ```sh
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    ```
2.  Navegue até o diretório do projeto:
    ```sh
    cd seu-repositorio
    ```
3.  Instale todas as dependências necessárias:
    ```sh
    npm install
    ```

### Execução

1.  Inicie o bot com o seguinte comando:
    ```sh
    node index.js
    ```
2.  Na primeira vez que você executar, um **QR Code** será exibido no seu terminal.
3.  Abra o WhatsApp no seu celular, vá para **Configurações > Aparelhos conectados > Conectar um aparelho** e escaneie o QR Code.
4.  Aguarde a mensagem "Client is ready!" no terminal. Pronto! Seu bot está online e pronto para receber mensagens.

---

## 📁 Estrutura do Projeto

```
.
├── saves/
│   ├── db.json         # Arquivo que armazena o estado (checkpoint) das conversas
│   └── session/        # Pasta que armazena os dados da sessão do WhatsApp
├── node_modules/       # Dependências do projeto
├── .gitignore          # Arquivos e pastas ignorados pelo Git
├── index.js            # Arquivo principal com toda a lógica do bot
├── package-lock.json   # Mapeamento exato das dependências
└── package.json        # Informações do projeto e dependências
```

### Como Funciona

O bot opera com base em uma **Máquina de Estados**. O estado atual de cada conversa de usuário é salvo no arquivo `saves/db.json`.

1.  Quando um usuário envia uma mensagem pela primeira vez, o bot cria um estado inicial (`aguardando_menu`) para ele.
2.  A cada resposta do usuário, o bot verifica o estado atual para saber qual tipo de informação esperar.
3.  Com base na resposta, o bot executa uma ação (enviar outra pergunta, fornecer uma informação) e atualiza o estado do usuário para o próximo passo da conversa.
4.  Toda alteração de estado é salva no `db.json`, garantindo que o progresso não seja perdido.

---

## 📈 Melhorias Futuras

-   [ ] Integrar com APIs reais para consultas de saldo, desbloqueio de cartão, etc.
-   [ ] Migrar o armazenamento de estado de `db.json` para um banco de dados mais robusto (como SQLite ou um banco NoSQL).
-   [ ] Adicionar validação de dados de entrada (ex: verificar se um CPF é válido).
-   [ ] Refatorar o código, separando a lógica em módulos para melhor organização.
