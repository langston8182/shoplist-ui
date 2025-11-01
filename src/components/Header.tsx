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
        <div className="header-actions">
          {fullName && (
            <span className="header-greeting">
              Bonjour {fullName.split(' ')[0]}
            </span>
          )}
          <button
            onClick={onLogout}
            className="btn btn-secondary header-logout-btn"
            aria-label="Se déconnecter"
          >
            <span className="logout-text">Déconnexion</span>
            <span className="logout-icon">👋</span>
          </button>
        </div>
      </div>
    </header>
  );
}
