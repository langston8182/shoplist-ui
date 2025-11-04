import { useState } from 'react';
import type { CreateItemRequest, Weight } from '../types/api';
import { ArticleAutocomplete } from './ArticleAutocomplete';

interface NewItemModalProps {
  onClose: () => void;
  onSave: (data: CreateItemRequest) => void;
}

export function NewItemModal({ onClose, onSave }: NewItemModalProps) {
  const [name, setName] = useState('');
  const [quantityType, setQuantityType] = useState<'quantity' | 'weight'>('quantity');
  const [quantity, setQuantity] = useState('1');
  const [weightValue, setWeightValue] = useState('');
  const [weightUnit, setWeightUnit] = useState<Weight['unit']>('g');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
    }

    if (quantityType === 'quantity') {
      const qty = parseInt(quantity, 10);
      if (!quantity || isNaN(qty) || qty < 1) {
        newErrors.quantity = 'La quantité doit être un nombre positif';
      }
    } else {
      const weight = parseFloat(weightValue);
      if (!weightValue || isNaN(weight) || weight <= 0) {
        newErrors.weight = 'Le poids doit être un nombre positif';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const data: CreateItemRequest = {
      name: name.trim(),
    };

    if (quantityType === 'quantity') {
      data.quantity = parseInt(quantity, 10);
    } else {
      data.weight = {
        value: parseFloat(weightValue),
        unit: weightUnit,
      };
    }

    onSave(data);
    onClose();
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
          <h3>Ajouter un article</h3>
          <button 
            onClick={onClose} 
            className="modal-close"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content mobile-form">
          <div className="form-group">
            <ArticleAutocomplete
              value={name}
              onChange={(value) => {
                setName(value);
                setErrors((prev) => ({ ...prev, name: '' }));
              }}
              className={`mobile-input ${errors.name ? 'input-error' : ''}`}
              placeholder="Nom de l'article"
              autoFocus
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <div className="quantity-type-selector">
              <button
                type="button"
                className={`type-btn ${quantityType === 'quantity' ? 'active' : ''}`}
                onClick={() => setQuantityType('quantity')}
              >
                Quantité
              </button>
              <button
                type="button"
                className={`type-btn ${quantityType === 'weight' ? 'active' : ''}`}
                onClick={() => setQuantityType('weight')}
              >
                Poids
              </button>
            </div>
          </div>

          {quantityType === 'quantity' ? (
            <div className="form-group">
              <input
                id="item-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setErrors((prev) => ({ ...prev, quantity: '' }));
                }}
                className={`mobile-input ${errors.quantity ? 'input-error' : ''}`}
                placeholder="Quantité"
              />
              {errors.quantity && (
                <span className="error-message">{errors.quantity}</span>
              )}
            </div>
          ) : (
            <div className="form-group">
              <div className="weight-input-group">
                <input
                  id="item-weight"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={weightValue}
                  onChange={(e) => {
                    setWeightValue(e.target.value);
                    setErrors((prev) => ({ ...prev, weight: '' }));
                  }}
                  className={`mobile-input weight-value ${errors.weight ? 'input-error' : ''}`}
                  placeholder="Poids"
                />
                <select
                  id="item-unit"
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as Weight['unit'])}
                  className="mobile-input weight-unit"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">l</option>
                </select>
              </div>
              {errors.weight && (
                <span className="error-message">{errors.weight}</span>
              )}
            </div>
          )}

          <div className="modal-actions mobile-actions">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn btn-secondary mobile-btn"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn btn-primary mobile-btn"
              disabled={!name.trim()}
            >
              ✅ Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}