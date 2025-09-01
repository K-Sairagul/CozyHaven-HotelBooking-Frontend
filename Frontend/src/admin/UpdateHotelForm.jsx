import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Form, Button, Container, Alert, Spinner, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';

const UpdateHotelForm = () => {
  const { id } = useParams();
  
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    location: '',
    description: '',
    imageUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const { auth } = useAuth();
   const token = auth?.token;


  // Check for success message from navigation state
  useEffect(() => {
    if (location.state?.successMessage) {
      toast.success(location.state.successMessage);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        if (!id || isNaN(id)) {
          throw new Error('Invalid hotel ID');
        }

        const response = await axios.get(`https://localhost:7274/api/Hotel/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const { name, address, location, description, imageUrl } = response.data;
        
        setFormData({
          name,
          address,
          location,
          description: description || '',
          imageUrl
        });
      } catch (error) {
        console.error('Error fetching hotel:', error);
        setServerError(error.response?.data?.message || 'Failed to load hotel data');
        
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          navigate('/login');
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchHotel();
  }, [id, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Hotel name is required';
    } else if (formData.name.length < 3 || formData.name.length > 100) {
      newErrors.name = 'Name must be 3-100 characters';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.length > 200) {
      newErrors.address = 'Address too long (max 200 chars)';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (formData.description.length > 500) {
      newErrors.description = 'Description too long (max 500 chars)';
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else if (!/^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)(\?.*)?$/i.test(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid image URL (jpg, png, etc.)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setServerError('');

  if (!validateForm()) {
    return;
  }

  setIsLoading(true);
  console.log("Token being used:", token);

  try {
    await axios.put(
      `https://localhost:7274/api/Hotel/${id}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    toast.success('Hotel updated successfully! Redirecting...', {
      autoClose: 4000
    });

    // ⏳ Wait for 5 seconds before redirecting
    setTimeout(() => {
      navigate("/userdashboard/dashboard/allhotels", { replace: true });
    }, 5000);

  } catch (error) {
    console.error('Error updating hotel:', error);
    const errorMessage = error.response?.data?.message ||
      error.response?.data?.title ||
      'Failed to update hotel. Please try again.';

    setServerError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setIsLoading(false);
  }
};


  if (isFetching) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (serverError && !isFetching) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{serverError}</Alert>
        <Button variant="secondary" onClick={() => navigate('/hotels')}>
          Back to Hotels List
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5" style={{ maxWidth: '800px' }}>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title className="mb-4 text-center">Update Hotel Information</Card.Title>
          
          {serverError && <Alert variant="danger" className="mb-4">{serverError}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Hotel Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
                placeholder="Enter hotel name (3-100 characters)"
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Address *</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                isInvalid={!!errors.address}
                placeholder="Enter full address (max 200 characters)"
              />
              <Form.Control.Feedback type="invalid">
                {errors.address}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Location *</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                isInvalid={!!errors.location}
                placeholder="Enter location (city, region, etc.)"
              />
              <Form.Control.Feedback type="invalid">
                {errors.location}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                isInvalid={!!errors.description}
                placeholder="Enter hotel description (max 500 characters)"
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
              <Form.Text className={formData.description.length > 500 ? 'text-danger' : 'text-muted'}>
                {formData.description.length}/500 characters
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>Image URL *</Form.Label>
              <Form.Control
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                isInvalid={!!errors.imageUrl}
                placeholder="Enter image URL (jpg, png, etc.)"
              />
              <Form.Control.Feedback type="invalid">
                {errors.imageUrl}
              </Form.Control.Feedback>
              {formData.imageUrl && (
                <div className="mt-3 text-center">
                  <img 
                    src={formData.imageUrl} 
                    alt="Hotel preview" 
                    className="img-fluid rounded"
                    style={{ maxHeight: '200px' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Available';
                    }}
                  />
                </div>
              )}
            </Form.Group>
            
            <div className="d-flex justify-content-between mt-4">
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate(`/hotels/${id}`)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isLoading}
                className="px-4"
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Updating...
                  </>
                ) : 'Update Hotel'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UpdateHotelForm;