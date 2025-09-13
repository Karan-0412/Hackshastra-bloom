import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProgressProvider } from "./contexts/ProgressContext";
import { LessonProgressionProvider } from './contexts/LessonProgressionContext';
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AvatarPickerPage from '@/pages/AvatarPickerPage';
import { CommunityProvider } from "./contexts/CommunityContext";
import { ToastProvider } from './contexts/ToastContext';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProgressProvider>
          <LessonProgressionProvider>
            <TooltipProvider>
            <Toaster />
            <Sonner />
            <CommunityProvider>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile/avatar" element={
                    // lazy loaded page route
                    <React.Suspense fallback={<div className="p-6">Loading...</div>}>
                      <AvatarPickerPage />
                    </React.Suspense>
                  } />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </CommunityProvider>
            </TooltipProvider>
          </LessonProgressionProvider>
        </ProgressProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
