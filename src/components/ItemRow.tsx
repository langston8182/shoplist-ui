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
  const getQuantityDisplay = () => {
    if (item.quantity !== null) {
      return `× ${item.quantity}`;
    }
    if (item.weight) {
      return `${item.weight.value} ${item.weight.unit}`;
    }
    return '';
  };

  return (
    <div className={`item-row ${item.purchased ? 'item-purchased' : ''}`}>
      <div className="item-main">
        <input
          type="checkbox"
          checked={item.purchased}
          onChange={(e) => onTogglePurchased(item._id, e.target.checked)}
          aria-label={`Marquer ${item.name} comme ${
            item.purchased ? 'non acheté' : 'acheté'
          }`}
        />
        <div className="item-info">
          <div className="item-name">{item.name}</div>
          {getQuantityDisplay() && (
            <span className="item-quantity">{getQuantityDisplay()}</span>
          )}
          {item.notes && <div className="item-notes">{item.notes}</div>}
        </div>
      </div>
      <div className="item-actions">
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
  );
}
