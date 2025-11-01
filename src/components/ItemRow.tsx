import { useState, useRef, useEffect } from 'react';
import type { Item } from '../types/api';

interface ItemRowProps {
  item: Item;
  onTogglePurchased: (itemId: string, purchased: boolean) => void;
  onEdit: (item: Item) => void;
  onDelete: (itemId: string) => void;
}

export function ItemRow({
  item,
  onTogglePurchased,
  onEdit,
  onDelete,
}: ItemRowProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showAction, setShowAction] = useState<'delete' | 'toggle' | null>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const itemRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 80;
  const getQuantityDisplay = () => {
    if (item.quantity !== null) {
      return `× ${item.quantity}`;
    }
    if (item.weight) {
      return `${item.weight.value} ${item.weight.unit}`;
    }
    return '';
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    currentX.current = e.touches[0].clientX;
    const deltaX = currentX.current - startX.current;
    
    // Swipe vers la gauche (deltaX négatif) pour supprimer
    if (deltaX < 0) {
      const clampedDelta = Math.max(deltaX, -120); // Limite à 120px
      setTranslateX(clampedDelta);
      setShowAction(Math.abs(clampedDelta) > SWIPE_THRESHOLD ? 'delete' : null);
    }
    // Swipe vers la droite (deltaX positif) pour toggle acheté/non acheté
    else if (deltaX > 0) {
      const clampedDelta = Math.min(deltaX, 120); // Limite à 120px
      setTranslateX(clampedDelta);
      setShowAction(clampedDelta > SWIPE_THRESHOLD ? 'toggle' : null);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    if (Math.abs(translateX) > SWIPE_THRESHOLD) {
      // Swipe confirmé - afficher l'action correspondante
      if (translateX < 0) {
        setTranslateX(-120);
        setShowAction('delete');
      } else {
        setTranslateX(120);
        setShowAction('toggle');
      }
    } else {
      // Swipe insuffisant - revenir à la position normale
      resetSwipe();
    }
  };

  const resetSwipe = () => {
    setTranslateX(0);
    setShowAction(null);
    // Force le recalcul du style en supprimant et rajoutant une classe
    if (itemRef.current) {
      itemRef.current.classList.add('resetting');
      setTimeout(() => {
        if (itemRef.current) {
          itemRef.current.classList.remove('resetting');
        }
      }, 10);
    }
  };

  const handleDelete = () => {
    // Vibration tactile si supportée
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    onDelete(item._id);
    resetSwipe();
  };

  const handleToggle = () => {
    // Vibration tactile si supportée
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    onTogglePurchased(item._id, !item.purchased);
    resetSwipe();
  };

  // Effet pour gérer les clics en dehors pour fermer le swipe
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (showAction && itemRef.current && !itemRef.current.contains(event.target as Node)) {
        resetSwipe();
      }
    };

    if (showAction) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showAction]);

  // Feedback haptique quand le seuil de swipe est atteint
  useEffect(() => {
    if (showAction && navigator.vibrate) {
      navigator.vibrate(25);
    }
  }, [showAction]);

  return (
    <div className="item-row-container">
      {/* Action de toggle à gauche */}
      <div className="item-toggle-action">
        <button
          onClick={handleToggle}
          className="toggle-action-btn"
          aria-label={`${item.purchased ? 'Marquer comme non acheté' : 'Marquer comme acheté'} ${item.name}`}
        >
          <span className="toggle-icon">{item.purchased ? '↩️' : '✅'}</span>
          <span className="toggle-text">{item.purchased ? 'Annuler' : 'Acheté'}</span>
        </button>
      </div>

      {/* Action de suppression à droite */}
      <div className="item-delete-action">
        <button
          onClick={handleDelete}
          className="delete-action-btn"
          aria-label={`Supprimer ${item.name}`}
        >
          <span className="delete-icon">🗑️</span>
          <span className="delete-text">Supprimer</span>
        </button>
      </div>

      {/* Contenu principal de l'item */}
      <div 
        ref={itemRef}
        className={`item-row ${item.purchased ? 'item-purchased' : ''} ${isDragging ? 'dragging' : ''}`}
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={showAction ? resetSwipe : undefined}
      >
        <div className="item-main">
          <div className="item-status-icon">
            {item.purchased ? '✅' : '🛒'}
          </div>
          <div className="item-info">
            <div className="item-name">{item.name}</div>
            {getQuantityDisplay() && (
              <span className="item-quantity">{getQuantityDisplay()}</span>
            )}
            {item.notes && <div className="item-notes">{item.notes}</div>}
          </div>
        </div>
        
        {/* Actions visibles sur desktop ou quand pas de swipe */}
        <div className={`item-actions ${showAction ? 'hidden' : ''}`}>
          <button
            onClick={() => onEdit(item)}
            className="btn btn-small btn-secondary"
            aria-label={`Modifier ${item.name}`}
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(item._id)}
            className="btn btn-small btn-danger-outline"
            aria-label={`Supprimer ${item.name}`}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
