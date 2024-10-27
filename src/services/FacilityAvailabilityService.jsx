import axios from "axios";

const REST_API_FACILITY_AVAILABILITY_URL = "http://localhost:8080/api/facility-availability/";

export const createAvailability = async (availability) => {
    try {
        const response = await axios.post(REST_API_FACILITY_AVAILABILITY_URL, availability);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error creating facility availability:", error);
        return { 
            success: false, 
            error: error.response?.data?.message || "An error occurred while creating facility availability.",
            status: error.response?.status || 500
        };
    }
};

export const updateAvailability = async (id, availability) => {
    try {
        const response = await axios.put(`${REST_API_FACILITY_AVAILABILITY_URL}${id}`, availability);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error updating facility availability:", error);
        return { 
            success: false, 
            error: error.response?.data?.message || "An error occurred while updating facility availability.",
            status: error.response?.status || 500
        };
    }
};

export const deleteAvailability = async (id) => {
    try {
        const response = await axios.delete(`${REST_API_FACILITY_AVAILABILITY_URL}${id}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error deleting facility availability:", error);
        return { 
            success: false, 
            error: error.response?.data?.message || "An error occurred while deleting facility availability.",
            status: error.response?.status || 500
        };
    }
};

export const getAvailabilityByFacility = async (facilityId) => {
    try {
        if (!facilityId) {
            throw new Error("Facility ID is required");
        }
        const response = await axios.get(`${REST_API_FACILITY_AVAILABILITY_URL}${facilityId}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching facility availability:", error);
        return { 
            success: false, 
            error: error.response?.data?.message || error.message || "An error occurred while fetching facility availability.",
            status: error.response?.status || 500
        };
    }
};

export const checkFacilityAvailability = async (facilityId, startTime, endTime) => {
    try {
        const response = await axios.get(`${REST_API_FACILITY_AVAILABILITY_URL}check`, {
            params: { facilityId, startTime, endTime }
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error checking facility availability:", error);
        return { 
            success: false, 
            error: error.response?.data?.message || "An error occurred while checking facility availability.",
            status: error.response?.status || 500
        };
    }
};

export const getAvailableTimeSlots = async (facilityId, startDate, endDate) => {
    try {
        const response = await axios.get(`${REST_API_FACILITY_AVAILABILITY_URL}slots`, {
            params: { facilityId, startDate, endDate }
        });
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching available time slots:", error);
        return { 
            success: false, 
            error: error.response?.data?.message || "An error occurred while fetching available time slots.",
            status: error.response?.status || 500
        };
    }
};
