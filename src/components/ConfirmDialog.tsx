interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal confirm-modal">
        <div className="modal-header">
          <div className="modal-header-content">
            <div className="modal-icon danger-icon">⚠️</div>
            <div>
              <h3>{title}</h3>
              <p className="modal-subtitle">Cette action est irréversible</p>
            </div>
          </div>
          <button 
            onClick={onCancel} 
            className="modal-close"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <div className="modal-content">
          <div className="confirm-message">
            <div className="message-icon">🗑️</div>
            <p>{message}</p>
          </div>

          <div className="confirm-warning">
            <div className="warning-icon">💡</div>
            <span>Astuce : Vous pouvez aussi marquer l'article comme acheté au lieu de le supprimer.</span>
          </div>

          <div className="modal-actions">
            <button 
              onClick={onCancel} 
              className="btn btn-secondary"
            >
              <span>↩️</span>
              Annuler
            </button>
            <button 
              onClick={onConfirm} 
              className="btn btn-danger"
            >
              <span>🗑️</span>
              Supprimer définitivement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
