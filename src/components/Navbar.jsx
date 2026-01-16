import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ cartCount, onOpenCart }) => {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-logo">
          <Link to="/">BAWK</Link>
        </div>
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/categories">Categories</Link></li>
          <li><Link to="/sale" className="highlight-red">Sale</Link></li>
          <li><Link to="/blog">Blog</Link></li>
        </ul>
        <div className="navbar-icons">
          <button className="icon-btn search-icon" aria-label="Search">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
          <button className="icon-btn wishlist-icon" aria-label="Wishlist">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          </button>
          <button className="icon-btn cart-icon" aria-label="Cart" onClick={onOpenCart}>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            <span className="cart-badge">{cartCount}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
