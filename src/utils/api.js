export const getItems = () => {
  return fetch("https://fakestoreapi.com/products").then((res) => res.json());
};
