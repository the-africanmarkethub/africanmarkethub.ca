import api from "./axios";
import {
  InitialSettings,
  NotificationPayload, 
} from "@/interfaces/notification";

export async function getCommunicationSettings(): Promise<InitialSettings> {
  const response = await api.get(`/communication-preferences`);
  return response.data.data;
}

export async function saveCommunicationSettings(payload: NotificationPayload) {
  const response = await api.post(`/communication/create`, payload);
  return response.data;
}

export async function listNotifications(offset:number, limit:number) {
  const res = await api.get(`/notifications?offset=${offset}&limit=${limit}`);
  return res.data;
}
