
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: 'I understand your request. This is a simulated response from the AI assistant. In a real implementation, this would connect to your AI service.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col max-w-4xl mx-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <h1 className="text-2xl font-bold text-gray-900">AI Chat Assistant</h1>
          <p className="text-gray-600">Ask questions, get insights, and collaborate with AI</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-2xl ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} space-x-3`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'user' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <Card className={`p-4 ${message.sender === 'user' ? 'bg-red-50 border-red-200 ml-3' : 'bg-white mr-3'}`}>
                  <p className="text-gray-900">{message.text}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </Card>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-gray-600" />
                </div>
                <Card className="p-4 bg-white">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="flex space-x-4">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-1 h-12"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="h-12 px-6 bg-red-600 hover:bg-red-700"
            >
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
