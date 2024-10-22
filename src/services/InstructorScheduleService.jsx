import axios from 'axios';

const API_URL = 'http://localhost:8080/api/instructor-schedules';

export const createSchedule = async (scheduleData) => {
  try {
    console.log('Creating instructor schedule with data:', scheduleData);
    const response = await axios.post(API_URL, scheduleData);
    console.log('Instructor schedule creation response:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error creating instructor schedule:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'An error occurred while creating the instructor schedule.',
      status: error.response?.status || 500,
      details: error.response?.data || error.message
    };
  }
};

export const updateSchedule = async (id, scheduleData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, scheduleData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error updating instructor schedule:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'An error occurred while updating the instructor schedule.',
      status: error.response?.status || 500
    };
  }
};

export const deleteSchedule = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting instructor schedule:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'An error occurred while deleting the instructor schedule.',
      status: error.response?.status || 500
    };
  }
};

export const getScheduleById = async (id) => {
  try {
    if (!id) {
      throw new Error('Schedule ID is required');
    }
    const response = await axios.get(`${API_URL}/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching instructor schedule by ID:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'An error occurred while fetching the instructor schedule by ID.',
      status: error.response?.status || 500
    };
  }
};

export const getSchedulesByInstructor = async (instructorId) => {
  try {
    const response = await axios.get(`${API_URL}/instructor/${instructorId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching schedules by instructor:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'An error occurred while fetching schedules by instructor.',
      status: error.response?.status || 500
    };
  }
};

export const getSchedulesByFacility = async (facilityId) => {
  try {
    const response = await axios.get(`${API_URL}/facility/${facilityId}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching schedules by facility:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'An error occurred while fetching schedules by facility.',
      status: error.response?.status || 500
    };
  }
};

export const getAllSchedules = async () => {
  try {
    const response = await axios.get(API_URL);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching all instructor schedules:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'An error occurred while fetching all instructor schedules.',
      status: error.response?.status || 500
    };
  }
};
