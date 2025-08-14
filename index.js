const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs'); // Módulo para interagir com arquivos

// Caminho para nosso arquivo de "checkpoints"
const DB_PATH = './saves/db.json';

// Carrega os estados dos usuários do arquivo, se existir.
let userStates = {};
try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    userStates = JSON.parse(data);
    console.log('Banco de dados de estados carregado!');
} catch (err) {
    console.log('Nenhum banco de dados de estados encontrado. Um novo será criado.');
}

// Função para salvar os estados no arquivo (nosso "checkpoint")
const saveState = () => {
    fs.writeFile(DB_PATH, JSON.stringify(userStates, null, 2), (err) => {
        if (err) {
            console.error('Erro ao salvar o estado:', err);
        }
    });
};

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: 'saves'
    })
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('message_create', async message => {
    if (message.fromMe) return; // Evitar responder a si mesmo

    if (message.from.endsWith('@g.us')) return; // Evita responder grupos

    const userId = message.from;
    const userMessage = message.body.trim().toLowerCase();
    const currentState = userStates[userId];

    console.log(`Mensagem de ${userId}: "${userMessage}". Estado atual: ${currentState?.stage}`);

    // Comando para reiniciar a conversa a qualquer momento
    if (userMessage === '!sair' || userMessage === '!reset') {
        delete userStates[userId];
        saveState();
        await client.sendMessage(userId, 'Seu atendimento foi encerrado. Envie qualquer mensagem para começar de novo.');
        return;
    }

    // Se não há estado, é o início da conversa
    if (!currentState) {
        userStates[userId] = { stage: 'aguardando_menu' };
        const menu = `Olá! 👋 Bem-vindo atendimento virtual da CredVip.

Escolha uma das opções abaixo digitando o número correspondente:

*1* - Consulta de saldo
*2* - Desbloqueio de cartão
*3* - Renovação de limite
*4* - Recuperação de senha
*5* - Financeiro
*6* - Suporte
*7* - Aplicativo

A qualquer momento, digite *!sair* para encerrar o atendimento.`;
        
        await client.sendMessage(userId, menu);
        saveState(); // Salva o novo estado
        return;
    }

    // Roteamento baseado no estágio atual do usuário
    switch (currentState.stage) {
        case 'aguardando_menu':

            if (userMessage.includes('1') || userMessage.includes('saldo')) {
                userStates[userId].stage = 'aguardando_cpf_saldo';
                await client.sendMessage(userId, 'Para consultar seu saldo, por favor, digite seu CPF (apenas números).');

            } else if (userMessage.includes('2') || userMessage.includes('desbloqueio')) {
                userStates[userId].stage = 'aguardando_cartao_desbloqueio';
                await client.sendMessage(userId, 'Para desbloquear seu cartão, por favor, digite os 4 últimos dígitos do cartão.');

            } else if (userMessage.includes('3') || userMessage.includes('limite')) {
                userStates[userId].stage = 'aguardando_cpf_limite';
                await client.sendMessage(userId, 'Entendido. Para análise de renovação de limite, por favor, informe seu CPF.');

            } else if (userMessage.includes('4') || userMessage.includes('senha')) { 
                userStates[userId].stage = 'aguardando_cpf_senha';
                await client.sendMessage(userId, 'Para recuperar sua senha, por favor, informe o seu CPF.');

            } else if (userMessage.includes('5') || userMessage.includes('financeiro')) {
                await client.sendMessage(userId, 'Você será direcionado para o setor Financeiro. Por favor, aguarde um momento que um de nossos atendentes irá falar com você.');
                delete userStates[userId]; 

            } else if (userMessage.includes('6') || userMessage.includes('suporte')) {
                await client.sendMessage(userId, 'Você será direcionado para o Suporte. Por favor, aguarde um momento que um de nossos atendentes irá falar com você.');
                delete userStates[userId];

            } else if (userMessage.includes('7') || userMessage.includes('aplicativo')) {
                userStates[userId].stage = 'detalhes_aplicativo';
                await client.sendMessage(userId, 'Certo. Por favor, descreva o problema que você está enfrentando com o aplicativo.');

            } else {
                await client.sendMessage(userId, 'Opção inválida. Por favor, escolha um número do menu ou digite uma palavra-chave (ex: "saldo", "senha").');
            }

            saveState(); // Salva a mudança de estado
            break;
    }
});

client.initialize();