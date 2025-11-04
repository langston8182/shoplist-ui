import { useState } from 'react';
import type { CreateItemRequest, Weight } from '../types/api';
import { ArticleAutocomplete } from './ArticleAutocomplete';

interface NewItemFormProps {
  onAdd: (data: CreateItemRequest) => void;
}

export function NewItemForm({ onAdd }: NewItemFormProps) {
  const [name, setName] = useState('');
  const [quantityType, setQuantityType] = useState<'quantity' | 'weight'>(
    'quantity'
  );
  const [quantity, setQuantity] = useState('');
  const [weightValue, setWeightValue] = useState('');
  const [weightUnit, setWeightUnit] = useState<Weight['unit']>('g');
  const [notes, setNotes] = useState('');
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
      notes: notes.trim() || undefined,
    };

    if (quantityType === 'quantity') {
      data.quantity = parseInt(quantity, 10);
    } else {
      data.weight = {
        value: parseFloat(weightValue),
        unit: weightUnit,
      };
    }

    onAdd(data);

    setName('');
    setQuantity('');
    setWeightValue('');
    setNotes('');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="item-form">
      <h3>Ajouter un article</h3>

      <div className="form-group">
        <label htmlFor="item-name">Nom de l'article</label>
        <ArticleAutocomplete
          value={name}
          onChange={(value) => {
            setName(value);
            setErrors((prev) => ({ ...prev, name: '' }));
          }}
          className={errors.name ? 'input-error' : ''}
          placeholder="Nom de l'article"
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

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
          <label htmlFor="item-quantity">Quantité</label>
          <input
            id="item-quantity"
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
            <label htmlFor="item-weight">Poids</label>
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
              className={errors.weight ? 'input-error' : ''}
            />
            {errors.weight && (
              <span className="error-message">{errors.weight}</span>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="item-unit">Unité</label>
            <select
              id="item-unit"
              value={weightUnit}
              onChange={(e) => setWeightUnit(e.target.value as Weight['unit'])}
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
        <label htmlFor="item-notes">Notes (optionnel)</label>
        <textarea
          id="item-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Ajouter
      </button>
    </form>
  );
}
