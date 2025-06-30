import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginWithMicrosoft } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Users, Loader2 } from "lucide-react";

interface AuthPageProps {
  onLogin: () => void;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const { toast } = useToast();
  
  const loginMutation = useMutation({
    mutationFn: loginWithMicrosoft,
    onSuccess: () => {
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao sistema de gestão de funcionários",
      });
      onLogin();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro no login",
        description: error.message || "Falha na autenticação",
        variant: "destructive",
      });
    },
  });

  const handleLogin = () => {
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full space-y-8">
        <Card className="shadow-lg">
          <CardContent className="pt-8 pb-8 px-8">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Employee Management</h2>
              <p className="text-gray-600">Sign in with your Microsoft account</p>
            </div>
            
            <div className="mt-8">
              <Button
                onClick={handleLogin}
                disabled={loginMutation.isPending}
                className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                variant="outline"
              >
                {loginMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-3" />
                ) : (
                  <Users className="h-4 w-4 text-blue-600 mr-3" />
                )}
                {loginMutation.isPending ? "Signing in..." : "Sign in with Microsoft"}
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Secure access to employee records and management tools
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
