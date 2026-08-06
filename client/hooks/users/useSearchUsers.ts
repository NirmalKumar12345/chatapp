import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "@/services/user.service";

export const useSearchUsers = (search: string) => {
  return useQuery({
    queryKey: ["search-users", search],
    queryFn: () => searchUsers(search),
    enabled: search.trim().length > 0,
  });
};