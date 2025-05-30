import React, { useEffect, useState } from 'react';
import {HeartIcon, Heart, MessageCircle, Search, Calendar, MapPin, User, Phone, Clock, Package, Filter, Zap, X } from 'lucide-react';
import { FaHeart } from "react-icons/fa";
const API_BASE = 'http://localhost:5000/api';

const LostItemsList = () => {
  // const [buttonLiked,setButtonLike] = useState(false)
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [loading, setLoading] = useState(true);
     useEffect(()=>{
      window.scrollTo(0,0)
     },[])
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE}/lost-items?search=${encodeURIComponent(search)}&range=${encodeURIComponent(dateRange)}`
        );
        const data = await response.json();
        if (Array.isArray(data)) setItems(data);
        else if (data?.recordset) setItems(data.recordset);
        else setItems([]);
      } catch (err) {
        console.error('Fetch error:', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [search, dateRange]);

  const handleLike = async (itemId) => {
    try {
      const result = await fetch(`${API_BASE}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, userId: parseInt(localStorage.uID) }),
      });
      const response = await result.json();
      if (response.message === 'Already liked') {
        //  setButtonLike(true)
         return;
      }
      setItems(prev =>
        prev.map(i =>
          i.id === itemId ? { ...i, likesCount: (i.likesCount || 0) + 1 } : i
        )
      );
    } catch (error) {
      console.error('Failed to like item:', error);
    }
  };

  const handleComment = async (itemId) => {
    const text = prompt('Share your thoughts or tips to help find this item:');
    if (!text) return;
    try {
      await fetch(`${API_BASE}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, userId: parseInt(localStorage.uID), commentText: text }),
      });
      setItems(prev =>
        prev.map(i =>
          i.id === itemId ? { ...i, noOfComments: (i.noOfComments || 0) + 1 } : i
        )
      );
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const grouped = Array.isArray(items)
    ? items.reduce((acc, item) => {
        const category = item.categoryName || 'Uncategorized';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
      }, {})
    : {};

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <Package size={28} />
        </div>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Lost Items Directory</h1>
          <p style={styles.headerSubtitle}>
            Help reunite people with their lost belongings
          </p>
          <div style={styles.statsContainer}>
            <div style={styles.statItem}>
              <Zap size={16} />
              <span>{items.length} Items Listed</span>
            </div>
            <div style={styles.statItem}>
              <Clock size={16} />
              <span>Live Updates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div style={styles.searchSection}>
        <div style={styles.searchContainer}>
          <div style={styles.searchInputWrapper}>
            <Search size={20} style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search by item name, location, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                style={styles.clearButton}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        
        <div style={styles.filterContainer}>
          <div style={styles.filterWrapper}>
            <Filter size={20} style={styles.filterIcon} />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="">All Time</option>
              <option value="24h">Last 24 Hours</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}>
              <div style={styles.spinner}></div>
            </div>
            <h3 style={styles.loadingTitle}>Searching Lost Items</h3>
            <p style={styles.loadingText}>Please wait while we retrieve the latest listings</p>
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <Package size={64} />
            </div>
            <h3 style={styles.emptyTitle}>No Items Found</h3>
            <p style={styles.emptyText}>
              {search || dateRange 
                ? "Try adjusting your search criteria or date filter"
                : "No lost items have been reported yet"}
            </p>
          </div>
        ) : (
          Object.entries(grouped).map(([category, itemsInCategory]) => (
            <div key={category} style={styles.categorySection}>
              <div style={styles.categoryHeader}>
                <h2 style={styles.categoryTitle}>{category}</h2>
                <div style={styles.categoryBadge}>
                  {itemsInCategory.length}
                </div>
              </div>

              <div style={styles.itemsGrid}>
                {itemsInCategory.map((item) => (
                  <div key={item.id} style={styles.itemCard}>
                    <div style={styles.cardHeader}>
                      <div style={styles.cardImageContainer}>
                        <img
                          src={item.image || '/no-image.png'}
                          alt={item.itemName}
                          style={styles.cardImage}
                          onError={(e) => {
                            e.target.src = '/no-image.png';
                          }}
                        />
                      </div>
                      <div style={styles.statusBadge}>
                        <Package size={12} />
                        <span>Lost</span>
                      </div>
                    </div>

                    <div style={styles.cardBody}>
                      <h3 style={styles.itemTitle}>{item.itemName}</h3>
                      <p style={styles.itemDescription}>{item.description}</p>

                      <div style={styles.itemDetails}>
                        <div style={styles.detailRow}>
                          <div style={styles.detailIcon}>
                            <User size={16} />
                          </div>
                          <span style={styles.detailText}>
                            {item.firstName} {item.lastName}
                          </span>
                        </div>
                        
                        <div style={styles.detailRow}>
                          <div style={styles.detailIcon}>
                            <MapPin size={16} />
                          </div>
                          <span style={styles.detailText}>{item.location}</span>
                        </div>
                        
                        <div style={styles.detailRow}>
                          <div style={styles.detailIcon}>
                            <Phone size={16} />
                          </div>
                          <span style={styles.detailText}>{item.contactInfo}</span>
                        </div>
                        
                        <div style={styles.detailRow}>
                          <div style={styles.detailIcon}>
                            <Calendar size={16} />
                          </div>
                          <span style={styles.detailText}>
                            {new Date(item.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={styles.cardActions}>
                      <button
                        onClick={() => handleLike(item.id)}
                      style={{...styles.actionButton,background:'#4B61D1'}}
                      >
                        <FaHeart size={16} style={{color:"#FF0000"}} />
                        <span style={{color:"#FFf",fontWeight:"500"}}>{item.likesCount || 0}</span>
                      </button>
                      
                      <button
                        onClick={() => handleComment(item.id)}
                        style={styles.actionButton}
                      >
                        <MessageCircle size={16} />
                        <span>{item.noOfComments || 0}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  
  // Header Styles
  header: {
    backgroundColor: 'white',
    padding: '32px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  headerIcon: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)',
    color: '#fff',
    padding: '16px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 8px 0',
    letterSpacing: '-0.025em',
  },
  headerSubtitle: {
    fontSize: '1.125rem',
    color: '#64748b',
    margin: '0 0 16px 0',
    fontWeight: '400',
  },
  statsContainer: {
    display: 'flex',
    gap: '24px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#fff',
    fontSize: '0.875rem',
    fontWeight: '500',
    background:'linear-gradient(135deg, #6366f1, #8b5cf6, #d946ef)',
    padding:"5px",
    borderRadius:"6px",
    fontWeight:'700'
  },

  // Search Section
  searchSection: {
    backgroundColor: 'white',
    padding: '24px 32px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 2,
    minWidth: '300px',
  },
  searchInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    color: '#94a3b8',
    zIndex: 1,
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 48px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: '#ffffff',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    fontWeight: '400',
  },
  clearButton: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease',
  },
  filterContainer: {
    flex: 1,
    minWidth: '200px',
  },
  filterWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  filterIcon: {
    position: 'absolute',
    left: '16px',
    color: '#94a3b8',
    zIndex: 1,
  },
  filterSelect: {
    width: '100%',
    padding: '12px 16px 12px 48px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    backgroundColor: '#ffffff',
    fontSize: '0.875rem',
    outline: 'none',
    cursor: 'pointer',
    fontWeight: '400',
  },

  // Main Content
  mainContent: {
    padding: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
  },

  // Loading State
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
  },
  loadingSpinner: {
    marginBottom: '24px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #f1f5f9',
    borderTop: '3px solid #475569',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingTitle: {
    fontSize: '1.5rem',
    color: '#1e293b',
    margin: '0 0 8px 0',
    fontWeight: '600',
  },
  loadingText: {
    color: '#64748b',
    fontSize: '1rem',
    margin: 0,
  },

  // Empty State
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
  },
  emptyIcon: {
    color: '#cbd5e1',
    marginBottom: '24px',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    color: '#1e293b',
    margin: '0 0 8px 0',
    fontWeight: '600',
  },
  emptyText: {
    color: '#64748b',
    fontSize: '1rem',
    margin: 0,
    maxWidth: '400px',
  },

  // Category Section
  categorySection: {
    marginBottom: '40px',
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    paddingBottom: '12px',
    borderBottom: '2px solid #e2e8f0',
  },
  categoryTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0,
  },
  categoryBadge: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '500',
  },

  // Items Grid
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  },

  // Item Card
  itemCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  cardHeader: {
    position: 'relative',
  },
  cardImageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.3s ease',
  },
  statusBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    backgroundColor: '#dc2626',
    color: 'white',
    padding: '6px 10px',
    borderRadius: '16px',
    fontSize: '0.75rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  likedButton:{
    backgroundcolor:"red"
  },
  cardBody: {
    padding: '20px',
  },
  itemTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#1e293b',
    margin: '0 0 8px 0',
    textTransform: 'capitalize',
  },
  itemDescription: {
    fontSize: '0.875rem',
    color: '#64748b',
    margin: '0 0 20px 0',
    lineHeight: '1.5',
    fontStyle: 'italic',
  },
  itemDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  detailRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  detailIcon: {
    backgroundColor: '#f8fafc',
    color: '#475569',
    padding: '8px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  detailText: {
    fontSize: '0.875rem',
    color: '#374151',
    fontWeight: '400',
  },

  // Card Actions
  cardActions: {
    display: 'flex',
    padding: '16px 20px',
    gap: '12px',
    borderTop: '1px solid #f1f5f9',
    backgroundColor: '#fafbfc',
  },
  actionButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    backgroundColor: 'white',
    color: '#374151',
    transition: 'all 0.2s ease',
  },
};

// CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  [style*="itemCard"]:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
  }
  
  [style*="cardImage"]:hover {
    transform: scale(1.05);
  }
  
  [style*="actionButton"]:hover {
    background-color: #f8fafc;
    border-color: #94a3b8;
    color: #1e293b;
  }
  
  [style*="searchInput"]:focus,
  [style*="filterSelect"]:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  [style*="clearButton"]:hover {
    color: #dc2626;
    background-color: #fef2f2;
  }
`;
document.head.appendChild(styleSheet);

export default LostItemsList;