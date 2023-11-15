declare namespace ION {
  export interface Incident {
    id: number;
    locality: number;
    sub_locality: number;
    created_by: number;
    latitude: string;
    longitude: string;
    address: string | null;
    field1_value: string | null;
    field2_value: string | null;
    field3_value: string | null;
    field4_value: string | null;
    field5_value: string | null;
    responding_units: Array<string> | null;
    featured: boolean;
    sfeatured_image_url?: string | null;
    created_at: Date | null;
    send_push_notification?: boolean;
  }
}
