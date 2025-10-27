import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import { User } from "@/types/auth.types";
import APICall from "@/utils/ApiCall";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const fetchProfile = async (): Promise<User> => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No token found");
    const res = await APICall("/profile", "GET");
    return res?.data;
  } catch (error) {
    throw error;
  }
};

export function useProfile() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY.profile],
    queryFn: () => fetchProfile(),
    initialData: () => queryClient.getQueryData([QUERY_KEY.profile]),
  });

  return query;
}
