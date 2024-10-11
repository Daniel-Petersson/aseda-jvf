import axios from 'axios';

const API_URL = 'http://localhost:8080/api/facility/';

const FacilityService = {
  getAllFacilities: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching facilities:', error);
      throw error;
    }
  },

  getFacilityById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching facility by ID:', error);
      throw error;
    }
  },

  getFacilityByName: async (name) => {
    try {
      const response = await axios.get(`${API_URL}facilityName`, { params: { name } });
      return response.data;
    } catch (error) {
      console.error('Error fetching facility by name:', error);
      throw error;
    }
  }
};

export default FacilityService;
