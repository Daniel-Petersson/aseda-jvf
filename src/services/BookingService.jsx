import axios from 'axios';

// Define the base URL for the booking API
const API_URL = 'http://localhost:8080/api/bookings/';

export const getAllBookings = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const getBooking = async (id) => {
  try {
    if (!id) {
      throw new Error('Booking ID is required');
    }
    const response = await axios.get(`${API_URL}${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching booking details:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch booking details',
      status: error.response?.status || 500
    };
  }
};

export const createBooking = async (bookingData, token) => {
  try {
    const response = await axios.post(API_URL, bookingData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error creating booking:', error);
    console.error('Error response:', error.response ? JSON.stringify(error.response.data, null, 2) : 'No response data');
    return handleErrorResponse(error);
  }
};

export const updateBooking = async (bookingId, bookingData, token) => {
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
};

export const deleteBooking = async (bookingId, token) => {
  try {
    const response = await axios.delete(`${API_URL}${bookingId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error deleting booking:', error);
    console.error('Error response:', error.response ? JSON.stringify(error.response.data, null, 2) : 'No response data');
    return handleErrorResponse(error);
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
