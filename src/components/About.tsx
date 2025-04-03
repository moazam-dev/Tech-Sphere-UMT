import React from 'react';
import './About.css'; // for styling

const About = () => {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to TechStore</h1>
          <p>Your trusted tech partner for cutting-edge gadgets and seamless experiences</p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section">
        <div className="section-header">
          <h2>Our Story</h2>
        </div>
        <div className="section-content">
          <p>
            TechStore was founded with a passion for technology and a commitment to delivering the latest and greatest products to
            our customers. From humble beginnings, we've grown into a leading online destination for tech enthusiasts, providing
            high-quality gadgets and exceptional customer service.
          </p>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="section">
        <div className="section-header">
          <h2>Our Mission</h2>
        </div>
        <div className="section-content">
          <p>
            Our mission is to bring the best in technology to your doorstep. We aim to make the latest innovations accessible and
            affordable for everyone, all while providing an unmatched shopping experience and outstanding customer service.
          </p>
        </div>
      </section>

      {/* Our Core Values Section */}
      <section className="section">
        <div className="section-header">
          <h2>Our Core Values</h2>
        </div>
        <div className="core-values">
          <div className="value-item">
            <h3>Innovation</h3>
            <p>We strive to stay ahead of the curve and bring the most innovative technology to you.</p>
          </div>
          <div className="value-item">
            <h3>Customer-Centric</h3>
            <p>Your satisfaction is our top priority, and we're always here to help you with anything you need.</p>
          </div>
          <div className="value-item">
            <h3>Integrity</h3>
            <p>We believe in transparency, honesty, and providing the best products without compromise.</p>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      {/* <section className="section">
        <div className="section-header">
          <h2>Meet The Team</h2>
        </div>
        <div className="team">
          <div className="team-member">
            <img src="https://via.placeholder.com/150" alt="Team Member 1" />
            <h3>John Doe</h3>
            <p>Founder & CEO</p>
          </div>
          <div className="team-member">
            <img src="https://via.placeholder.com/150" alt="Team Member 2" />
            <h3>Jane Smith</h3>
            <p>Chief Operating Officer</p>
          </div>
          <div className="team-member">
            <img src="https://via.placeholder.com/150" alt="Team Member 3" />
            <h3>David Lee</h3>
            <p>Head of Marketing</p>
          </div>
        </div>
      </section> */}

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Ready to Experience the Best in Tech?</h2>
        <p>Join the TechStore community and discover the latest gadgets today!</p>
        <button className="cta-button">Shop Now</button>
      </section>
    </div>
  );
};

export default About;
