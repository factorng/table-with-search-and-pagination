export const getItems = () => {
  return fetch(
    "https://jsonplaceholder.typicode.com/comments?_limit=50"
  ).then((res) => res.json());
};
