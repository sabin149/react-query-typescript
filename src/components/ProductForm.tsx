import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAddProduct, useUpdateProduct } from "../hooks/useProducts";
import { IProduct } from "../api/productsApi";

interface props {
  isEdit: boolean;
  id: string;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProductForm = ({ isEdit, id, setIsEdit }: props) => {
  const [name, setName] = useState("");

  const queryClient = useQueryClient();
  const { mutate } = useAddProduct();

  const updateProductMutation = useUpdateProduct();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEdit) {
      mutate({
        name,
      });
      setName("");
    }

    if (isEdit) {
      updateProductMutation.mutate({
        _id: id,
        name,
      });
      setName("");
      setIsEdit(false);
    }
  };

  useEffect(() => {
    if (isEdit) {
      const product = queryClient
        .getQueryData<IProduct[]>(["products"])
        ?.find((product) => product._id === id);
      if (product) {
        setName(product.name);
      }
    }
  }, [isEdit, id, queryClient, setName]);

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        name="name"
        id="name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <button type="submit">{isEdit ? "Update" : "Add"}</button>
    </form>
  );
};

export default ProductForm;
