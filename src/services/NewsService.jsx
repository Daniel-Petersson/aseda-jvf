import axios from "axios";

const REST_API_NEWS_URL = "http://localhost:8080/api/news/";

export const createNews = async (news) => {
    try {
        const response = await axios.post(REST_API_NEWS_URL, news);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error creating news:", error);
        return { 
            success: false, 
            error: error.response?.data?.message || "An error occurred while creating the news.",
            status: error.response?.status || 500
        };
    }
};

export const updateNews = async (newsId, news) => {
    try {
        const response = await axios.put(`${REST_API_NEWS_URL}${newsId}/`, news);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error updating news:", error);
        return { 
            success: false, 
            error: error.response?.data?.message || "An error occurred while updating the news.",
            status: error.response?.status || 500
        };
    }
};

export const deleteNews = async (newsId) => {
    try {
        const response = await axios.delete(`${REST_API_NEWS_URL}${newsId}`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error deleting news:", error);
        return { 
            success: false, 
            error: error.response?.data?.message || "An error occurred while deleting the news.",
            status: error.response?.status || 500
        };
    }
};

export const getNewsById = async (newsId) => {
    try {
        const response = await axios.get(`${REST_API_NEWS_URL}${newsId}/`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error getting news:", error);
        return { 
            success: false, 
            error: error.response?.data?.message || "An error occurred while getting the news.",
            status: error.response?.status || 500
        };
    }
};

export const getAllNews = async () => {
    try {
        const response = await axios.get(REST_API_NEWS_URL);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error getting all news:", error);
        return { 
            success: false, 
            error: error.response?.data?.message || "An error occurred while getting all news.",
            status: error.response?.status || 500
        };
    }
};
