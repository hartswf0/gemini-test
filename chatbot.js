const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');

async function sendMessage() {
    const message = userInput.value;
    if (!message) return;

    displayMessage(message, 'user');
    userInput.value = '';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        displayMessage(data.response, 'bot');
    } catch (error) {
        console.error('Error:', error);
        displayMessage('Sorry, I encountered an error.', 'bot');
    }
}

function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = message;
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
