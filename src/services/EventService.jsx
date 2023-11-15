/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import ApiClient, { axiosAPI } from "./axiosClient";
import { formatErrorResponse, formatSuccessResponse } from "utils";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import config from "../config";

const axiosCall = config.PROXY_API ? axiosAPI : ApiClient;
const ApiPath = `/events`;

const EventService = {
    fetchEvents: async (locality=null, page=1, limit=10) =>{
        try {
            const response = await axiosCall.get(`${ApiPath}?page=${page}&limit=${limit}${locality ? '&locality='+locality : ""}`);
            if (response.status == 200){
                const data = response.data.data;
                return formatSuccessResponse({ data });
            }
            return formatSuccessResponse({ data: response.data });
        } catch (error) {
            return formatErrorResponse(error);
        }
    },
    fetchSingleEvent: async (id) =>{
        try {
            const response = await axiosCall.get(`${ApiPath}/${id}`);
            if (response.status == 200){
                const data = response.data.data;
                return formatSuccessResponse({ data });
            }
            return formatSuccessResponse({ data: response.data });
        } catch (error) {
            return formatErrorResponse(error);
        }
    },
    createEvent: async (data) => {
        const { locality, title, description, location, start_date_time, end_date_time } = data;
        try {
            const response = await axiosCall.post(`${ApiPath}`, {
                locality, title, description, location, start_date_time, end_date_time
            });
            if (response.status === 200) {
                const data = response.data.data;
                return formatSuccessResponse({ data });
            }
            return formatSuccessResponse({ data: response.data.data.token });
        } catch (error) {
            return formatErrorResponse(error);
        }
    },
    updateEvent: async (id, data) => {
        const { locality, title, description, location, start_date_time, end_date_time } = data;
        try {
            const response = await axiosCall.patch(`${ApiPath}/${id}`, {
                locality:String(locality), title, description, location, start_date_time, end_date_time
            });
            if (response.status === 200) {
                const data = response.data.data;
                return formatSuccessResponse({ data });
            }
            return formatSuccessResponse({ data: response.data.data.token });
        } catch (error) {
            return formatErrorResponse(error);
        }
    },
    deleteEvent: async (id) => {
        try {
            const response = await axiosCall.delete(`${ApiPath}/${id}`);
            if (response.status === 200) {
                const data = response.data.data;
                return formatSuccessResponse({ data });
            }
            return formatSuccessResponse({ data: response.data.data.token });
        } catch (error) {
            return formatErrorResponse(error);
        }
    },
}

export default EventService;