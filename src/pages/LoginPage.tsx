import { useEffect } from 'react';
import { authService } from '../services/auth.service';
import { Loader } from '../components/Loader';

export function LoginPage() {
  useEffect(() => {
    console.log('🔐 [LOGIN PAGE] Affichage de la page de login, redirection en cours...');
    authService.redirectToLogin();
  }, []);

  return <Loader />;
}
