import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryGrid from './components/CategoryGrid';
import ProductSection from './components/ProductSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import OrderTracking from './components/OrderTracking';

// Pages
import Categories from './pages/Categories';
import Sale from './pages/Sale';
import Blog from './pages/Blog';



// Main content component to keep the landing page clean
const LandingPage = ({ addToCart, buyNow }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <>
      <Hero />
      <CategoryGrid
        addToCart={addToCart}
        buyNow={buyNow}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {!selectedCategory && (
        <>
          <ProductSection
            title="Featured Products"
            id="featured"
            addToCart={addToCart}
            buyNow={buyNow}
          />
          <section className="section">
            <div className="container" style={{ display: 'flex', gap: '2rem', flexDirection: 'column' }}>
              <div style={{ flex: 1, padding: '2rem', background: '#222', borderRadius: '8px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', textTransform: 'uppercase', color: '#fff', marginBottom: '0.5rem' }}>Otaku Threads</h3>
                <p style={{ color: '#aaa' }}>Premium Anime Apparel</p>
              </div>
              <div style={{ flex: 1, padding: '2rem', background: '#222', borderRadius: '8px', textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', textTransform: 'uppercase', color: '#fff', marginBottom: '0.5rem' }}>Epic Wrap</h3>
                <p style={{ color: '#aaa' }}>Custom Anime Skins</p>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Router>
      <Routes>


        {/* Public Routes */}
        <Route path="/*" element={<PublicLayout cart={cart} setCart={setCart} isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />} />
      </Routes>
    </Router>
  );
}

// Wrapper for public site to handle shared state like Cart
function PublicLayout({ cart, setCart, isCartOpen, setIsCartOpen }) {
  const navigate = useNavigate();

  const addToCart = (product, openDrawer = true) => {
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
    if (openDrawer) setIsCartOpen(true);
  };

  const buyNow = (product) => {
    addToCart(product, false);
    navigate('/checkout');
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
        <Route path="/" element={<LandingPage addToCart={addToCart} buyNow={buyNow} />} />
        <Route path="/categories" element={<Categories addToCart={addToCart} buyNow={buyNow} />} />
        <Route path="/sale" element={<Sale addToCart={addToCart} buyNow={buyNow} />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
        <Route path="/track-order" element={<OrderTracking />} />
      </Routes>

      <Footer />
    </div>
  );
}


export default App;
