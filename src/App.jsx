
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from '@/contexts/AuthContext';
import { TeamProvider } from '@/contexts/TeamContext';
import { SubmissionsProvider } from '@/contexts/SubmissionsContext';
import { ThemeProvider } from '@/hooks/use-theme';
import ProtectedRoute from '@/components/ui/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Chat from './pages/user/Chat';
import Prompts from './pages/user/Prompts';
import PowerPointUpload from './pages/user/PowerPointUpload';
import CsvUpload from './pages/user/CsvUpload';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSubmissions from './pages/admin/AdminSubmissions';
import TeamManagement from './pages/admin/TeamManagement';
import UserManagement from './pages/admin/UserManagement';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="dentsu-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <TeamProvider>
              <SubmissionsProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    {/* User Routes */}
                    <Route path="/chat" element={
                      <ProtectedRoute>
                        <Chat />
                      </ProtectedRoute>
                    } />
                    <Route path="/chat/prompts" element={
                      <ProtectedRoute>
                        <Prompts />
                      </ProtectedRoute>
                    } />
                    <Route path="/chat/pptx" element={
                      <ProtectedRoute>
                        <PowerPointUpload />
                      </ProtectedRoute>
                    } />
                    <Route path="/chat/csv" element={
                      <ProtectedRoute>
                        <CsvUpload />
                      </ProtectedRoute>
                    } />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/submissions" element={
                      <ProtectedRoute requireAdmin>
                        <AdminSubmissions />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/teams" element={
                      <ProtectedRoute requireAdmin>
                        <TeamManagement />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/users" element={
                      <ProtectedRoute requireAdmin>
                        <UserManagement />
                      </ProtectedRoute>
                    } />
                    
                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                  </Routes>
                </BrowserRouter>
              </SubmissionsProvider>
            </TeamProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
