import axios from "axios";

const REST_API_MEMBER_URL = "http://localhost:8080/api/members/";

const prepareMemberData = (member) => {
    const { confirmPassword, ...filteredData } = member;
    // Only include password if it's not empty
    if (!filteredData.password) {
        delete filteredData.password;
    }
    return filteredData;
};

export const registerMember = async (member) => {
    try {
        const response = await axios.post(REST_API_MEMBER_URL, member);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error registering member:", error);
        return { 
            success: false, 
            error: error.response?.data?.message || "An error occurred while registering the member.",
            status: error.response?.status || 500
        };
    }
};

export const authenticateMember = async (member) => {
    try {
        const response = await axios.post(`${REST_API_MEMBER_URL}authenticate`, member);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error authenticating member:", error);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Response status:", error.response.status);
            return { 
                success: false, 
                error: error.response.data.message || "An error occurred while authenticating the member.",
                status: error.response.status 
            };
        } else {
            return { 
                success: false, 
                error: "An error occurred while authenticating the member.",
                status: 500 // Internal Server Error
            };
        }
    }
};

export const getMember = async (memberId) => {
    try {
        const response = await axios.get(`${REST_API_MEMBER_URL}${memberId}/`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error getting member:", error);
        return { 
            success: false, 
            error: "An error occurred while getting the member.",
            status: 500 // Internal Server Error
        };
    return response.data;
};
};

export const updateMember = async (memberId, member) => {
    try {
        const preparedData = prepareMemberData(member);
        console.log("Updating member with ID:", memberId);
        console.log("Data being sent:", preparedData);

        const response = await axios.put(`${REST_API_MEMBER_URL}${memberId}`, preparedData);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error updating member:", error);
        return { 
            success: false, 
            error: "An error occurred while updating the member.",
            status: error.response?.status || 500
        };
    }
};

export const deleteMember = async (memberId) => {
    try {   
        const response = await axios.delete(`${REST_API_MEMBER_URL}${memberId}/remove`);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error deleting member:", error);
        return { 
            success: false, 
            error: "An error occurred while deleting the member.",
            status: 500 // Internal Server Error
        };
    }
};

export const getAllMembers = async () => {
    try {
        const response = await axios.get(REST_API_MEMBER_URL);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Error fetching members:", error);
        return { 
            success: false, 
            error: "An error occurred while fetching members.",
            status: 500 // Internal Server Error
        };
    }
};

