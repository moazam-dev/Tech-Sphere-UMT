import React, { useState } from 'react';
import './LostItemForm.css'
import  uploadImageToCloudinary from "./cloudinaryImageUpload.js"
import {
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Modal,
  Fade,
  Backdrop,
} from '@mui/material';
import './LostItemForm.css';

const LostItemReportForm = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    location: '',
    contactInfo: '',
    itemCategory: '',
    image: null,
    imageUrl: '', // Holds the Cloudinary image URL
    acceptedTerms: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showLocationButton, setShowLocationButton] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  // Upload image to Cloudinary and get the URL
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for missing fields
    if (
      !formData.itemName ||
      !formData.description ||
      !formData.contactInfo ||
      !formData.location ||
      !formData.itemCategory ||
      !formData.acceptedTerms
    ) {
      setModalMessage('Please fill all the required fields and accept the terms.');
      setIsModalOpen(true);
      return;
    }

    let imageUrl = '';
    console.log('image user uploaeded',formData.image);
    
    // If an image is selected, upload it to Cloudinary and get the URL
    if (formData.image) {
      try {
        imageUrl = await uploadImageToCloudinary(formData.image);
        console.log('image uploaded to cloudinary',imageUrl);
      } catch (error) {
        setModalMessage('Image upload failed. Please try again.');
        setIsModalOpen(true);
        return;
      }
    }
  const uID=parseInt(localStorage.uID)
    // Prepare form data to send to the server
    const formDataToSend = {
      itemName: formData.itemName,
      description: formData.description,
      location: formData.location,
      contactInfo: formData.contactInfo,
      itemCategory: formData.itemCategory,
      acceptedTerms: formData.acceptedTerms,
      imageUrl, // Send the image URL instead of the file
      uID
    };

    try {
      const response = await fetch('http://localhost:5000/report-lost-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend), // Send as JSON
      });

      const result = await response.json();

      if (response.ok) {
        setModalMessage('Item Reported Successfully!');
        setIsModalOpen(true);

        // Reset the form after successful submission
        setFormData({
          itemName: '',
          description: '',
          location: '',
          contactInfo: '',
          itemCategory: '',
          image: null,
          imageUrl: '', // Reset the image URL
          acceptedTerms: false,
        });
        setShowLocationButton(false); // Reset button visibility
      } else {
        setModalMessage(result.message || 'Error reporting item.');
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      setModalMessage('Failed to report the item. Please try again.');
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = `Lat: ${latitude}, Lng: ${longitude}`;
          setFormData({
            ...formData,
            location,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="formWrapper" style={{
      marginTop:"50px"
    }}>
    <div className="form-container">
      <Typography variant="h4" gutterBottom align="center">Report Lost Item</Typography>

      <div className="image-upload-container">
        <input
          type="file"
          accept="image/*"
          id="image-upload"
          className="image-upload-input"
          onChange={handleFileChange}
        />
        <div className="image-preview-container">
          {formData.image ? (
            <img
              src={URL.createObjectURL(formData.image)}
              alt="Lost Item"
              className="image-preview"
            />
          ) : (
            <Typography variant="body1" color="textSecondary">Upload Image</Typography>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-fields">
        <TextField
          label="Item Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="itemName"
          value={formData.itemName}
          onChange={handleChange}
          required
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          multiline
          rows={4}
        />
        <TextField
          label="Location"
          variant="outlined"
          fullWidth
          margin="normal"
          name="location"
          value={formData.location}
          onChange={handleChange}
          onFocus={() => setShowLocationButton(true)}
          required
        />
        {showLocationButton && (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleGetLocation}
            style={{ marginBottom: '10px' }}
          >
            Use My Current Location
          </Button>
        )}
        <TextField
          label="Contact Information"
          variant="outlined"
          fullWidth
          margin="normal"
          name="contactInfo"
          value={formData.contactInfo}
          onChange={handleChange}
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Item Category</InputLabel>
          <Select
            name="itemCategory"
            value={formData.itemCategory}
            onChange={handleChange}
            label="Item Category"
          >
           <MenuItem value="electronics">Electronics</MenuItem>
<MenuItem value="clothing">Clothing</MenuItem>
<MenuItem value="bags">Bags</MenuItem>
<MenuItem value="backpacks">Backpacks</MenuItem>
<MenuItem value="accessories">Accessories</MenuItem>
<MenuItem value="jewelry">Jewelry</MenuItem>
<MenuItem value="books">Books</MenuItem>
<MenuItem value="stationery">Stationery</MenuItem>
<MenuItem value="keys">Keys</MenuItem>
<MenuItem value="documents">Documents</MenuItem>
<MenuItem value="id cards">ID Cards</MenuItem>
<MenuItem value="wallets">Wallets</MenuItem>
<MenuItem value="purses">Purses</MenuItem>
<MenuItem value="mobile phones">Mobile Phones</MenuItem>
<MenuItem value="eyewear">Eyewear</MenuItem>
<MenuItem value="sunglasses">Sunglasses</MenuItem>
<MenuItem value="laptops">Laptops</MenuItem>
<MenuItem value="tablets">Tablets</MenuItem>
<MenuItem value="personal items">Personal Items</MenuItem>
<MenuItem value="sports equipment">Sports Equipment</MenuItem>
<MenuItem value="toys">Toys</MenuItem>
<MenuItem value="games">Games</MenuItem>
<MenuItem value="musical instruments">Musical Instruments</MenuItem>
<MenuItem value="umbrellas">Umbrellas</MenuItem>
<MenuItem value="tools">Tools</MenuItem>
<MenuItem value="cash">Cash</MenuItem>
<MenuItem value="pets">Pets</MenuItem>
<MenuItem value="others">Others</MenuItem>

          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={formData.acceptedTerms}
              onChange={handleChange}
              name="acceptedTerms"
              color="primary"
            />
          }
          label="I accept the terms and conditions"
          required
        />

        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </form>

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{ timeout: 500 }}
      >
        <Fade in={isModalOpen}>
          <Box
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <Typography variant="h6" gutterBottom>
              {modalMessage}
            </Typography>
            <Button onClick={closeModal} variant="contained" color="primary">
              Close
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
    </div>
  );
};

export default LostItemReportForm;
