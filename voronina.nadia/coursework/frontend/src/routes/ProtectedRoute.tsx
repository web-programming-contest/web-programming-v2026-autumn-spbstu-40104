import {Navigate, Outlet} from 'react-router-dom';
import {useAuthStore} from '../store/authStore';

export function ProtectedRoute() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const initialize = useAuthStore((state) => state.initialize);

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => initialize()}>Повторить</button>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
