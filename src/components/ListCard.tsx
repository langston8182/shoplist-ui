import type { List } from '../types/api';

interface ListCardProps {
  list: List;
  onOpen: (listId: string) => void;
  onDelete: (listId: string) => void;
}

export function ListCard({ list, onOpen, onDelete }: ListCardProps) {
  return (
    <div className="card" onClick={() => onOpen(list._id)}>
      <div className="card-header">
        <div>
          <h3 className="card-title">{list.name}</h3>
          <div className="card-subtitle">
            <span>{new Date(list.createdAt).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      </div>
      <div className="card-actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(list._id);
          }}
          className="btn btn-danger-outline btn-small"
          aria-label={`Supprimer ${list.name}`}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
