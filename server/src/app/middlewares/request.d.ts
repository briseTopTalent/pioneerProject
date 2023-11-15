declare namespace Express {
  interface MiddlewareUser {
    id: number;
    email: string;
    role: string;
    iat: number;
    exp: number;
  }
  export interface Request {
    user?:  MiddlewareUser;
  }
}
