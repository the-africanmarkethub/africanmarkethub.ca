export interface NotificationPayload {
  marketing_emails: "true" | "false";
  new_products: "true" | "false";
  promotions: "true" | "false";
  push_notification: "true" | "false";
  email_notification: "true" | "false";
  sms_notification: "true" | "false";
  events: "true" | "false";
}

export interface InitialSettings {
  marketing_emails: boolean;
  new_products: boolean;
  promotions: boolean;
  push_notification: boolean;
  email_notification: boolean;
  sms_notification: boolean;
  events: boolean;
}

export interface NotificationChannels {
  push: boolean;
  emails: boolean;
  sms: boolean;
}

export interface SaveResponse {
  status: "success" | "error";
  message: string;
  error_detail?: any; 
}


export interface NotificationItem {
  id: number; // Assuming an ID field exists
  receiver: string; // 'vendor', 'customer', 'all', etc.
  body: string; // The notification message
  image: string | null;
  image_public_id: string | null;
  cta: string | null; // Call to action link/route
  delivery_status: "pending" | "delivered" | "failed";
  channel: "email" | "in-app";
  user_id: string; // Or number, depends on your database schema
  delivered_to: number; // Count or boolean flag
  created_at: string; // Timestamp for display time
  updated_at: string;
}

export interface NotificationsResponse {
  status: "success" | "error";
  message: string;
  data: NotificationItem[];
}