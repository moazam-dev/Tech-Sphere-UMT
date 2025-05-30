import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Shield, 
  Clock, 
  Award, 
  ArrowRight, 
  Smartphone,
  Star,
  Quote
} from 'lucide-react';
import "./landingPage.css"
export default function LostFoundLanding() {
  useEffect(()=>{
  window.scrollTo(0,0)
  },[])
  const [email, setEmail] = useState('');
   const navigate = useNavigate()
   const [showGetStarted,setGetStarted]=useState(true);

  const styles = {
    container: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      lineHeight: '1.6',
      color: '#0f172a',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
      minHeight: '100vh',
      
    },
    maxWidth: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px'
    },
    navbar: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.6)',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      padding: '1rem 0'
    },
    navContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    logoIcon: {
      width: '44px',
      height: '44px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)',
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '20px',
      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
    },
    logoText: {
      fontSize: '1.7rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '2.5rem'
    },
    navLink: {
      textDecoration: 'none',
      color: '#475569',
      fontWeight: '500',
      fontSize: '0.95rem',
      transition: 'all 0.3s ease',
      padding: '8px 0',
      position: 'relative'
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: 'white',
      padding: '14px 28px',
      border: 'none',
      borderRadius: '50px',
      fontWeight: '600',
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
      transform: 'translateY(0)'
    },
    btnSecondary: {
      background: 'rgba(255, 255, 255, 0.8)',
      color: '#475569',
      padding: '14px 28px',
      border: '2px solid rgba(203, 213, 225, 0.8)',
      borderRadius: '50px',
      fontWeight: '600',
      fontSize: '0.95rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      backdropFilter: 'blur(10px)'
    },
    hero: {
      padding: '140px 0 100px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    },
    heroBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
      zIndex: -1
    },
    heroBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '50px',
      padding: '10px 20px',
      marginBottom: '2.5rem',
      color: '#6366f1',
      fontSize: '0.9rem',
      fontWeight: '600',
      backdropFilter: 'blur(10px)'
    },
    heroTitle: {
      fontSize: '4.5rem',
      fontWeight: '900',
      marginBottom: '1.5rem',
      lineHeight: '1.1',
      letterSpacing: '-0.02em'
    },
    heroGradient: {
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'block'
    },
    heroSubtitle: {
      fontSize: '1.3rem',
      color: '#64748b',
      marginBottom: '3.5rem',
      maxWidth: '650px',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: '1.7'
    },
    heroButtons: {
      display: 'flex',
      gap: '1.5rem',
      justifyContent: 'center',
      marginBottom: '5rem',
      flexWrap: 'wrap'
    },
    stats: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '3rem',
      maxWidth: '900px',
      margin: '0 auto'
    },
    statItem: {
      textAlign: 'center',
      background: 'rgba(255, 255, 255, 0.6)',
      padding: '2rem 1.5rem',
      borderRadius: '20px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      transition: 'all 0.3s ease'
    },
    statNumber: {
      fontSize: '2.8rem',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '0.5rem'
    },
    statLabel: {
      color: '#64748b',
      fontWeight: '600',
      fontSize: '0.95rem'
    },
    section: {
      padding: '100px 0'
    },
    sectionWhite: {
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)'
    },
    sectionGray: {
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    },
    sectionTitle: {
      fontSize: '3.5rem',
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: '1.5rem',
      color: '#0f172a',
      letterSpacing: '-0.02em'
    },
    sectionSubtitle: {
      fontSize: '1.3rem',
      color: '#64748b',
      textAlign: 'center',
      marginBottom: '5rem',
      maxWidth: '650px',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: '1.7'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2.5rem'
    },
    card: {
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '2.5rem',
      borderRadius: '24px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.4s ease',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden'
    },
    cardIcon: {
      width: '70px',
      height: '70px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      borderRadius: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '2rem',
      color: 'white',
      fontSize: '26px',
      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
    },
    cardTitle: {
      fontSize: '1.4rem',
      fontWeight: '700',
      marginBottom: '1rem',
      color: '#0f172a'
    },
    cardDescription: {
      color: '#64748b',
      lineHeight: '1.7',
      fontSize: '1.05rem'
    },
    stepNumber: {
      width: '70px',
      height: '70px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.8rem',
      fontWeight: '800',
      margin: '0 auto 2rem',
      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
    },
    testimonialCard: {
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '2.5rem',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      transition: 'all 0.4s ease',
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
      height: 'fit-content'
    },
    testimonialQuote: {
      position: 'absolute',
      top: '1.5rem',
      right: '1.5rem',
      width: '40px',
      height: '40px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      opacity: 0.8
    },
    testimonialContent: {
      color: '#374151',
      marginBottom: '2rem',
      fontStyle: 'italic',
      lineHeight: '1.8',
      fontSize: '1.1rem',
      fontWeight: '500'
    },
    testimonialAuthor: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    authorAvatar: {
      width: '60px',
      height: '60px',
      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '700',
      fontSize: '1.2rem',
      boxShadow: '0 6px 20px rgba(99, 102, 241, 0.3)'
    },
    authorDetails: {
      flex: 1
    },
    authorName: {
      color: '#0f172a',
      fontWeight: '700',
      margin: 0,
      fontSize: '1.1rem'
    },
    authorRole: {
      color: '#64748b',
      fontSize: '0.95rem',
      margin: '0.25rem 0 0.5rem 0',
      fontWeight: '500'
    },
    stars: {
      display: 'flex',
      gap: '2px'
    },
    star: {
      width: '16px',
      height: '16px',
      fill: '#fbbf24',
      stroke: '#fbbf24'
    },
    cta: {
      padding: '100px 0',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      color: 'white',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    },
    ctaBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 30% 20%, rgba(99, 102, 241, 0.2) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)',
      zIndex: 1
    },
    ctaContent: {
      position: 'relative',
      zIndex: 2
    },
    ctaTitle: {
      fontSize: '3rem',
      fontWeight: '800',
      marginBottom: '1.5rem',
      letterSpacing: '-0.02em'
    },
    ctaSubtitle: {
      fontSize: '1.3rem',
      marginBottom: '3rem',
      opacity: '0.9',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: '1.7'
    },
    emailSignup: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginTop: '2rem',
      flexWrap: 'wrap',
      maxWidth: '500px',
      margin: '2rem auto 0'
    },
    emailInput: {
      padding: '16px 24px',
      border: 'none',
      borderRadius: '50px',
      fontSize: '1rem',
      minWidth: '280px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      outline: 'none',
      flex: '1'
    },
    footer: {
      background: '#0f172a',
      color: '#94a3b8',
      padding: '3rem 0',
      textAlign: 'center'
    }
  };

  const features = [
    {
      icon: <Search />,
      title: "Smart Search",
      description: "Advanced filtering and AI-powered matching to find your lost items quickly and efficiently"
    },
    {
      icon: <MapPin />,
      title: "Location Tracking", 
      description: "GPS-based location logging to help track where items were lost or found with precision"
    },
    {
      icon: <Shield />,
      title: "Secure Platform",
      description: "Verified users and secure messaging to ensure safe and trustworthy item exchanges"
    },
    {
      icon: <Clock />,
      title: "Real-time Updates",
      description: "Instant notifications when potential matches are found for your items"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Report Your Item",
      description: "Quickly post details about your lost or found item with photos and location information"
    },
    {
      number: 2,
      title: "Smart Matching",
      description: "Our AI automatically matches your item with potential matches in the database"
    },
    {
      number: 3,
      title: "Connect Safely",
      description: "Communicate through our secure platform to arrange safe item exchange"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "University Student",
      content: "Found my lost laptop within 2 days! The community here is amazing and the app made the whole process incredibly easy. I couldn't believe how quickly someone responded.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Mike Chen",
      role: "Small Business Owner", 
      content: "I've helped return over 15 items to their owners through this platform. It feels great to be part of such a helpful and caring community. Highly recommended!",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emma Davis",
      role: "High School Teacher",
      content: "Lost my wedding ring at the park during a school trip. Thanks to this app, a kind stranger found it and returned it safely the very next day!",
      rating: 5,
      avatar: "ED"
    }
  ];

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.navbar}>
        <div style={styles.maxWidth}>
          <div style={styles.navContent}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>
                <Search />
              </div>
              <span style={styles.logoText}>FindIt</span>
            </div>
            <div style={styles.navLinks}>
              <a href="#features" style={styles.navLink}>Features</a>
              <a href="#how-it-works" style={styles.navLink}>How It Works</a>
              <a href="#testimonials" style={styles.navLink}>Reviews</a>
              {   (!localStorage.uID) ?
                  <button style={styles.btnPrimary} onClick={()=>navigate("/login")}>
                Get Started
              </button>
              :
               (
                <div style={styles.btnPrimary} onClick={()=>{
                  localStorage.clear('uID')
                  setGetStarted(!showGetStarted);
                }}>logout</div>

               )
              }
              
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroBackground}></div>
        <div style={styles.maxWidth}>
          
          <h1 style={styles.heroTitle}>
            Never Lose
            <span style={styles.heroGradient}>Hope Again</span>
          </h1>
          
          <p style={styles.heroSubtitle}>
            Connect with your community to find lost items and help others reunite with their belongings. 
            Our smart platform makes recovery simple, secure, and successful.
          </p>

          <div style={styles.heroButtons}>
            <button onClick={()=>navigate('/getStartedOptions')} style={{...styles.btnPrimary, fontSize: '1.1rem', padding: '16px 32px'}}>
              Get Started <ArrowRight style={{marginLeft: '8px', width: '20px', height: '20px'}} />
            </button>
            <button style={{...styles.btnSecondary, fontSize: '1.1rem', padding: '16px 32px'}}>
              <Smartphone style={{marginRight: '8px', width: '20px', height: '20px'}} /> Download App
            </button>
          </div>

          <div style={styles.stats}>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>50K+</div>
              <div style={styles.statLabel}>Items Returned</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>100K+</div>
              <div style={styles.statLabel}>Active Users</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>95%</div>
              <div style={styles.statLabel}>Success Rate</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>24/7</div>
              <div style={styles.statLabel}>Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{...styles.section, ...styles.sectionWhite}}>
        <div style={styles.maxWidth}>
          <h2 style={styles.sectionTitle}>Powerful Features</h2>
          <p style={styles.sectionSubtitle}>
            Everything you need to find lost items and help others in your community
          </p>
          
          <div style={styles.grid}>
            {features.map((feature, index) => (
              <div key={index} style={styles.card}>
                <div style={styles.cardIcon}>
                  {feature.icon}
                </div>
                <h3 style={styles.cardTitle}>{feature.title}</h3>
                <p style={styles.cardDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{...styles.section, ...styles.sectionGray}}>
        <div style={styles.maxWidth}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <p style={styles.sectionSubtitle}>
            Simple steps to reunite with your lost items
          </p>
          
          <div style={styles.grid}>
            {steps.map((step, index) => (
              <div key={index} style={{...styles.card, textAlign: 'center', background: 'rgba(255, 255, 255, 0.9)'}}>
                <div style={styles.stepNumber}>
                  {step.number}
                </div>
                <h3 style={styles.cardTitle}>{step.title}</h3>
                <p style={styles.cardDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={{...styles.section, ...styles.sectionWhite}}>
        <div style={styles.maxWidth}>
          <h2 style={styles.sectionTitle}>What Our Users Say</h2>
          <p style={styles.sectionSubtitle}>
            Real stories from our community members
          </p>
          
          <div style={styles.grid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} style={styles.testimonialCard}>
                <div style={styles.testimonialQuote}>
                  <Quote size={20} />
                </div>
                <div style={styles.testimonialContent}>
                  "{testimonial.content}"
                </div>
                <div style={styles.testimonialAuthor}>
                  <div style={styles.authorAvatar}>
                    {testimonial.avatar}
                  </div>
                  <div style={styles.authorDetails}>
                    <h4 style={styles.authorName}>{testimonial.name}</h4>
                    <p style={styles.authorRole}>{testimonial.role}</p>
                    <div style={styles.stars}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} style={styles.star} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.cta}>
        <div style={styles.ctaBackground}></div>
        <div style={styles.maxWidth}>
          <div style={styles.ctaContent}>
            <h2 style={styles.ctaTitle}>Ready to Get Started?</h2>
            <p style={styles.ctaSubtitle}>
              Join thousands of users who have successfully reunited with their lost items
            </p>
            <div style={styles.emailSignup}>
              <input 
                type="email" 
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.emailInput}
              />
              <button style={{...styles.btnPrimary, minWidth: 'auto'}}>
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.maxWidth}>
          <p>&copy; 2024 FindIt. All rights reserved. Built with ❤️ for the community.</p>
        </div>
      </footer>
    </div>
  );
}