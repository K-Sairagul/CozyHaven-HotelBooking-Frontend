import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Spinner, 
  Alert, 
  Form, 
  Button, 
  Modal,
  ButtonGroup,
  OverlayTrigger,
  Tooltip,
  Badge
} from 'react-bootstrap';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaHotel, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaPlus,
  FaStar,
  FaBed,
  FaMoneyBillWave
} from 'react-icons/fa';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get('https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/hotel');
        const hotelData = Array.isArray(response.data) ? response.data : [];
        setHotels(hotelData);
        setFilteredHotels(hotelData);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError('Failed to load hotels. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  useEffect(() => {
    let results = hotels;

    if (searchTerm) {
      results = results.filter(hotel =>
        hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      results = results.filter(hotel =>
        hotel.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredHotels(results);
  }, [searchTerm, locationFilter, hotels]);

  const handleDelete = async () => {
    try {
      await axios.delete(`https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/hotel/${hotelToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setHotels(hotels.filter(hotel => hotel.hotelId !== hotelToDelete));
      setFilteredHotels(filteredHotels.filter(hotel => hotel.hotelId !== hotelToDelete));
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Error deleting hotel:', err);
      setError('Failed to delete hotel. Please try again.');
    }
  };

  const confirmDelete = (hotelId) => {
    setHotelToDelete(hotelId);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2 text-muted">Loading hotels...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="d-flex align-items-center">
          <FaHotel className="me-2" />
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div className="d-flex align-items-center">
          <FaHotel className="me-2 text-primary fs-3" />
          <h2 className="mb-0 fw-bold">Our Hotels</h2>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/userdashboard/dashboard/addhotel')}
          className="d-flex align-items-center"
        >
          <FaPlus className="me-2" /> Add New Hotel
        </Button>
      </div>

      {/* Search & Filter Section */}
      <Card className="shadow-sm mb-4 border-0">
        <Card.Body className="p-4">
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Search Hotels</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaSearch className="text-muted" />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-start-0"
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label className="fw-semibold">Filter by Location</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <FaMapMarkerAlt className="text-muted" />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Enter location..."
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="border-start-0"
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Results Count */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="text-muted mb-0">
          Showing <span className="fw-semibold">{filteredHotels.length}</span> {filteredHotels.length === 1 ? 'hotel' : 'hotels'}
        </p>
        {(searchTerm || locationFilter) && (
          <Button 
            variant="outline-secondary" 
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setLocationFilter('');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Hotel Grid */}
      {Array.isArray(filteredHotels) && filteredHotels.length > 0 ? (
        <Row xs={1} sm={2} lg={3} className="g-4">
          {filteredHotels.map((hotel) => (
            <Col key={hotel.hotelId}>
              <Card className="h-100 shadow-sm border-0 hotel-card">
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop'}
                    alt={hotel.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop';
                    }}
                    className="hotel-image"
                  />
                  <Badge bg="primary" className="position-absolute top-0 end-0 m-2">
                    <FaStar className="me-1" /> {hotel.rating || '4.5'}
                  </Badge>
                </div>
                
                <Card.Body className="d-flex flex-column">
                  <div className="mb-2">
                    <Card.Title className="h5 text-truncate">{hotel.name}</Card.Title>
                    <div className="d-flex align-items-center text-muted mb-2">
                      <FaMapMarkerAlt className="me-1" />
                      <small>{hotel.location || 'Location not specified'}</small>
                    </div>
                    <Card.Text className="text-muted small line-clamp-2">
                      {hotel.description || 'No description available for this hotel.'}
                    </Card.Text>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <FaBed className="me-1 text-primary" />
                        <small className="text-muted">{hotel.roomCount || '10'} rooms</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaMoneyBillWave className="me-1 text-success" />
                        <strong className="text-success">${hotel.price || '120'}/night</strong>
                      </div>
                    </div>
                    
                    <div className="d-grid gap-2 d-md-flex">
                      <OverlayTrigger overlay={<Tooltip>View Details</Tooltip>}>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          className="d-flex align-items-center flex-grow-1"
                          as={Link}
                          to={`/hotels/${hotel.hotelId}`}
                        >
                          <FaEye className="me-1" /> View
                        </Button>
                      </OverlayTrigger>
                      
                      <OverlayTrigger overlay={<Tooltip>Edit Hotel</Tooltip>}>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="d-flex align-items-center flex-grow-1"
                          as={Link}
                          to={`/hotels/update/${hotel.hotelId}`}
                        >
                          <FaEdit className="me-1" /> Edit
                        </Button>
                      </OverlayTrigger>
                      
                      <OverlayTrigger overlay={<Tooltip>Delete Hotel</Tooltip>}>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="d-flex align-items-center flex-grow-1"
                          onClick={() => confirmDelete(hotel.hotelId)}
                        >
                          <FaTrash className="me-1" /> Delete
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Card className="text-center py-5 border-0 shadow-sm">
          <Card.Body>
            <FaHotel className="display-4 text-muted mb-3" />
            <h5 className="text-muted">No hotels found</h5>
            <p className="text-muted mb-0">
              {searchTerm || locationFilter 
                ? 'Try adjusting your search or filter criteria' 
                : 'No hotels available at the moment'}
            </p>
          </Card.Body>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <FaTrash className="me-2 text-danger" /> Confirm Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this hotel? This action cannot be undone.</p>
          <p className="text-muted small">
            All associated rooms and bookings will also be removed.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <FaTrash className="me-1" /> Delete Hotel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom CSS for better responsiveness */}
      <style jsx>{`
        .hotel-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hotel-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
        }
        .hotel-image {
          transition: transform 0.3s ease;
        }
        .hotel-card:hover .hotel-image {
          transform: scale(1.05);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .d-md-flex {
            flex-direction: column;
            gap: 0.5rem;
          }
          .d-md-flex .btn {
            width: 100%;
          }
        }
      `}</style>
    </Container>
  );
};

export default HotelList;