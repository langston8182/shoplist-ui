import { useState } from 'react';

interface NewListModalProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function NewListModal({ onClose, onCreate }: NewListModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Le nom est obligatoire');
      return;
    }
    onCreate(name.trim());
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-header-content">
            <div className="modal-icon">📝</div>
            <div>
              <h3>Créer une nouvelle liste</h3>
              <p className="modal-subtitle">Donnez un nom à votre liste de courses</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="modal-close"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          <div className="form-group">
            <label htmlFor="list-name">Nom de la liste</label>
            <div className="input-container">
              <input
                id="list-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                className={error ? 'input-error' : ''}
                placeholder="Ex: Courses du weekend, Liste Noël..."
                autoFocus
              />
              <div className="input-icon">🏷️</div>
            </div>
            {error && <span className="error-message">{error}</span>}
          </div>

          <div className="modal-preview">
            <div className="preview-label">Aperçu :</div>
            <div className="list-card-preview">
              <div className="preview-icon">📋</div>
              <div className="preview-content">
                <div className="preview-name">{name || 'Nom de la liste'}</div>
                <div className="preview-meta">0 article • Créée maintenant</div>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!name.trim()}
            >
              <span>✨</span>
              Créer la liste
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
