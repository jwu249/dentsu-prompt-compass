
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Menu, Upload, Settings, LogOut, ToggleLeft } from 'lucide-react';
import { useAzureAuth } from '@/contexts/AzureAuthContext';
import ChatHistory from '@/components/ui/ChatHistory';

const Chat = () => {
  const { user, isAdmin, toggleAdminMode, logout } = useAzureAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState([
    { id: '1', title: 'what museums are in paris?' }
  ]);

  const suggestedPrompts = [
    "What is included in my Northwind Health Plus plan that is not in standard?",
    "What happens in a performance review?",
    "What does a Product Manager do?"
  ];

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

  const handleSelectConversation = (conversation) => {
    setMessages([]);
    setShowHistory(false);
  };

  const handleClearHistory = () => {
    setConversations([]);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 max-w-md w-full mx-4">
          <h1 className="text-2xl font-bold text-center mb-4">Access Required</h1>
          <p className="text-muted-foreground text-center mb-6">
            Please sign in with your authorized account to access the chat system.
          </p>
          <Button onClick={() => window.location.href = '/.auth/login/aad'} className="w-full">
            Sign In with Microsoft
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background">
      <ChatHistory 
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        conversations={conversations}
        onSelectConversation={handleSelectConversation}
        onClearHistory={handleClearHistory}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${showHistory ? 'ml-80' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-chat-border bg-background">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setShowHistory(!showHistory)}>
              <Menu size={20} />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Chat</h1>
              <p className="text-sm text-muted-foreground">Ask a question</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {(user?.email === 'admin@dentsu.com' || process.env.NODE_ENV === 'development') && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleAdminMode}
                className="flex items-center space-x-2"
              >
                <ToggleLeft size={16} />
                <span>{isAdmin ? 'Switch to User' : 'Switch to Admin'}</span>
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Upload size={16} />
              <span className="ml-2">Manage file uploads</span>
            </Button>
            <Button variant="ghost" size="sm">
              <Settings size={16} />
              <span className="ml-2">Developer settings</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut size={16} />
              <span className="ml-2">Logout {user?.email}</span>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          {messages.length === 0 ? (
            <>
              {/* Diamond Icons */}
              <div className="mb-8 flex space-x-2">
                <div className="w-6 h-6 bg-chat-blue transform rotate-45 rounded-sm"></div>
                <div className="w-4 h-4 bg-chat-blue transform rotate-45 rounded-sm mt-1"></div>
              </div>
              
              {/* Title */}
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Chat with your data
              </h1>
              
              {/* Subtitle */}
              <p className="text-muted-foreground mb-12">
                Ask anything or try an example
              </p>
              
              {/* Suggested Prompts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full mb-8">
                {suggestedPrompts.map((prompt, index) => (
                  <Card 
                    key={index}
                    className="p-4 cursor-pointer hover:bg-muted/50 transition-colors border-chat-border"
                    onClick={() => setInputText(prompt)}
                  >
                    <p className="text-sm text-foreground">{prompt}</p>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 w-full max-w-4xl space-y-6 overflow-auto">
              {messages.map((message) => (
                <div key={message.id} className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-chat-blue rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">
                        {message.sender === 'user' ? 'U' : 'AI'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-chat-blue rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">AI</span>
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-chat-border bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a new question (e.g. does my plan cover annual eye exams?)"
                className="flex-1 h-12 border-chat-border focus:border-chat-blue"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="h-12 px-6 bg-chat-blue hover:bg-chat-blue/90"
              >
                <Send size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
