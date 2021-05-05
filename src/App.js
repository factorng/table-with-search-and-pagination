import React from "react";
import { getItems } from "./utils/api";
import Table from "./Table";

function App() {
  const [items, setItems] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [types, setTypes] = React.useState([]);

  React.useEffect(() => {
    getItems()
      .then((res) => {
        setItems(res);
        return res;
      })
      .then((res) => {
        setCategories(Object.keys(res[0]));
        return res;
      })
      .then((res) => {
        // make associated array category_name[type]
        let arrCategories = [];
        const objKeys = Object.keys(res[0]);
        Object.values(res[1]).forEach((value, i) => {
          if (/(http(s?)):\/\//i.test(value))
            arrCategories[objKeys[i]] = "link";
          else arrCategories[objKeys[i]] = typeof value;
        });
        setTypes(arrCategories);
      });
  }, []);
  return (
    <>
      <Table data={items} categories={categories} types={types} />
    </>
  );
}

export default App;
