import { useNavigate } from 'react-router-dom';
import { authStore } from '../stores/auth.store';

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const fullName = authStore.getFullName();

  const handleTitleClick = () => {
    navigate('/lists');
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title" onClick={handleTitleClick}>
          Shoplist
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {fullName && (
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
              Bonjour {fullName}
            </span>
          )}
          <button
            onClick={onLogout}
            className="btn btn-secondary"
            aria-label="Se déconnecter"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
}
