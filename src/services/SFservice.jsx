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
const ApiPath = `/scanner-feeds`;

const SFservice = {
    fetchSFs: async (locality=null, page=1, limit=10) =>{
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
    fetchOneSF: async (id) =>{
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
    createSF: async (data) => {
        const { locality, name, url } = data;
        try {
            const response = await axiosCall.post(`${ApiPath}`, {
                locality:String(locality), name,url
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
    updateSF: async (id, data) => {
        const { locality, name, url } = data;
        try {
            const response = await axiosCall.patch(`${ApiPath}/${id}`, {
                locality:String(locality), name, url
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
    deleteSF: async (id) => {
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

export default SFservice;