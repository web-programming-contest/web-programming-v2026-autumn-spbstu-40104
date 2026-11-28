import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';

import {ProtectedRoute} from './routes/ProtectedRoute';
import {useAuthStore} from './store/authStore';

import Catalog from './pages/Catalog/Catalog';

import {Header} from './components/Header/Header';
import {Footer} from './components/Footer/Footer';
import {HomePage} from './pages/HomePage/HomePage';
import {LoginPage} from './pages/LoginPage/LoginPage';
import {CartPage} from './pages/CartPage/CartPage';

function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <BrowserRouter>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <LoginPage />}
          />

          <Route element={<ProtectedRoute />}>
            <Route path="/catalog" element={<Catalog />} />

            <Route path="/cart" element={<CartPage />} />
          </Route>

          <Route path="*" element={<h1>Страница не найдена</h1>} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
