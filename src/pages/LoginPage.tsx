import { useEffect } from 'react';
import { authService } from '../services/auth.service';
import { Loader } from '../components/Loader';

export function LoginPage() {
  useEffect(() => {
    authService.redirectToLogin();
  }, []);

  return <Loader />;
}
