import React, { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import type { Item, UpdateItemRequest } from '../types/item';

interface ItemRowProps {
  item: Item;
  onUpdate: (itemId: string, item: UpdateItemRequest) => void;
  onDelete: (itemId: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export const ItemRow: React.FC<ItemRowProps> = ({
  item,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editQuantity, setEditQuantity] = useState(item.quantity);
  const [editUnit, setEditUnit] = useState(item.unit);

  const handleEdit = () => {
    setIsEditing(true);
    setEditName(item.name);
    setEditQuantity(item.quantity);
    setEditUnit(item.unit);
  };

  const handleSave = () => {
    if (editName.trim()) {
      onUpdate(item._id, {
        name: editName.trim(),
        quantity: editQuantity.trim(),
        unit: editUnit.trim(),
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditName(item.name);
    setEditQuantity(item.quantity);
    setEditUnit(item.unit);
  };

  const handleDelete = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${item.name}" ?`)) {
      onDelete(item._id);
    }
  };

  if (isEditing) {
    return (
      <tr className="bg-blue-50">
        <td className="px-6 py-4">
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
        </td>
        <td className="px-6 py-4">
          <input
            type="text"
            value={editQuantity}
            onChange={(e) => setEditQuantity(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </td>
        <td className="px-6 py-4">
          <input
            type="text"
            value={editUnit}
            onChange={(e) => setEditUnit(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </td>
        <td className="px-6 py-4">
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={isUpdating || !editName.trim()}
              className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
              title="Sauvegarder"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className="p-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              title="Annuler"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
      <td className="px-6 py-4 text-gray-700">{item.quantity || '-'}</td>
      <td className="px-6 py-4 text-gray-700">{item.unit || '-'}</td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <button
            onClick={handleEdit}
            disabled={isUpdating || isDeleting}
            className="p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
            title="Modifier"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isUpdating || isDeleting}
            className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};