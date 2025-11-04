import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { ListsPage } from './pages/ListsPage';
import { ListDetailPage } from './pages/ListDetailPage';
import { authStore } from './stores/auth.store';
import { authService } from './services/auth.service';
import { Loader } from './components/Loader';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const checkAuthWithRefresh = async () => {
      if (!authStore.isAuthenticated()) {
        console.log('🛡️ [PROTECTED ROUTE] Utilisateur non authentifié, tentative de refresh...');
        setIsChecking(true);
        
        try {
          const refreshSuccess = await authService.refreshToken();
          
          if (refreshSuccess) {
            console.log('🛡️ [PROTECTED ROUTE] Refresh réussi, vérification de l\'authentification...');
            const authResponse = await authService.checkAuth();
            
            if (authResponse.authenticated && authResponse.profile) {
              console.log('🛡️ [PROTECTED ROUTE] Utilisateur maintenant authentifié');
              authStore.setUser(authResponse.profile);
            } else {
              console.log('🛡️ [PROTECTED ROUTE] Échec de la vérification après refresh');
              setShouldRedirect(true);
            }
          } else {
            console.log('🛡️ [PROTECTED ROUTE] Échec du refresh, redirection nécessaire');
            setShouldRedirect(true);
          }
        } catch (error) {
          console.log('🛡️ [PROTECTED ROUTE] Erreur lors du refresh:', error);
          setShouldRedirect(true);
        } finally {
          setIsChecking(false);
        }
      } else {
        console.log('🛡️ [PROTECTED ROUTE] Utilisateur déjà authentifié');
      }
    };

    checkAuthWithRefresh();
  }, []);

  if (isChecking) {
    console.log('🛡️ [PROTECTED ROUTE] Vérification en cours...');
    return <Loader />;
  }

  if (shouldRedirect || !authStore.isAuthenticated()) {
    console.log('🛡️ [PROTECTED ROUTE] Accès refusé, redirection vers /');
    return <Navigate to="/" replace />;
  }

  console.log('🛡️ [PROTECTED ROUTE] Accès autorisé');
  return <>{children}</>;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('🚀 [APP] Initialisation de l\'authentification...');
    const initializeAuth = async () => {
      try {
        const authResponse = await authService.checkAuth();

        if (authResponse.authenticated && authResponse.profile) {
          console.log('✅ [APP] Utilisateur authentifié, mise à jour du store');
          authStore.setUser(authResponse.profile);
          setIsAuthenticated(true);
        } else {
          console.log('❌ [APP] Utilisateur non authentifié');
          authStore.clearUser();
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log('❌ [APP] Erreur lors de l\'initialisation de l\'authentification:', error);
        authStore.clearUser();
        setIsAuthenticated(false);
      } finally {
        console.log('🏁 [APP] Initialisation terminée');
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/lists" replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/lists"
          element={
            <ProtectedRoute>
              <ListsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lists/:listId"
          element={
            <ProtectedRoute>
              <ListDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
