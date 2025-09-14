import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Modal, Spinner, Alert } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const DeleteRoomButton = ({ roomId, onDeleteSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    
    try {
      const response = await axios.delete(
        `https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/Room/${roomId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 204) {
        // Success case
        if (onDeleteSuccess) {
          onDeleteSuccess(roomId);
        }
        setShowModal(false);
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Delete error:', error);
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError('You are not authorized to delete this room');
            navigate('/login');
            break;
          case 404:
            setError('Room not found');
            break;
          default:
            setError(error.response.data?.message || 'Failed to delete room');
        }
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button 
        variant="outline-danger" 
        size="sm"
        onClick={() => setShowModal(true)}
      >
        <FaTrash /> Delete
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <p>Are you sure you want to delete this room? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowModal(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Deleting...
              </>
            ) : 'Delete Room'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteRoomButton;