import { useState } from 'react';
import type { Item, UpdateItemRequest, Weight } from '../types/api';

interface EditItemModalProps {
  item: Item;
  onClose: () => void;
  onSave: (itemId: string, data: UpdateItemRequest) => void;
}

export function EditItemModal({ item, onClose, onSave }: EditItemModalProps) {
  const [quantityType, setQuantityType] = useState<'quantity' | 'weight'>(
    item.quantity !== null ? 'quantity' : 'weight'
  );
  const [quantity, setQuantity] = useState(item.quantity?.toString() || '');
  const [weightValue, setWeightValue] = useState(
    item.weight?.value.toString() || ''
  );
  const [weightUnit, setWeightUnit] = useState<Weight['unit']>(
    item.weight?.unit || 'g'
  );
  const [purchased, setPurchased] = useState(item.purchased);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

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

    const data: UpdateItemRequest = {
      purchased,
    };

    if (quantityType === 'quantity') {
      data.quantity = parseInt(quantity, 10);
      data.weight = null;
    } else {
      data.quantity = null;
      data.weight = {
        value: parseFloat(weightValue),
        unit: weightUnit,
      };
    }

    onSave(item._id, data);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Modifier {item.name}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Type de quantité</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="quantityType"
                  value="quantity"
                  checked={quantityType === 'quantity'}
                  onChange={() => setQuantityType('quantity')}
                />
                Quantité
              </label>
              <label>
                <input
                  type="radio"
                  name="quantityType"
                  value="weight"
                  checked={quantityType === 'weight'}
                  onChange={() => setQuantityType('weight')}
                />
                Poids
              </label>
            </div>
          </div>

          {quantityType === 'quantity' ? (
            <div className="form-group">
              <label htmlFor="edit-quantity">Quantité</label>
              <input
                id="edit-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setErrors((prev) => ({ ...prev, quantity: '' }));
                }}
                className={errors.quantity ? 'input-error' : ''}
              />
              {errors.quantity && (
                <span className="error-message">{errors.quantity}</span>
              )}
            </div>
          ) : (
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="edit-weight">Poids</label>
                <input
                  id="edit-weight"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={weightValue}
                  onChange={(e) => {
                    setWeightValue(e.target.value);
                    setErrors((prev) => ({ ...prev, weight: '' }));
                  }}
                  className={errors.weight ? 'input-error' : ''}
                />
                {errors.weight && (
                  <span className="error-message">{errors.weight}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="edit-unit">Unité</label>
                <select
                  id="edit-unit"
                  value={weightUnit}
                  onChange={(e) =>
                    setWeightUnit(e.target.value as Weight['unit'])
                  }
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                  <option value="ml">ml</option>
                  <option value="l">l</option>
                </select>
              </div>
            </div>
          )}

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={purchased}
                onChange={(e) => setPurchased(e.target.checked)}
              />
              Acheté
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
