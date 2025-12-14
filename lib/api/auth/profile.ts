import { User } from "@/interfaces/user";
import api from "../axios";

export async function updateUserProfile(
  userId: number,
  payload: { name: string; last_name: string; phone: string }
): Promise<User> {
  const response = await api.put(`/profile/update/${userId}`, payload);
  return response.data.data;
}