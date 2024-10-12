import axios from 'axios';

// Define the base URL for the booking API
const API_URL = 'http://localhost:8080/api/bookings/';

const BookingService = {
  getAllBookings: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  getBooking: async (bookingId) => {
    try {
      const response = await axios.get(`${API_URL}${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  },

  createBooking: async (bookingData) => {
    try {
      const response = await axios.post(API_URL, bookingData);
      return { success: true, data: response.data };
    } catch (error) {
      return handleErrorResponse(error);
    }
  },

  updateBooking: async (bookingId, bookingData, token) => {
    try {
      const response = await axios.put(`${API_URL}${bookingId}`, bookingData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return { success: true, data: response.data };
    } catch (error) {
      return handleErrorResponse(error);
    }
  },

  deleteBooking: async (bookingId, token) => {
    try {
      await axios.delete(`${API_URL}${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  }
};

const handleErrorResponse = (error) => {
  if (error.response) {
    return {
      success: false,
      error: error.response.data,
      status: error.response.status
    };
  } else if (error.request) {
    return {
      success: false,
      error: 'Ingen respons från servern. Vänligen försök igen senare.',
      status: null
    };
  } else {
    return {
      success: false,
      error: 'Ett oväntat fel inträffade. Vänligen försök igen.',
      status: null
    };
  }
};

export default BookingService;
