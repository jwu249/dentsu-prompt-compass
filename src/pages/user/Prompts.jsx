import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, FileText, Calendar, MessageSquare } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';

const Prompts = () => {
  const [prompts, setPrompts] = useState([
    {
      id: '1',
      name: 'Marketing Campaign Analysis',
      question: 'Analyze the effectiveness of our Q3 marketing campaign',
      expectedResponse: 'Detailed analysis with metrics and recommendations',
      status: 'approved',
      lastEdited: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Brand Voice Guidelines',
      question: 'What are our brand voice guidelines for social media?',
      expectedResponse: 'Comprehensive brand voice documentation',
      status: 'pending',
      lastEdited: new Date('2024-01-10')
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState({
    name: '',
    question: '',
    expectedResponse: ''
  });

  const handleCreatePrompt = () => {
    const prompt = {
      id: Date.now().toString(),
      name: newPrompt.name,
      question: newPrompt.question,
      expectedResponse: newPrompt.expectedResponse,
      status: 'pending',
      lastEdited: new Date()
    };

    setPrompts(prev => [...prev, prompt]);
    setNewPrompt({ name: '', question: '', expectedResponse: '' });
    setIsCreateDialogOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Prompts & Templates</h1>
            <p className="text-gray-600">Manage your AI prompts and templates</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus size={20} className="mr-2" />
                Create New Prompt
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Prompt</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Prompt Name</Label>
                  <Input
                    id="name"
                    value={newPrompt.name}
                    onChange={(e) => setNewPrompt(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter prompt name"
                  />
                </div>
                <div>
                  <Label htmlFor="question">Prompt/Question</Label>
                  <Textarea
                    id="question"
                    value={newPrompt.question}
                    onChange={(e) => setNewPrompt(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="Enter your prompt or question"
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="response">Expected Response</Label>
                  <Textarea
                    id="response"
                    value={newPrompt.expectedResponse}
                    onChange={(e) => setNewPrompt(prev => ({ ...prev, expectedResponse: e.target.value }))}
                    placeholder="Describe the expected response format"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreatePrompt}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={!newPrompt.name || !newPrompt.question}
                  >
                    Save Prompt
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {prompts.map((prompt) => (
            <Card key={prompt.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center space-x-2">
                      <FileText size={20} className="text-red-600" />
                      <span>{prompt.name}</span>
                    </CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>Last edited: {prompt.lastEdited.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(prompt.status)}>
                    {prompt.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Question:</h4>
                    <p className="text-gray-700">{prompt.question}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Expected Response:</h4>
                    <p className="text-gray-700">{prompt.expectedResponse}</p>
                  </div>
                  {prompt.adminComment && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <MessageSquare size={16} className="text-blue-600" />
                        <span className="font-medium text-blue-900">Admin Comment:</span>
                      </div>
                      <p className="text-blue-800">{prompt.adminComment}</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Prompts;
