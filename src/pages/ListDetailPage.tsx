import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api.client';
import { authService } from '../services/auth.service';
import { Header } from '../components/Header';
import { NewItemModal } from '../components/NewItemModal';
import { ItemRow } from '../components/ItemRow';
import { EditItemModal } from '../components/EditItemModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Toast } from '../components/Toast';
import { Loader } from '../components/Loader';
import { Pagination } from '../components/Pagination';
import type { Item, CreateItemRequest, UpdateItemRequest } from '../types/api';

const ITEMS_PER_PAGE = 20;

export function ListDetailPage() {
  const { listId } = useParams<{ listId: string }>();
  const navigate = useNavigate();

  const [listName, setListName] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showNewItemModal, setShowNewItemModal] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    if (listId) {
      loadList();
    }
  }, [listId, currentPage]);

  const loadList = async () => {
    if (!listId) return;

    try {
      setLoading(true);
      const list = await apiClient.getList(listId);
      setListName(list.name);
      setItems(list.items || []);
      setTotalItems(list.items?.length || 0);
    } catch (error) {
      if (error instanceof Error && error.message.includes('introuvable')) {
        setToast({ message: 'Liste introuvable', type: 'error' });
        setTimeout(() => navigate('/lists'), 2000);
      } else {
        setToast({
          message:
            error instanceof Error ? error.message : 'Erreur de chargement',
          type: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (data: CreateItemRequest) => {
    if (!listId) return;

    try {
      const newItem = await apiClient.createItem(listId, data);
      setItems([newItem, ...items]);
      setTotalItems(totalItems + 1);
      setShowNewItemModal(false);
      setToast({ message: 'Article ajouté', type: 'success' });
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'Erreur d\'ajout',
        type: 'error',
      });
    }
  };

  const handleTogglePurchased = async (itemId: string, purchased: boolean) => {
    if (!listId) return;

    try {
      await apiClient.updateItem(listId, itemId, { purchased });
      setItems(
        items.map((item) =>
          item._id === itemId ? { ...item, purchased } : item
        )
      );
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : 'Erreur de modification',
        type: 'error',
      });
    }
  };

  const handleEditItem = async (itemId: string, data: UpdateItemRequest) => {
    if (!listId) return;

    try {
      const updatedItem = await apiClient.updateItem(listId, itemId, data);
      setItems(
        items.map((item) => (item._id === itemId ? updatedItem : item))
      );
      setEditItem(null);
      setToast({ message: 'Article modifié', type: 'success' });
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : 'Erreur de modification',
        type: 'error',
      });
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!listId) return;

    try {
      await apiClient.deleteItem(listId, itemId);
      setItems(items.filter((item) => item._id !== itemId));
      setTotalItems(totalItems - 1);
      setDeleteConfirm(null);
      setToast({ message: 'Article supprimé', type: 'success' });
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : 'Erreur de suppression',
        type: 'error',
      });
      setDeleteConfirm(null);
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="page">
      <Header onLogout={handleLogout} />

      <main className="container">
        <div className="page-header">
          <div>
            <h2>{listName}</h2>
          </div>
          <button
            onClick={() => setShowNewItemModal(true)}
            className="btn btn-primary"
          >
            + Ajouter un article
          </button>
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <p>Cette liste ne contient pas encore d'articles.</p>
            <p>Ajoutez votre premier article ci-dessus.</p>
          </div>
        ) : (
          <>
            <div className="items-list">
              {items
                .slice(
                  currentPage * ITEMS_PER_PAGE,
                  (currentPage + 1) * ITEMS_PER_PAGE
                )
                .map((item) => (
                  <ItemRow
                    key={item._id}
                    item={item}
                    onTogglePurchased={handleTogglePurchased}
                    onEdit={setEditItem}
                    onDelete={(id) => setDeleteConfirm(id)}
                  />
                ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>

      {showNewItemModal && (
        <NewItemModal
          onClose={() => setShowNewItemModal(false)}
          onSave={handleAddItem}
        />
      )}

      {editItem && (
        <EditItemModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSave={handleEditItem}
        />
      )}

      {deleteConfirm && (
        <ConfirmDialog
          title="Supprimer l'article"
          message="Voulez-vous vraiment supprimer cet article ?"
          onConfirm={() => handleDeleteItem(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
