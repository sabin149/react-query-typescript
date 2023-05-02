import { useQuery, useQueryClient } from "@tanstack/react-query";
import { IProduct, getProductById } from "../api/productsApi";

const fetchProductById = async ({
  queryKey,
}: {
  queryKey: [string, string];
}) => {
  const [, id] = queryKey;
  return await getProductById(id);
};

export const useProductById = (id: string) => {
  const queryClient = useQueryClient();
  return useQuery(["post-id", id], fetchProductById, {
    initialData: () => {
      const post = queryClient
        .getQueryData<IProduct[]>(["products"])
        ?.find((post) => post._id === id);
      if (post) {
        return { data: post };
      } else {
        return undefined;
      }
    },
  });
};
