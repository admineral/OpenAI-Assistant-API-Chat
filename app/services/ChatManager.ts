interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

class ChatManager {
  private static instance: ChatManager | null = null;
  private messages: ChatMessage[] = [];

  private constructor() {}

  static getInstance(): ChatManager {
    if (!this.instance) {
      this.instance = new ChatManager();
    }
    return this.instance;
  }

  getMessages() {
    return this.messages;
  }

  async sendMessage(text: string, setMessages: (msgs: ChatMessage[]) => void) {
    this.messages.push({ role: 'user', content: text });
    const { sendAgentMessage } = await import('./api');
    try {
      const reply = await sendAgentMessage(text);
      this.messages.push({ role: 'assistant', content: reply });
    } catch (err) {
      this.messages.push({ role: 'assistant', content: 'Error contacting agent.' });
    }
    setMessages([...this.messages]);
  }
}

export default ChatManager;
