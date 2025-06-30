import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AuthPage from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import { getCurrentUser } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";

function AppContent() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    getCurrentUser()
      .then((currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        // User not authenticated
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleLogin = () => {
    // Refresh user data after login
    getCurrentUser().then((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    });
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
