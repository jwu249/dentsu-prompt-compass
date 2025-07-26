
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAzureAuth } from './AzureAuthContext';

const SubmissionsContext = createContext();

export const useSubmissions = () => {
  const context = useContext(SubmissionsContext);
  if (!context) {
    throw new Error('useSubmissions must be used within a SubmissionsProvider');
  }
  return context;
};

export const SubmissionsProvider = ({ children }) => {
  const { user } = useAzureAuth();
  const [submissions, setSubmissions] = useState([]);

  // Load submissions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('submissions');
    if (stored) {
      setSubmissions(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever submissions change
  useEffect(() => {
    localStorage.setItem('submissions', JSON.stringify(submissions));
  }, [submissions]);

  const submitPrompt = (promptData) => {
    const submission = {
      id: Date.now().toString(),
      type: 'prompt',
      title: promptData.name,
      content: promptData.question,
      expectedResponse: promptData.expectedResponse,
      teamDocuments: promptData.teamDocuments || '',
      submittedBy: user?.name || 'Unknown User',
      team: user?.team || 'No Team',
      submittedAt: new Date(),
      status: 'pending'
    };

    setSubmissions(prev => [...prev, submission]);
    return submission;
  };

  const submitFile = (fileData) => {
    const submission = {
      id: Date.now().toString(),
      type: fileData.type,
      title: fileData.title,
      fileName: fileData.fileName,
      fileSize: fileData.fileSize,
      description: fileData.description || '',
      submittedBy: user?.name || 'Unknown User',
      team: user?.team || 'No Team',
      submittedAt: new Date(),
      status: 'pending'
    };

    setSubmissions(prev => [...prev, submission]);
    return submission;
  };

  const updateSubmissionStatus = (submissionId, status, adminComment) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId 
        ? { ...sub, status, adminComment, reviewedAt: new Date() }
        : sub
    ));
  };

  const getUserSubmissions = () => {
    if (!user) return [];
    return submissions.filter(sub => sub.submittedBy === user.name);
  };

  const getPendingSubmissions = () => {
    return submissions.filter(sub => sub.status === 'pending');
  };

  const getAllSubmissions = () => {
    return submissions;
  };

  return (
    <SubmissionsContext.Provider value={{
      submissions,
      submitPrompt,
      submitFile,
      updateSubmissionStatus,
      getUserSubmissions,
      getPendingSubmissions,
      getAllSubmissions
    }}>
      {children}
    </SubmissionsContext.Provider>
  );
};
