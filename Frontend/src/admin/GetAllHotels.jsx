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
  Tooltip
} from 'react-bootstrap';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaHotel, 
  FaEdit, 
  FaTrash, 
  FaEye,
  FaPlus 
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
        const response = await axios.get('https://localhost:7274/api/hotel');
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
      await axios.delete(`https://localhost:7274/api/hotel/${hotelToDelete}`, {
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
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 d-flex align-items-center">
          <FaHotel className="me-2" /> Our Hotels
        </h2>
        <Button 
          variant="primary" 
          onClick={() => navigate('/userdashboard/dashboard/addhotel')}
          className="d-flex align-items-center"
        >
          <FaPlus className="me-1" /> Add Hotel
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="bg-light p-4 rounded mb-4">
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Search Hotels</Form.Label>
              <div className="input-group">
                <span className="input-group-text"><FaSearch /></span>
                <Form.Control
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Filter by Location</Form.Label>
              <div className="input-group">
                <span className="input-group-text"><FaMapMarkerAlt /></span>
                <Form.Control
                  type="text"
                  placeholder="Enter location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
      </div>

      {/* Hotel Count */}
      <div className="mb-3">
        {filteredHotels.length} {filteredHotels.length === 1 ? 'hotel' : 'hotels'} found
      </div>

      {/* Hotel Grid */}
      {Array.isArray(filteredHotels) && filteredHotels.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredHotels.map((hotel) => (
            <Col key={hotel.hotelId}>
              <Card className="h-100 hover-shadow">
                <Link to={`/hotels/${hotel.hotelId}`} className="text-decoration-none">
                  <Card.Img
                    variant="top"
                    src={hotel.imageUrl}
                    alt={hotel.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Hotel+Image';
                    }}
                    className="cursor-pointer"
                  />
                </Link>
                <Card.Body>
                  <Link to={`/hotels/${hotel.hotelId}`} className="text-decoration-none text-dark">
                    <Card.Title>{hotel.name}</Card.Title>
                    <div className="d-flex align-items-center mb-2">
                      <FaMapMarkerAlt className="me-2 text-muted" />
                      <span className="text-muted">{hotel.location}</span>
                    </div>
                    <Card.Text className="text-truncate">
                      {hotel.description || 'No description available'}
                    </Card.Text>
                  </Link>
                </Card.Body>
                <Card.Footer className="bg-white">
                  <ButtonGroup className="w-100">
                    <OverlayTrigger overlay={<Tooltip>View Details</Tooltip>}>
                      <Link 
                        to={`/hotels/${hotel.hotelId}`}
                        className="btn btn-outline-primary"
                      >
                        <FaEye />
                      </Link>
                    </OverlayTrigger>
                    
                    <OverlayTrigger overlay={<Tooltip>Edit Hotel</Tooltip>}>
                      <Link
                         to={`/hotels/update/${hotel.hotelId}`}
                        className="btn btn-outline-warning"
                      >
                        <FaEdit />
                      </Link>
                    </OverlayTrigger>
                    
                    <OverlayTrigger overlay={<Tooltip>Delete Hotel</Tooltip>}>
                      <Button
                        variant="outline-danger"
                        onClick={(e) => {
                          e.preventDefault();
                          confirmDelete(hotel.hotelId);
                        }}
                      >
                        <FaTrash />
                      </Button>
                    </OverlayTrigger>
                  </ButtonGroup>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center">
          No hotels found matching your criteria.
        </Alert>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this hotel? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default HotelList;