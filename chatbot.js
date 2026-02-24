class HotelChatbot {
    constructor() {
        this.responses = {
            greeting: ["Hello! Welcome to Sierra Springs Hotels. How can I help you today?"],
            booking: ["You can book rooms by calling +1-555-0123 or visiting our front desk. What dates are you looking for?"],
            rooms: ["We offer Standard, Deluxe, and Suite rooms. All include free WiFi, breakfast, and mountain views."],
            amenities: ["Our amenities include: Pool, Spa, Restaurant, Gym, Free WiFi, Parking, and 24/7 Room Service."],
            location: ["We're located in the beautiful Sierra Mountains with easy highway access and stunning nature views."],
            prices: ["Room rates start at $120/night for Standard rooms. Contact us for current availability and pricing."],
            checkin: ["Check-in: 3:00 PM, Check-out: 11:00 AM. Early check-in available upon request."],
            contact: ["Phone: +1-555-0123 | Email: info@sierrasprings.com | Address: 123 Mountain View Dr"],
            default: ["I can help with bookings, room info, amenities, location, and contact details. What would you like to know?"]
        };
        this.init();
    }

    init() {
        this.createChatWidget();
        this.bindEvents();
    }

    createChatWidget() {
        const chatHTML = `
            <div id="chatbot-widget" class="chatbot-closed">
                <div id="chat-toggle" class="chat-toggle">
                    <i class="fas fa-comments"></i>
                </div>
                <div id="chat-window" class="chat-window">
                    <div class="chat-header">
                        <span>Sierra Springs Support</span>
                        <button id="chat-close">&times;</button>
                    </div>
                    <div id="chat-messages" class="chat-messages"></div>
                    <div class="chat-input-container">
                        <input type="text" id="chat-input" placeholder="Type your message...">
                        <button id="chat-send"><i class="fas fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    bindEvents() {
        document.getElementById('chat-toggle').onclick = () => this.toggleChat();
        document.getElementById('chat-close').onclick = () => this.closeChat();
        document.getElementById('chat-send').onclick = () => this.sendMessage();
        document.getElementById('chat-input').onkeypress = (e) => {
            if (e.key === 'Enter') this.sendMessage();
        };
    }

    toggleChat() {
        const widget = document.getElementById('chatbot-widget');
        widget.classList.toggle('chatbot-open');
        widget.classList.toggle('chatbot-closed');
        if (widget.classList.contains('chatbot-open')) {
            this.addMessage('bot', this.responses.greeting[0]);
        }
    }

    closeChat() {
        const widget = document.getElementById('chatbot-widget');
        widget.classList.add('chatbot-closed');
        widget.classList.remove('chatbot-open');
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (!message) return;

        this.addMessage('user', message);
        input.value = '';
        
        setTimeout(() => this.botResponse(message), 500);
    }

    addMessage(sender, text) {
        const messages = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        messages.appendChild(messageDiv);
        messages.scrollTop = messages.scrollHeight;
    }

    botResponse(userMessage) {
        const msg = userMessage.toLowerCase();
        let response = this.responses.default[0];

        if (msg.includes('hello') || msg.includes('hi')) response = this.responses.greeting[0];
        else if (msg.includes('book') || msg.includes('reservation')) response = this.responses.booking[0];
        else if (msg.includes('room') || msg.includes('suite')) response = this.responses.rooms[0];
        else if (msg.includes('amenities') || msg.includes('facilities')) response = this.responses.amenities[0];
        else if (msg.includes('location') || msg.includes('address')) response = this.responses.location[0];
        else if (msg.includes('price') || msg.includes('cost') || msg.includes('rate')) response = this.responses.prices[0];
        else if (msg.includes('check') || msg.includes('time')) response = this.responses.checkin[0];
        else if (msg.includes('contact') || msg.includes('phone')) response = this.responses.contact[0];

        this.addMessage('bot', response);
    }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => new HotelChatbot());
