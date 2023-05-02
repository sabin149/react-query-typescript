import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  IProduct,
} from "../api/productsApi";

export const useProducts = () => {
  return useQuery<IProduct[], Error>({
    queryKey: ["products"],
    queryFn: getProducts,
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IProduct) => createProduct(data),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IProduct) => updateProduct(data),
    onMutate: async (updatedProduct) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: ["products", updatedProduct._id],
      });

      // Snapshot the previous value
      const previousProduct = queryClient.getQueryData<IProduct>([
        "products",
        updatedProduct._id,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData<IProduct>(
        ["products", updatedProduct._id],
        updatedProduct
      );

      // Return a context with the previous and new product
      return { previousProduct, updatedProduct };
    },
    onError: (_err, _updatedProduct, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(
        ["products", context?.updatedProduct._id],
        context?.previousProduct
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};
