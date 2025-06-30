import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Funcionario } from "@shared/schema";

interface DeleteConfirmationProps {
  employee: Funcionario;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteConfirmation({ employee, onClose, onSuccess }: DeleteConfirmationProps) {
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/funcionarios/${employee.id}`);
    },
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir funcionário",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    },
  });

  const handleConfirmDelete = () => {
    deleteMutation.mutate();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-900 mb-2">
              Confirmar Exclusão
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-500">
              Tem certeza que deseja excluir o funcionário{" "}
              <strong>{employee.nome}</strong>?
              Esta ação não pode ser desfeita.
            </p>
          </div>
          <div className="flex justify-center space-x-3 mt-6">
            <Button variant="outline" onClick={onClose} disabled={deleteMutation.isPending}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
