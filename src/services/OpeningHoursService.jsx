import axios from "axios";

const REST_API_OPENING_HOURS_URL = "http://localhost:8080/api/opening-hours/";

export const createOpeningHours = async (openingHours) => {
    try {
        const response = await axios.post(REST_API_OPENING_HOURS_URL, openingHours);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error creating opening hours:", error);
        return { 
            success: false, 
            error: error.response?.data?.message || "An error occurred while creating opening hours.",
            status: error.response?.status || 500
        };
    }
};

export const updateOpeningHours = async (id, openingHours) => {
    try {
        const response = await axios.put(`${REST_API_OPENING_HOURS_URL}${id}`, openingHours);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error updating opening hours:", error);
        return { 
            success: false, 
            error: error.response?.data?.message || "An error occurred while updating opening hours.",
            status: error.response?.status || 500
        };
    }
};

export const deleteOpeningHours = async (id) => {
    try {
        const response = await axios.delete(`${REST_API_OPENING_HOURS_URL}${id}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error deleting opening hours:", error);
        return { 
            success: false, 
            error: error.response?.data?.message || "An error occurred while deleting opening hours.",
            status: error.response?.status || 500
        };
    }
};

export const getOpeningHoursByFacility = async (facilityId) => {
    try {
        const response = await axios.get(`${REST_API_OPENING_HOURS_URL}${facilityId}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching opening hours:", error);
        return { 
            success: false, 
            error: error.response?.data?.message || "An error occurred while fetching opening hours.",
            status: error.response?.status || 500
        };
    }
};

export const getAllOpeningHours = async () => {
    try {
        const response = await axios.get(REST_API_OPENING_HOURS_URL);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching all opening hours:", error);
        return { 
            success: false, 
            error: error.response?.data?.message || "An error occurred while fetching all opening hours.",
            status: error.response?.status || 500
        };
    }
};
