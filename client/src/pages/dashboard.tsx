import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Users, Plus, Search, LogOut } from "lucide-react";
import { logout } from "@/lib/auth";
import EmployeeTable from "@/components/employee-table";
import EmployeeForm from "@/components/employee-form";
import DeleteConfirmation from "@/components/delete-confirmation";
import type { Funcionario } from "@shared/schema";

interface DashboardProps {
  user: { name: string; email: string };
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFuncao, setSelectedFuncao] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Funcionario | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Funcionario | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: funcionariosData, isLoading } = useQuery({
    queryKey: ['/api/funcionarios', { 
      search: searchQuery, 
      funcao: selectedFuncao, 
      ativo: selectedStatus,
      page: currentPage 
    }],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });
      
      if (searchQuery) params.append('search', searchQuery);
      if (selectedFuncao && selectedFuncao !== 'all') params.append('funcao', selectedFuncao);
      if (selectedStatus && selectedStatus !== 'all') params.append('ativo', selectedStatus);
      
      const response = await fetch(`/api/funcionarios?${params}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch funcionarios');
      }
      
      return response.json();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      onLogout();
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleCreateEmployee = () => {
    setEditingEmployee(null);
    setShowEmployeeForm(true);
  };

  const handleEditEmployee = (employee: Funcionario) => {
    setEditingEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleDeleteEmployee = (employee: Funcionario) => {
    setSelectedEmployee(employee);
    setShowDeleteDialog(true);
  };

  const handleFormSuccess = () => {
    setShowEmployeeForm(false);
    setEditingEmployee(null);
    queryClient.invalidateQueries({ queryKey: ['/api/funcionarios'] });
    toast({
      title: editingEmployee ? "Funcionário atualizado" : "Funcionário criado",
      description: editingEmployee 
        ? "As informações do funcionário foram atualizadas com sucesso."
        : "Novo funcionário foi adicionado ao sistema.",
    });
  };

  const handleDeleteSuccess = () => {
    setShowDeleteDialog(false);
    setSelectedEmployee(null);
    queryClient.invalidateQueries({ queryKey: ['/api/funcionarios'] });
    toast({
      title: "Funcionário excluído",
      description: "O funcionário foi removido do sistema com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Users className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Employee Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Control Panel */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Funcionários</h2>
                <p className="text-gray-600">Gerenciar registros de funcionários</p>
              </div>
              <Button onClick={handleCreateEmployee} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Novo Funcionário
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Pesquisar
                </Label>
                <div className="relative">
                  <Input
                    id="search"
                    type="text"
                    placeholder="Nome, CPF, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Função
                </Label>
                <Select value={selectedFuncao} onValueChange={setSelectedFuncao}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as funções" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as funções</SelectItem>
                    <SelectItem value="Desenvolvedor">Desenvolvedor</SelectItem>
                    <SelectItem value="Analista">Analista</SelectItem>
                    <SelectItem value="Gerente">Gerente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="true">Ativo</SelectItem>
                    <SelectItem value="false">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Table */}
        <EmployeeTable
          funcionarios={funcionariosData?.funcionarios || []}
          total={funcionariosData?.total || 0}
          currentPage={currentPage}
          totalPages={funcionariosData?.totalPages || 1}
          isLoading={isLoading}
          onPageChange={setCurrentPage}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
        />
      </main>

      {/* Modals */}
      {showEmployeeForm && (
        <EmployeeForm
          employee={editingEmployee}
          onClose={() => {
            setShowEmployeeForm(false);
            setEditingEmployee(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {showDeleteDialog && selectedEmployee && (
        <DeleteConfirmation
          employee={selectedEmployee}
          onClose={() => {
            setShowDeleteDialog(false);
            setSelectedEmployee(null);
          }}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
