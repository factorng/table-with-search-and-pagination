import React from "react";
import { getItems } from "./utils/api";
import { dynamicSort } from "./utils/sort";
import "./Table.css";

const Table = (props) => {
  const [items, setItems] = React.useState([]);
  const [sortCategory, setSortCategory] = React.useState("");
  const [input, setInput] = React.useState({});
  const [categories, setCategories] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerpage] = React.useState(5);
  const [currentItems, setCurrentItems] = React.useState([]);

  const getCurrentItems = React.useMemo(() => {
    if (items) {
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      return [...items.slice(indexOfFirstItem, indexOfLastItem)];
    }
  }, [items, currentPage, itemsPerPage]);

  const handleSearch = () => {
    let searchedItems = [];
    getCurrentItems.forEach((item) => {
      const finded = Object.values(item).filter((elem) => {
        return elem.toString().toLowerCase().indexOf(input.search) !== -1;
      });
      if (finded.length) searchedItems.push(item);
    });
    setCurrentItems([...searchedItems]);
  };

  const pageNumberClickHandler = (e) => setCurrentPage(e.target.innerText);

  const getPagesNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(items.length / itemsPerPage); i++) {
      pageNumbers.push(i);
    }
    return (
      <ul className="page-numbers">
        {pageNumbers.map((pageNumber, i) => (
          <li
            key={pageNumber}
            onClick={(e) => pageNumberClickHandler(e)}
            className={
              pageNumber === parseInt(currentPage)
                ? "page-numbers__page page-numbers__page_selected"
                : "page-numbers__page"
            }
          >
            {pageNumber}
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

  const handleInput = (e) => setInput({ [e.target.name]: e.target.value });

  React.useEffect(() => {
    getItems()
      .then((res) => {
        setItems(res);
        return res;
      })
      .then((res) => setCategories(Object.keys(res[0])));
  }, []);

  React.useEffect(() => {
    setCurrentItems([...getCurrentItems]);
  }, [items, currentPage, itemsPerPage, getCurrentItems]);

  React.useEffect(() => {
    handleSearch();
  }, [input]);

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()} className="form-search">
        <h3>Search</h3>
        <input
          name="search"
          onInput={(e) => handleInput(e)}
          value={input.search || ""}
          onBlur={(e) => {
            setInput({ ...input, ["search"]: "" });
          }}
        />
      </form>
      <table>
        <tr className="table__header">
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

        {currentItems.map((elem, i) => (
          <tr key={i} className="table__row">
            {categories.map((category, i) => (
              <td key={i}>{elem[category]}</td>
            ))}
          </tr>
        ))}
      </table>
      {getPagesNumbers()}
    </>
  );
};

export default Table;
