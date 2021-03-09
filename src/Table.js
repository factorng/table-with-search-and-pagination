import React from "react";
import { getItems } from "./utils/api";
import { dynamicSort } from "./utils/sort";
import "./Table.css";

const Table = (props) => {
  const [items, setItems] = React.useState([]);
  const [sortCategory, setSortCategory] = React.useState("");
  const [input, setInput] = React.useState({});
  const [inputSelect, setInputSelect] = React.useState({});
  const [categories, setCategories] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerpage] = React.useState(5);
  const [currentItems, setCurrentItems] = React.useState([]);

  React.useEffect(() => {
    getItems()
      .then((res) => {
        setItems(res);
        return res;
      })
      .then((res) => setCategories(Object.keys(res[0])));
  }, []);

  React.useEffect(() => {
    if (items) {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      setCurrentItems([...items.slice(indexOfFirstItem, indexOfLastItem)]);
    }
  }, [items, currentPage, itemsPerPage]);

  const pageClickHandler = (e) => setCurrentPage(e.target.innerText);

  const pages = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(items.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
    return (
      <ul className="page-numbers">
        {pageNumbers.map((page) => (
          <li
            onClick={(e) => pageClickHandler(e)}
            className={
              page === parseInt(currentPage)
                ? "page-numbers__page page-numbers__page_selected"
                : "page-numbers__page"
            }
          >
            {page}
          </li>
        ))}
      </ul>
    );
  };

  const handleClick = (e) => {
    if (e.target.innerText === sortCategory) {
      setSortCategory(`-${e.target.innerText}`);
      setCurrentItems([
        ...currentItems.sort(dynamicSort(`-${e.target.innerText}`)),
      ]);
    } else {
      setSortCategory(e.target.innerText);
      setCurrentItems([...currentItems.sort(dynamicSort(e.target.innerText))]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setInput({ ...input, [e.target.name]: e.target.value });
    const searchedItems = currentItems.filter((elem) => {
      return (
        elem[inputSelect.category]
          .toString()
          .toLowerCase()
          .indexOf(e.target.value) !== -1
      );
    });
    if (searchedItems.length) {
      searchedItems.forEach((searchedItem) => {
        currentItems.forEach((item, index) => {
          if (searchedItem.id === item.id) currentItems.splice(index, 1);
        });
      });

      searchedItems.forEach((item) => currentItems.unshift(item));
      setCurrentItems([...currentItems]);
    }
  };

  const handleSelect = (e) =>
    setInputSelect({ ...inputSelect, [e.target.name]: e.target.value });

  return (
    <>
      <form onSubmit={(e) => handleSearch(e)} className="form-search">
        <caption>Search</caption>
        <select
          value={inputSelect.category}
          onChange={(e) => handleSelect(e)}
          name="category"
        >
          <option disabled selected value>
            -- select an option --
          </option>
          {categories.map((item) => (
            <option value={item}>{item}</option>
          ))}
        </select>
        <input
          name="search"
          onInput={(e) => handleSearch(e)}
          value={input.search}
          onBlur={(e) => setInput({ ...input, ["search"]: "" })}
        />
      </form>
      <table>
        <tr>
          {categories.map((category, i) => (
            <td
              onClick={(e) => handleClick(e)}
              className="table__category"
              key={i}
            >
              {category}
            </td>
          ))}
        </tr>

        {currentItems.map((elem) => (
          <tr>
            {categories.map((category) => (
              <td key={elem[category].id}>{elem[category]}</td>
            ))}
          </tr>
        ))}
      </table>
      {pages()}
    </>
  );
};

export default Table;
