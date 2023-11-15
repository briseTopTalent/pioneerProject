let Utils = {};
import { Request, Response, NextFunction } from 'express';

export function json_send(
  res: Response,
  data: any,
  message: string | null,
  status: string | number,
  status_code: number | string | null,
  meta: any | null
) {
  data = data || null;
  message = message || '';
  status = status || 'success';

  const d = {
    status,
    message,
    data,
  };

  if (typeof status_code === 'number') {
    res.statusCode = status_code;
  }
  if (typeof status_code === 'string' && !isNaN(parseInt(status_code, 10))) {
    res.statusCode = parseInt(status_code, 10);
  }
  return res.status(res.statusCode).json(d);
}

export const jsonS = (express_res: Response, data: any, message: string | null, status_code: number | null, meta: any) => {
  if(status_code === null){
    status_code = 200
  }
  return json_send(express_res, data, message, 'success', status_code, meta);
};

export const json401 = (express_res: Response, data: any, message: string | null, error: any) => {
  return json_send(express_res, data, message, 'error', 401, error);
};

export const jsonFailed = (express_res: Response, data: any, message: string | null, status_code: number | null, meta: any) => {
  if(status_code === null){
    status_code = 400
  }
  return json_send(express_res, data, message, 'error', status_code, meta);
};

export const InternalRes = (error: any, message: string | null, data: any) => {
  return { error, message, data };
};
export const dd = (...args: Array<any>) => {
  console.debug(JSON.stringify([...args], null, 2));
};
const _xt = require('@mentoc/xtract').xt;
export const xt = (obj: any,schema: string) => {
  return _xt(obj,schema);
}
