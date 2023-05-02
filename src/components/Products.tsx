import { useState } from "react";
import { useDeleteProduct, useProducts } from "../hooks/useProducts";
import { Link } from "react-router-dom";
import ProductForm from "./ProductForm";

const Products = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState("");

  const { isLoading, data: products, isError, error } = useProducts();

  function updateProduct({ id }: { id: string }) {
    setIsEdit(true);
    setId(id);
  }

  const deleteProductMutation = useDeleteProduct();

  const handleDelete = ({ id }: { id: string }) => {
    deleteProductMutation.mutate(id);
  };

  return (
    <div>
      <ProductForm isEdit={isEdit} id={id} setIsEdit={setIsEdit} />
      {isLoading ? <h1>Loading...</h1> : null}
      {isError ? <h1>{error.message}</h1> : null}
      {products
        ? products.map((product) => (
            <div key={product._id}>
              <h3
                style={{
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                  cursor: "pointer",
                }}
              >
                <Link to={`/product/${product._id}`}>{product.name}</Link>
              </h3>
              <button
                onClick={() => {
                  if (product._id) {
                    handleDelete({
                      id: product._id,
                    });
                  }
                }}
              >
                Delete
              </button>
              <button
                onClick={() => {
                  if (product._id) {
                    updateProduct({
                      id: product._id,
                    });
                  }
                }}
              >
                Edit
              </button>
            </div>
          ))
        : null}
    </div>
  );
};

export default Products;
