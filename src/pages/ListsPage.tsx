import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { apiClient } from '../services/api.client';
import { Header } from '../components/Header';
import { ListCard } from '../components/ListCard';
import { NewListModal } from '../components/NewListModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Toast } from '../components/Toast';
import { Loader } from '../components/Loader';
import type { List } from '../types/api';

export function ListsPage() {
  const navigate = useNavigate();
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewListModal, setShowNewListModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getLists();
      setLists(data);
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'Erreur de chargement',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (name: string) => {
    try {
      const newList = await apiClient.createList({ name });
      setLists([newList, ...lists]);
      setShowNewListModal(false);
      setToast({ message: 'Liste créée avec succès', type: 'success' });
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'Erreur de création',
        type: 'error',
      });
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      await apiClient.deleteList(listId);
      setLists(lists.filter((list) => list._id !== listId));
      setDeleteConfirm(null);
      setToast({ message: 'Liste supprimée avec succès', type: 'success' });
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'Erreur de suppression',
        type: 'error',
      });
      setDeleteConfirm(null);
    }
  };

  const handleLogout = () => {
    authService.logout();
  };

  const handleOpenList = (listId: string) => {
    navigate(`/lists/${listId}`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="page">
      <Header onLogout={handleLogout} />

      <main className="container">
        <div className="page-header">
          <h2>Mes listes</h2>
        </div>

        {lists.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <p>Aucune liste pour le moment</p>
            <p>Créez votre première liste pour commencer</p>
          </div>
        ) : (
          <div className="cards-grid">
            {lists.map((list) => (
              <ListCard
                key={list._id}
                list={list}
                onOpen={handleOpenList}
                onDelete={(id) => setDeleteConfirm(id)}
              />
            ))}
          </div>
        )}
      </main>

      <button
        onClick={() => setShowNewListModal(true)}
        className="fab"
        aria-label="Créer une nouvelle liste"
      >
        +
      </button>

      {showNewListModal && (
        <NewListModal
          onClose={() => setShowNewListModal(false)}
          onCreate={handleCreateList}
        />
      )}

      {deleteConfirm && (
        <ConfirmDialog
          title="Supprimer la liste"
          message="Cette action supprime aussi tous les articles de la liste. Voulez-vous continuer ?"
          onConfirm={() => handleDeleteList(deleteConfirm)}
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
