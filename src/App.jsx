import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import ProductSection from './components/ProductSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';

// Admin Imports
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AddProduct from './admin/AddProduct';

// Main content component to keep the landing page clean
const LandingPage = ({ addToCart }) => (
  <>
    <Hero />
    <CategoryGrid />
    <ProductSection
      title="Top Sale This Week"
      id="top-sale"
      addToCart={addToCart}
    />
    <ProductSection
      title="Featured Products"
      id="featured"
      addToCart={addToCart}
    />
    <ProductSection
      title="Sale Products"
      id="sale"
      addToCart={addToCart}
    />

    <section className="section">
      <div className="container" style={{ display: 'flex', gap: '2rem' }}>
        <div style={{ flex: 1, height: '300px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '2rem', textTransform: 'uppercase', color: '#fff' }}>Otaku Threads</h3>
        </div>
        <div style={{ flex: 1, height: '300px', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '2rem', textTransform: 'uppercase', color: '#fff' }}>Epic Wrap</h3>
        </div>
      </div>
    </section>
  </>
);

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Note: We need to move Router up to handle useNavigate, 
  // but for simplicity in this structure we will keep state here and pass it down 
  // or restructure to use a Layout component.

  // To correctly handle the conditional rendering of Navbar/Footer for admin,
  // we should check the path. Since App is inside Router in index.js (usually), but here App wraps Router.
  // We will split this component.

  return (
    <Router>
      <Routes>
        {/* Admin Routes - No Public Navbar/Footer */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminDashboard />} />
          <Route path="products/new" element={<AddProduct />} />
        </Route>

        {/* Public Routes */}
        <Route path="/*" element={<PublicLayout cart={cart} setCart={setCart} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />} />
      </Routes>
    </Router>
  );
}

// Wrapper for public site to handle shared state like Cart
function PublicLayout({ cart, setCart, isCartOpen, setIsCartOpen }) {
  const navigate = useNavigate();

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="App">
      <Navbar cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      <Routes>
        <Route path="/" element={<LandingPage addToCart={addToCart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
