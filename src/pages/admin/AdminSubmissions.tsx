
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Upload, File, Clock, Check, X, Eye, MessageSquare } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { toast } from '@/components/ui/sonner';

interface Submission {
  id: string;
  type: 'prompt' | 'pptx' | 'csv';
  title: string;
  content?: string;
  fileName?: string;
  submittedBy: string;
  team: string;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'denied';
  adminComment?: string;
}

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: '1',
      type: 'prompt',
      title: 'Marketing Campaign Analysis',
      content: 'Analyze the effectiveness of our Q3 marketing campaign and provide insights for improvement.',
      submittedBy: 'John Doe',
      team: 'Marketing',
      submittedAt: new Date('2024-01-15'),
      status: 'pending'
    },
    {
      id: '2',
      type: 'pptx',
      title: 'Q4 Presentation Template',
      fileName: 'q4-template.pptx',
      submittedBy: 'Sarah Smith',
      team: 'Sales',
      submittedAt: new Date('2024-01-14'),
      status: 'pending'
    },
    {
      id: '3',
      type: 'csv',
      title: 'Bulk Prompts Dataset',
      fileName: 'bulk-prompts.csv',
      submittedBy: 'Mike Johnson',
      team: 'Data',
      submittedAt: new Date('2024-01-13'),
      status: 'approved',
      adminComment: 'Great dataset, approved for use.'
    }
  ]);

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const handleReview = (submission: Submission, action: 'approve' | 'deny') => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === submission.id 
        ? { 
            ...sub, 
            status: action === 'approve' ? 'approved' : 'denied',
            adminComment: reviewComment || undefined
          }
        : sub
    ));

    toast(`Submission ${action === 'approve' ? 'approved' : 'denied'} successfully`, {
      description: `${submission.title} has been ${action === 'approve' ? 'approved' : 'denied'}.`
    });

    setIsReviewDialogOpen(false);
    setSelectedSubmission(null);
    setReviewComment('');
  };

  const openReviewDialog = (submission: Submission) => {
    setSelectedSubmission(submission);
    setReviewComment(submission.adminComment || '');
    setIsReviewDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'denied': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prompt': return FileText;
      case 'pptx': return Upload;
      case 'csv': return File;
      default: return FileText;
    }
  };

  const filterSubmissions = (type?: string) => {
    if (!type) return submissions;
    return submissions.filter(sub => sub.type === type);
  };

  const SubmissionCard = ({ submission }: { submission: Submission }) => {
    const Icon = getTypeIcon(submission.type);
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Icon size={20} className="text-red-600" />
                <span>{submission.title}</span>
              </CardTitle>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                <span>By: {submission.submittedBy}</span>
                <span>Team: {submission.team}</span>
                <span>{submission.submittedAt.toLocaleDateString()}</span>
              </div>
            </div>
            <Badge className={getStatusColor(submission.status)}>
              {submission.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {submission.content && (
              <div>
                <h4 className="font-medium text-foreground mb-1">Content:</h4>
                <p className="text-muted-foreground">{submission.content}</p>
              </div>
            )}
            {submission.fileName && (
              <div>
                <h4 className="font-medium text-foreground mb-1">File:</h4>
                <p className="text-muted-foreground">{submission.fileName}</p>
              </div>
            )}
            {submission.adminComment && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <MessageSquare size={16} className="text-primary" />
                  <span className="font-medium text-primary">Admin Comment:</span>
                </div>
                <p className="text-foreground">{submission.adminComment}</p>
              </div>
            )}
          </div>
          
          {submission.status === 'pending' && (
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openReviewDialog(submission)}
              >
                <Eye size={16} className="mr-1" />
                Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Review Submissions</h1>
          <p className="text-muted-foreground">Review and manage user submissions</p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Submissions</TabsTrigger>
            <TabsTrigger value="prompt">Prompts</TabsTrigger>
            <TabsTrigger value="pptx">PowerPoint</TabsTrigger>
            <TabsTrigger value="csv">CSV Files</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {submissions.map(submission => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </TabsContent>

          <TabsContent value="prompt" className="space-y-4">
            {filterSubmissions('prompt').map(submission => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </TabsContent>

          <TabsContent value="pptx" className="space-y-4">
            {filterSubmissions('pptx').map(submission => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </TabsContent>

          <TabsContent value="csv" className="space-y-4">
            {filterSubmissions('csv').map(submission => (
              <SubmissionCard key={submission.id} submission={submission} />
            ))}
          </TabsContent>
        </Tabs>

        {/* Review Dialog */}
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Review Submission</DialogTitle>
            </DialogHeader>
            
            {selectedSubmission && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{selectedSubmission.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Submitted by {selectedSubmission.submittedBy} from {selectedSubmission.team} team
                  </p>
                </div>

                {selectedSubmission.content && (
                  <div>
                    <Label>Content:</Label>
                    <div className="p-3 bg-muted rounded-lg mt-1">
                      <p>{selectedSubmission.content}</p>
                    </div>
                  </div>
                )}

                {selectedSubmission.fileName && (
                  <div>
                    <Label>File:</Label>
                    <div className="p-3 bg-muted rounded-lg mt-1">
                      <p>{selectedSubmission.fileName}</p>
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="comment">Admin Comment (Optional)</Label>
                  <Textarea
                    id="comment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Add a comment for the user..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsReviewDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReview(selectedSubmission, 'deny')}
                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                  >
                    <X size={16} className="mr-1" />
                    Deny
                  </Button>
                  <Button
                    onClick={() => handleReview(selectedSubmission, 'approve')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check size={16} className="mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminSubmissions;
