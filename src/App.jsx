
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AzureAuthProvider } from '@/contexts/AzureAuthContext';
import { TeamProvider } from '@/contexts/TeamContext';
import { SubmissionsProvider } from '@/contexts/SubmissionsContext';
import { ThemeProvider } from '@/hooks/use-theme';

// Pages
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
          <AzureAuthProvider>
            <TeamProvider>
              <SubmissionsProvider>
                <BrowserRouter>
                  <Routes>
                    {/* Main Routes - All handled by Chat component */}
                    <Route path="/" element={<Chat />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/chat/prompts" element={<Prompts />} />
                    <Route path="/chat/pptx" element={<PowerPointUpload />} />
                    <Route path="/chat/csv" element={<CsvUpload />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/submissions" element={<AdminSubmissions />} />
                    <Route path="/admin/teams" element={<TeamManagement />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    
                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </BrowserRouter>
              </SubmissionsProvider>
            </TeamProvider>
          </AzureAuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
