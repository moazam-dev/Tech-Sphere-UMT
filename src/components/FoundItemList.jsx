import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Stack,
  Divider,
  Paper,
} from '@mui/material';
import { AiFillHeart } from 'react-icons/ai';
import { FaCommentDots, FaBoxOpen } from 'react-icons/fa';
import { MdOutlineSearch } from 'react-icons/md';

const API_BASE = 'http://localhost:5000/api';

const FoundItemList = () => {
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
          `${API_BASE}/found-items?search=${encodeURIComponent(search)}&range=${encodeURIComponent(dateRange)}`
        );
        const data = await response.json();
        console.log(data);
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
      const result = await fetch(`${API_BASE}/found-likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foundItemId:itemId, userId: parseInt(localStorage.uID) }),
      });
      const response = await result.json();
      console.log(response);
      if (response.message === 'Already liked') return;
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
    const text = prompt('Add a comment:');
    if (!text) return;
    try {
      await fetch(`${API_BASE}/found-comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foundItemId:itemId, userId: parseInt(localStorage.uID), commentText: text }),
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
    <Box sx={{ p: { xs: 2, md: 4 }, mt: 5, backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
      <Paper elevation={0} sx={{ p: 4, mb: 4, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, '&:hover': { boxShadow: 4 } }}>
        <FaBoxOpen size={40} style={{ color: '#1976d2' }} />
        <Box>
          <Typography variant="h5" fontWeight={600}>Found Items Directory</Typography>
          <Typography color="text.secondary">View all reported found items. Use search and filters to narrow your view or help identify owners.</Typography>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, '&:hover': { boxShadow: 2 } }}>
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Search by name, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <MdOutlineSearch style={{ marginRight: 8 }} />,
            }}
          />
          <TextField
            select
            fullWidth
            label="Filter by date"
            variant="outlined"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            size="small"
          >
            <MenuItem value="">All Time</MenuItem>
            <MenuItem value="24h">Last 24 Hours</MenuItem>
            <MenuItem value="week">Last Week</MenuItem>
            <MenuItem value="month">Last Month</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {loading ? (
        <Box textAlign="center" mt={6}><CircularProgress /></Box>
      ) : Object.keys(grouped).length === 0 ? (
        <Typography variant="h6" align="center">No found items to display.</Typography>
      ) : (
        Object.entries(grouped).map(([category, itemsInCategory]) => (
          <Box key={category} sx={{ mb: 6, backgroundColor: '#FFF', p: 2, border: '1px solid #EEE' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#444' }}>
              {category}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: { xs: 'center', md: 'flex-start' },
                gap: 3,
              }}
            >
              {itemsInCategory.map((item) => (
                <Card
                  key={item.id}
                  sx={{
                    width: 280,
                    minHeight: 420,
                    borderRadius: 2,
                    overflow: 'hidden',
                    transition: '0.3s',
                    backgroundColor: 'white',
                    boxShadow: 'none',
                    border: '1px solid #EEE',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      transform: 'scale(1.015)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="160"
                    image={item.image || '/no-image.png'}
                    alt={item.itemName}
                    sx={{ objectFit: 'cover', backgroundColor: '#f5f5f5' }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{item.itemName.toUpperCase()}</Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontStyle: 'italic', mb: 1 }}
                      color="text.secondary"
                    >
                      “{item.description}”
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Typography variant="body2"><strong>Finder:</strong> {item.firstName} {item.lastName}</Typography>
                    <Typography variant="body2"><strong>Location:</strong> {item.location}</Typography>
                    <Typography variant="body2"><strong>Contact:</strong> {item.contactInfo}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" mt={1}>
                      Reported: {new Date(item.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>

                  <Box sx={{ px: 2, pb: 2 }}>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleLike(item.id)}
                        sx={{ flex: 1, borderRadius: 2 }}
                        startIcon={<AiFillHeart />}
                      >
                        {item.likesCount}
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleComment(item.id)}
                        sx={{ flex: 1, borderRadius: 2 }}
                        startIcon={<FaCommentDots />}
                      >
                        {item.noOfComments}
                      </Button>
                    </Stack>
                  </Box>
                </Card>
              ))}
            </Box>
          </Box>
        ))
      )}
    </Box>
  );
};

export default FoundItemList;
