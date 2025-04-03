import React, { useState } from 'react';

import './ContactUs.css'; // for styling

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', formData);
    setSubmitted(true);
  };

  return (
    <div className="contact-us-container">
      {!submitted ? (
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Contact Us</h2>

          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn" onClick={()=>{
            fetch(`https://ubtech-ecommerce-store-default-rtdb.firebaseio.com/users.json`, {
              method: 'POST', // 'POST' to push new data, 'PUT' if you want to set data at a specific location
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData) // Convert the data to JSON format before sending
            }).then((response)=>{
              console.log("successfully added to db");
              

            }).catch(console.log)
          }}>Submit</button>
        </form>
      ) : (
        <div className="thank-you-message">
          <h3>Thank you for contacting us!</h3>
          <p>We will get back to you as soon as possible.</p>
        </div>
      )}
    </div>
  );
};

export default Contact;
