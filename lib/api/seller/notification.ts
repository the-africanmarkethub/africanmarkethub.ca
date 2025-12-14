import api from "../axios";

export async function listNotifications() {
  const { data } = await api.get("/notifications");
  return data.data;
}
