import axios from 'axios';

const API_URL = 'http://localhost:8080/api/facility/';

export const getAllFacilities = async () => {
  try {
    const response = await axios.get(API_URL);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'An error occurred while fetching facilities.',
      status: error.response?.status || 500
    };
  }
};

export const getFacilityById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching facility by ID:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'An error occurred while fetching the facility by ID.',
      status: error.response?.status || 500
    };
  }
};

export const getFacilityByName = async (name) => {
  try {
    const response = await axios.get(`${API_URL}facilityName`, { params: { name } });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching facility by name:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'An error occurred while fetching the facility by name.',
      status: error.response?.status || 500
    };
  }
};
