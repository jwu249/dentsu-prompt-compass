
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Calendar, MessageSquare, Send, Check, X, Clock, File } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useSubmissions } from '@/contexts/SubmissionsContext';
import { toast } from '@/components/ui/sonner';

const PowerPointUpload = () => {
  const { submitFile, getUserSubmissions } = useSubmissions();
  const fileInputRef = useRef(null);
  const userSubmissions = getUserSubmissions().filter(sub => sub.type === 'pptx');
  
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    file: null
  });

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || 
          file.name.endsWith('.pptx')) {
        setUploadForm(prev => ({ ...prev, file }));
        if (!uploadForm.title) {
          setUploadForm(prev => ({ ...prev, title: file.name.replace('.pptx', '') }));
        }
      } else {
        toast.error('Invalid file type', {
          description: 'Please select a PowerPoint (.pptx) file.'
        });
        e.target.value = '';
      }
    }
  };

  const handleSubmitFile = () => {
    if (!uploadForm.file) {
      toast.error('No file selected', {
        description: 'Please select a PowerPoint file to upload.'
      });
      return;
    }

    const fileData = {
      type: 'pptx',
      title: uploadForm.title,
      fileName: uploadForm.file.name,
      fileSize: uploadForm.file.size,
      description: uploadForm.description
    };

    submitFile(fileData);
    setUploadForm({ title: '', description: '', file: null });
    setIsUploadDialogOpen(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast('PowerPoint template submitted', {
      description: 'Your template has been sent to the admin for review.'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return Check;
      case 'denied': return X;
      case 'pending': return Clock;
      default: return FileText;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">PowerPoint Templates</h1>
            <p className="text-gray-600">Upload and manage PowerPoint templates</p>
          </div>
          
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Upload size={20} className="mr-2" />
                Upload Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload PowerPoint Template</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">PowerPoint File (.pptx)</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                    onChange={handleFileSelect}
                    ref={fileInputRef}
                    className="cursor-pointer"
                  />
                  {uploadForm.file && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <File size={16} className="text-blue-600" />
                        <span className="text-sm font-medium">{uploadForm.file.name}</span>
                        <span className="text-sm text-gray-500">({formatFileSize(uploadForm.file.size)})</span>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="title">Template Title</Label>
                  <Input
                    id="title"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter template title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the template and its intended use"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsUploadDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitFile}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={!uploadForm.file || !uploadForm.title}
                  >
                    <Send size={16} className="mr-2" />
                    Submit for Review
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Submissions</h2>
          {userSubmissions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No templates uploaded yet</h3>
                <p className="text-gray-600">Upload a PowerPoint template to get started.</p>
              </CardContent>
            </Card>
          ) : (
            userSubmissions.map((submission) => {
              const StatusIcon = getStatusIcon(submission.status);
              return (
                <Card key={submission.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="flex items-center space-x-2">
                          <StatusIcon size={20} className="text-red-600" />
                          <span>{submission.title}</span>
                        </CardTitle>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Submitted: {submission.submittedAt.toLocaleDateString()}</span>
                          {submission.reviewedAt && (
                            <span>Reviewed: {submission.reviewedAt.toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">File:</h4>
                        <div className="flex items-center space-x-2">
                          <File size={16} className="text-blue-600" />
                          <span className="text-gray-700">{submission.fileName}</span>
                          <span className="text-gray-500">({formatFileSize(submission.fileSize)})</span>
                        </div>
                      </div>
                      {submission.description && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">Description:</h4>
                          <p className="text-gray-700">{submission.description}</p>
                        </div>
                      )}
                      {submission.adminComment && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-1">
                            <MessageSquare size={16} className="text-blue-600" />
                            <span className="font-medium text-blue-900">Admin Comment:</span>
                          </div>
                          <p className="text-blue-800">{submission.adminComment}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PowerPointUpload;
