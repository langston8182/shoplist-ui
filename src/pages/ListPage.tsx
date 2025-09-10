import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LogOut, ShoppingCart, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { itemsService } from '../services/items';
import { ItemForm } from '../components/ItemForm';
import { ItemRow } from '../components/ItemRow';
import type { CreateItemRequest, UpdateItemRequest } from '../types/item';

export const ListPage: React.FC = () => {
  const { userEmail, logout } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: items = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['items'],
    queryFn: itemsService.getItems,
  });

  const createMutation = useMutation({
    mutationFn: itemsService.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, item }: { itemId: string; item: UpdateItemRequest }) =>
      itemsService.updateItem(itemId, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: itemsService.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });

  const handleCreateItem = (item: CreateItemRequest) => {
    createMutation.mutate(item);
  };

  const handleUpdateItem = (itemId: string, item: UpdateItemRequest) => {
    updateMutation.mutate({ itemId, item });
  };

  const handleDeleteItem = (itemId: string) => {
    deleteMutation.mutate(itemId);
  };

  const handleLogout = () => {
    logout();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de connexion</h2>
          <p className="text-gray-600 mb-4">
            Impossible de charger la liste de courses. Vérifiez votre connexion internet.
          </p>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['items'] })}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <ShoppingCart className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Liste de courses</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Connecté en tant que {userEmail}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add item form */}
        <ItemForm onSubmit={handleCreateItem} isLoading={createMutation.isPending} />

        {/* Success/Error messages */}
        {createMutation.isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
            <p className="text-sm text-green-600">Item ajouté avec succès !</p>
          </div>
        )}
        {updateMutation.isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
            <p className="text-sm text-green-600">Item modifié avec succès !</p>
          </div>
        )}
        {deleteMutation.isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
            <p className="text-sm text-green-600">Item supprimé avec succès !</p>
          </div>
        )}

        {/* Items list */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Mes courses ({items.length} item{items.length !== 1 ? 's' : ''})
            </h2>
          </div>

          {isLoading ? (
            <div className="px-6 py-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Chargement...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun item dans votre liste de courses</p>
              <p className="text-sm text-gray-500 mt-1">Ajoutez votre premier item ci-dessus</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unité
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((item) => (
                    <ItemRow
                      key={item._id}
                      item={item}
                      onUpdate={handleUpdateItem}
                      onDelete={handleDeleteItem}
                      isUpdating={updateMutation.isPending}
                      isDeleting={deleteMutation.isPending}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};