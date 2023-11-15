declare namespace ION {
  export interface RefreshTokenPayload {
    refresh_token: string;
  }
  export interface TwitterModel {
    TWITTER_API_KEY: string;
    TWITTER_API_KEY_SECRET: string;
    TWITTER_API_ACCESS_TOKEN: string;
    TWITTER_API_ACCESS_TOKEN_SECRET: string;
    TWITTER_API_BEARER_TOKEN: string;
  }
  export interface Incident {
    id?: number;
    locality: number;
    sub_locality?: number | null;
    created_by: number;
    latitude: string;
    longitude: string;
    address: string;
    field1_value?: string;
    field2_value?: string;
    field3_value?: string;
    field4_value?: string;
    field5_value?: string;
    responding_units?: Array<string>;
    featured?: boolean;
    sfeatured_image_url?: string | null;
    created_at?: Date | null;
  }
  export interface Notifications {
    id?: number;
    _user: number;
    notification_type: string;
    notification_id: string;
    created_at?: Date;
    updated_at?: Date;
  }
  export interface PushNotifications {
    id?: number;
    _user: number;
    claimed_by: string | null;
    incident_id: number;
    created_at?: Date | null;
  }
  export interface User {
    id: number;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string | null;
    role: string;
    verified: boolean;
    confirmation_sent: boolean;
    flagged: boolean;
    feed_type: string | null;
    title: string | null;
    push_id: string | null;
    subscription: string | null;
    last_login: string | null;
    web_token: string | null;
    reset_pw_hash: string | null;
    reset_pw_before: string | null;
    google_sso_json: string | null;
  }
  export interface Token {
    verified: boolean;
    first_name: string;
    last_name: string;
    email: string;
    role: 'super' | 'admin' | 'basic_user';
    isAdmin: boolean;
    token: string;
    refreshToken: string;
    token_type: 'jwt';
    expiresIn?: number;
  }
  export interface MockableModel<TModel> {
    ion_mockable_data?: Map<string, string>;
    create(obj: TModel): Promise<TModel>;
    findAll(obj: TModel): Promise<Array<TModel> | null>;
    findOne(obj: TModel): Promise<TModel | null>;
    count(obj: TModel): Promise<number>;
  }
  export interface Locality {
    id?: number;
    name: string;
    state: string;
    latitude: string;
    longitude: string;
    subscriber_only_comments: boolean;
    facebook_graph_token?: string | null;
    twitter_access_token?: string | null;
    twitter_access_token_secret?: string | null;
    twitter_api_key?: string | null;
    twitter_api_secret?: string | null;
    news_rss_feed_url?: string | null;
  }
  export interface SubLocality {
    id?: number;
    locality: number;
    name: string;
    latitude: string;
    longitude: string;
  }
}
declare namespace Express {
  interface MiddlewareUser {
    id: number;
    email: string;
    role: string;
    iat: number;
    exp: number;
    is_admin: boolean;
  }
  export interface Request {
    user?: MiddlewareUser;
  }
}
