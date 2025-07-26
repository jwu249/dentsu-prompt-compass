import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, X } from 'lucide-react';

const ChatHistory = ({ isOpen, onClose, conversations, onSelectConversation, onClearHistory }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed left-0 top-0 w-80 h-full bg-background border-r border-chat-border z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-chat-border">
        <h2 className="text-lg font-semibold text-foreground">Chat history</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground mb-3">Yesterday</div>
          {conversations.map((conversation) => (
            <Card 
              key={conversation.id}
              className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onSelectConversation(conversation)}
            >
              <p className="text-sm text-foreground truncate">
                {conversation.title}
              </p>
            </Card>
          ))}
        </div>
        
        <div className="mt-6">
          <div className="text-sm font-medium text-muted-foreground mb-3">Last 7 days</div>
          <div className="space-y-2">
            <Card className="p-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <p className="text-sm text-foreground">What is included in my Northwind Health Plus plan</p>
            </Card>
            <Card className="p-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <p className="text-sm text-foreground">what's the whistleblower policy?</p>
            </Card>
            <Card className="p-3 cursor-pointer hover:bg-muted/50 transition-colors">
              <p className="text-sm text-foreground">What does a Product Manager do?</p>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t border-chat-border">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClearHistory}
          className="w-full justify-start"
        >
          <Trash2 size={14} className="mr-2" />
          Clear chat
        </Button>
      </div>
    </div>
  );
};

export default ChatHistory;