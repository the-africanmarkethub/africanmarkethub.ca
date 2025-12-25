import api from "../axios";

/**
 * Fetch list of chats with manual pagination
 * @param offset - The starting point for the data fetch
 * @param limit - How many records to return
 */
export async function listServiceChats(offset: number = 0, limit: number = 10) {
  const { data } = await api.get(`tickets`, {
    params: { offset, limit },
  });
  return data;
}

/**
 * Fetch full conversation for a specific ticket
 */
export async function getServiceChat(ticketId: string) {
  const { data } = await api.get(`tickets/${ticketId}`);
  return data;
}

/**
 * Create a new ticket or reply to an existing one
 * Expects FormData for file upload support
 */
export const replyServiceChat = async (payload: FormData) => {
  const { data } = await api.post("/tickets/upsert", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};