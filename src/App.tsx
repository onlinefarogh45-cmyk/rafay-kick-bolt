import { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import CartDrawer from './components/ui/CartDrawer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AdminDashboard from './pages/AdminDashboard';

type Page =
  | 'home'
  | 'catalog'
  | 'product'
  | 'checkout'
  | 'auth'
  | 'dashboard'
  | 'order-tracking'
  | 'admin';

const noFooterPages: Page[] = ['auth', 'checkout'];

function App() {
  const [page, setPage] = useState<Page>('home');
  const [productId, setProductId] = useState<string>('');

  const navigate = (target: string, id?: string) => {
    setPage(target as Page);
    if (id) setProductId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showFooter = !noFooterPages.includes(page);
  const showHeader = page !== 'auth';

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 flex flex-col">
      {showHeader && <Header currentPage={page} onNavigate={navigate} />}
      <CartDrawer onNavigate={navigate} />

      <main className="flex-1">
        {page === 'home' && <HomePage onNavigate={navigate} />}
        {page === 'catalog' && <CatalogPage onNavigate={navigate} />}
        {page === 'product' && <ProductDetailPage productId={productId} onNavigate={navigate} />}
        {page === 'checkout' && <CheckoutPage onNavigate={navigate} />}
        {page === 'auth' && <AuthPage onNavigate={navigate} />}
        {page === 'dashboard' && <DashboardPage onNavigate={navigate} />}
        {page === 'order-tracking' && <OrderTrackingPage onNavigate={navigate} />}
        {page === 'admin' && <AdminDashboard onNavigate={navigate} />}
      </main>

      {showFooter && <Footer onNavigate={navigate} />}
    </div>
  );
}

export default App;
