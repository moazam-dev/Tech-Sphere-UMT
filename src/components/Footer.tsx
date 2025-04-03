import React from 'react';
import './Footer.css'; // Import the updated CSS for the footer styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About Us Section */}
        <div className="footer-section about">
          <h3 className="footer-heading">About TechStore</h3>
          <p>
            At TechStore, we offer the latest electronics and gadgets, providing customers with top-quality products and excellent service.
          </p>
        </div>

        {/* Product Categories Section */}
        <div className="footer-section categories">
          <h3 className="footer-heading">Shop By Category</h3>
          <ul className="footer-list">
            <li><a href="/smartphones" className="footer-link">Smartphones</a></li>
            <li><a href="/laptops" className="footer-link">Laptops</a></li>
            <li><a href="/accessories" className="footer-link">Accessories</a></li>
            <li><a href="/gaming" className="footer-link">Gaming</a></li>
          </ul>
        </div>

        {/* Customer Service Section */}
        <div className="footer-section customer-service">
          <h3 className="footer-heading">Customer Service</h3>
          <ul className="footer-list">
            <li><a href="/faq" className="footer-link">FAQ</a></li>
            <li><a href="/shipping" className="footer-link">Shipping & Returns</a></li>
            <li><a href="/contact" className="footer-link">Contact Us</a></li>
            <li><a href="/terms" className="footer-link">Terms & Conditions</a></li>
            <li><a href="/privacy" className="footer-link">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Newsletter Subscription Section */}
        <div className="footer-section newsletter">
          <h3 className="footer-heading">Subscribe</h3>
          <p>Stay updated with our latest products and offers.</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" className="newsletter-input" required />
            <button type="submit" className="newsletter-btn">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="footer-social">
        <ul className="social-list">
          <li><a href="https://facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">Facebook</a></li>
          <li><a href="https://twitter.com" className="social-icon" target="_blank" rel="noopener noreferrer">Twitter</a></li>
          <li><a href="https://instagram.com" className="social-icon" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          <li><a href="https://linkedin.com" className="social-icon" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
        </ul>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>&copy; 2025 TechStore. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
