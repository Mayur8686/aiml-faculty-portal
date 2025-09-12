// Project Recommender Example
document.getElementById('recommendBtn').addEventListener('click', () => {
    const skills = document.getElementById('skills').value.trim();
    const recommendations = document.getElementById('recommendations');
    recommendations.innerHTML = '';

    if(skills) {
        const projects = [
            "AI Chatbot",
            "ML Recommendation System",
            "Computer Vision Attendance",
            "NLP Question Answering",
            "Predictive Analytics Dashboard"
        ];

        projects.forEach((project, index) => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.innerText = project;
            recommendations.appendChild(li);
        });
    }
});

// Chatbot Example
document.getElementById('sendBtn').addEventListener('click', () => {
    const message = document.getElementById('userMessage').value.trim();
    const chatMessages = document.getElementById('chatMessages');

    if(message) {
        const userMsg = document.createElement('p');
        userMsg.innerHTML = `<strong>You:</strong> ${message}`;
        chatMessages.appendChild(userMsg);

        const botMsg = document.createElement('p');
        botMsg.innerHTML = `<strong>Bot:</strong> Hello! This is a placeholder response.`;
        chatMessages.appendChild(botMsg);

        document.getElementById('userMessage').value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
