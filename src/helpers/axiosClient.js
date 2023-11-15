import { makeRequest } from '../utils/makeRequest';
import config from '../config';

async function APIhandler(req, res, url, method) {
    try {
        const murl = `${config.API_URL}/${url}`;
    console.log(murl);
        const response = await makeRequest(murl, method, req.body||{}, req.headers);
        res.status(response.statusCode).json(response);
    } catch (error) {
        const { data } = error.response || {};
        const err = data || {};
        console.log(err, error)
        return res.status(500).json(err);
    }
};

export default APIhandler;
