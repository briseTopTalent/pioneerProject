import { NextApiRequest, NextApiResponse } from "next";
import APIhandler from '../../helpers/axiosClient';
import queryString from 'query-string';
import config from "../../config";

async function handler(req, res) {
    const q = parseQuery(req.query);
    const urlPath = parseUrl(req.query.url);
    const url = `${urlPath}${q}`;
    
    try{
        let response = await APIhandler(req, res, url, req.method);
        return response;
    }catch(error){
        const { data } = error.response || {};
        const err = data || {};
        return res.status(500).json(err);
    }
};

const parseUrl = (url) => {
    let reUrl = '';
    if(url.length){
        for(var i =0; i<url.length; i++){
            reUrl = i<url.length ? reUrl+`${url[i]}/` : reUrl+`${url[i]}`;
        }
    };
    return reUrl;
}

const parseQuery = (query) => {
    let reUrl = '?';
    Object.keys(query).map((key) => {
        if(key != 'url')
            reUrl = reUrl+`${key}=${query[key]}&`;
    });
    return reUrl;
}

export default handler;
