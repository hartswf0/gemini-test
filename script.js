// Load environment variables
dotenv.config();

const chatContainer = document.getElementById('chat-container');
let messages = [];

function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = text;

    messageDiv.appendChild(messageContent);
    chatContainer.appendChild(messageDiv);

    messages.push({ text, type });
}

async function sendMessage(messageText) {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    const url = 'https://gemini-api.google.com/v1/chat/completions';

    const payload = {
        model: 'gemini',
        messages: [{ role: 'user', content: messageText }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, I couldn\'t understand that.';
    }
}

function handleUserInput() {
    const userInput = document.getElementById('user-input').value.trim();
    
    if (!userInput) return;

    addMessage(userInput, 'user');

    sendMessage(userInput).then(aiResponse => {
        addMessage(aiResponse, 'ai');
        document.getElementById('user-input').value = '';
    });
}

document.getElementById('send-button').addEventListener('click', handleUserInput);
document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});
