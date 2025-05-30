import React, { useState,useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Paper,
  Stack,
  Avatar,
  IconButton,
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import uploadImageToCloudinary from './cloudinaryImageUpload.js';

const categories = [
  'Electronics', 'Clothing', 'Bags', 'Backpacks', 'Accessories',
  'Jewelry', 'Books', 'Stationery', 'Keys', 'Documents', 'ID Cards',
  'Wallets', 'Purses', 'Mobile Phones', 'Eyewear', 'Sunglasses',
  'Laptops', 'Tablets', 'Personal Items', 'Sports Equipment',
  'Toys', 'Games', 'Musical Instruments', 'Umbrellas', 'Tools',
  'Cash', 'Pets', 'Others',
];
const API_BASE = 'http://localhost:5000/api';

const FoundItem = () => {
  useEffect(()=>{
    window.scrollTo(0,0)
    },[])
  const [form, setForm] = useState({
    itemName: '',
    description: '',
    location: '',
    itemCategory: '',
    contactInfo: '',
    imageUrl: '',
  });

  const [rawImage, setRawImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showLocationBtn, setShowLocationBtn] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRawImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleLocationFocus = () => {
    setShowLocationBtn(true);
  };

  const handleUseCurrentLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((prev) => ({
          ...prev,
          location: `Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`
        }));
      },
      (err) => alert('Location error: ' + err.message)
    );
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem('uID');
    if (!userId) return alert('User ID not found in localStorage.');

    const { itemName, description, location, itemCategory, contactInfo } = form;
    if (!itemName || !description || !location || !itemCategory || !contactInfo) {
      return alert('Please fill all required fields.');
    }

    setSubmitting(true);
    try {
      let imageUrl = '';
      if (rawImage) {
        imageUrl = await uploadImageToCloudinary(rawImage);
      }

      const res = await fetch(`${API_BASE}/report-found-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId, imageUrl }),
      });

      if (!res.ok) throw new Error('Failed to submit');

      alert('Found item reported successfully!');
      setForm({
        itemName: '',
        description: '',
        location: '',
        itemCategory: '',
        contactInfo: '',
        imageUrl: '',
      });
      setRawImage(null);
      setImagePreview(null);
      setShowLocationBtn(false);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Report a Found Item
      </Typography>

      <Box display="flex" justifyContent="center" mb={3}>
        <input
          accept="image/*"
          type="file"
          id="upload-image"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        <label htmlFor="upload-image">
          <IconButton
            component="span"
            sx={{
              width: 130,
              height: 130,
              borderRadius: '50%',
              border: '2px dashed #1976d2',
              overflow: 'hidden',
              bgcolor: '#f0f0f0',
              '&:hover': { bgcolor: '#e0e0e0' },
            }}
          >
            {imagePreview ? (
              <Avatar src={imagePreview} alt="Preview" sx={{ width: 126, height: 126 }} />
            ) : (
              <PhotoCameraIcon sx={{ fontSize: 40, color: '#1976d2' }} />
            )}
          </IconButton>
        </label>
      </Box>

      <Stack spacing={2}>
        <TextField
          label="Item Name"
          name="itemName"
          value={form.itemName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Description"
          name="description"
          multiline
          rows={4}
          value={form.description}
          onChange={handleChange}
          required
        />
        <TextField
          label="Location Found"
          name="location"
          value={form.location}
          onChange={handleChange}
          onFocus={handleLocationFocus}
          required
        />
        {showLocationBtn && (
          <Button variant="outlined" size="small" onClick={handleUseCurrentLocation}>
            Use Current Location
          </Button>
        )}
        <TextField
          select
          label="Category"
          name="itemCategory"
          value={form.itemCategory}
          onChange={handleChange}
          required
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Contact Info (email or phone)"
          name="contactInfo"
          value={form.contactInfo}
          onChange={handleChange}
          required
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Found Item'}
        </Button>
      </Stack>
    </Paper>
  );
};

export default FoundItem;
