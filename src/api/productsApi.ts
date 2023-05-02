import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:4000",
});

export interface IProduct {
  _id?: string;
  name: string;
}

export const getProducts = async (): Promise<IProduct[]> => {
  const res = await request({ url: "/", method: "GET" });
  return res.data;
};

export const getProductById = async (id: string) => {
  const res = await request({ url: `/${id}`, method: "GET" });
  return res.data;
};

export const createProduct = async (product: IProduct) => {
  const res = await request({ url: "/", method: "POST", data: product });
  return res.data;
};

export const updateProduct = async (product: IProduct) => {
  const res = await request({
    url: `/${product._id}`,
    method: "PATCH",
    data: product,
  });
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const res = await request({ url: `/${id}`, method: "DELETE" });
  return res.data;
};
