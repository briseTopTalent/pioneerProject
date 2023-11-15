/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import Cookie from "js-cookie";
import ApiClient, { axiosAPI } from "./axiosClient";
import { formatErrorResponse, formatSuccessResponse } from "utils";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import config from "../config";

const axiosCall = config.PROXY_API ? axiosAPI : ApiClient;
const ApiPath = `/point-of-interest`;

const POIservice = {
    fetchPOIs: async (locality=null, page=1, limit=10) =>{
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
    fetchOnePOI: async (id) =>{
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
    createPOI: async (data) => {
        const { locality, name, address, longitude, latitude, notes } = data;
        try {
            const response = await axiosCall.post(`${ApiPath}`, {
                locality:String(locality), name, address, longitude, latitude, notes
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
    updatePOI: async (id, data) => {
        const { locality, name, address, longitude, latitude, notes } = data;
        try {
            const response = await axiosCall.patch(`${ApiPath}/${id}`, {
                locality:String(locality), name, address, longitude, latitude, notes
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
    deletePOI: async (id) => {
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

export default POIservice;