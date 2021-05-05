import React from "react";
import styled from "styled-components";
import { StickyTable, Row, Cell } from "./Sticky";
import Checkboxes from "./Checkbox";
import { dynamicSort } from "./utils/sort";
import Search from "./Search";

const HeaderButton = styled.button`
  width: 100%;
  padding: 0 1rem;
  height: 2rem;
  background-color: lightgrey;
  border: 1px solid white;
  cursor: pointer;
  position: relative;
`;

const TableWrapper = styled.div`
  height: 70vh;
  max-width: 100%;
  border: 1px solid lightgrey;
  margin: 0 1rem;
  box-sizing: content-box;
  font-size: 0.9rem;
  @media (max-width: 768px) {
    font-size: 0.7rem;
    margin: 0 10px;
  }
`;

const SortArrow = styled.span`
  position: absolute;
`;

const Table = ({ data, categories, types }) => {
  const [sortCategory, setSortCategory] = React.useState("");
  const [currentItems, setCurrentItems] = React.useState([]);
  const [currentCategories, setCurrentCategories] = React.useState([]);

  React.useEffect(() => {
    setCurrentItems(data);
    const categoriesOrder = categories.map((cat, i) => {
      return { name: cat, order: i };
    });
    setCurrentCategories(categoriesOrder);
  }, [data, categories]);

  const handleSearch = (query) => {
    if (query === "") {
      setCurrentItems(data);
      return;
    }
    let searchedItems = [];
    const categoriesToDispaly = currentCategories
      .filter((elem) => {
        if (!elem.hide) return elem.name;
      })
      .map((elem) => elem.name);
    const dataToDisplay = data.map((row) => {
      return Object.keys(row)
        .filter((key) => categoriesToDispaly.includes(key))
        .reduce((obj, key) => {
          obj[key] = row[key];
          return obj;
        }, {});
    });
    dataToDisplay.forEach((item, i) => {
      const finded = Object.values(item).filter((elem) => {
        return (
          elem.toString().toLowerCase().indexOf(query.toLowerCase()) !== -1
        );
      });
      if (finded.length) searchedItems.push(item);
    });
    setCurrentItems([...searchedItems]);
  };

  const handleTableHeaderClick = (e, categoryName) => {
    if (categoryName === sortCategory) {
      setSortCategory(`-${categoryName}`);
      setCurrentItems([...currentItems.sort(dynamicSort(`-${categoryName}`))]);
    } else {
      setSortCategory(categoryName);
      setCurrentItems([...currentItems.sort(dynamicSort(categoryName))]);
    }
  };

  const showHideColumns = (checkboxes) => {
    setCurrentCategories([
      ...currentCategories.map((elem) => {
        return {
          ...elem,
          hide: checkboxes[elem.name],
        };
      }),
    ]);
  };

  const [currentHeader, setCurrentHeader] = React.useState(null);

  function tableDragStartHandler(e, header) {
    setCurrentHeader(header);
    e.target.style.background = "#3f87a6"; //use class here
  }
  const tableDragLeaveHandler = (e) => {
    e.target.style.background = "lightgrey";
  };
  function tableDragEndHandler(e) {
    e.preventDefault();
    e.target.style.background = "lightgrey";
  }
  function tableDragOverHandler(e) {
    e.preventDefault();
    e.target.style.background = "white";
  }
  function tableDropHandler(e, header) {
    e.target.style.background = "lightgrey";

    if (header.name === currentHeader.name) {
      return;
    }
    setCurrentCategories([
      ...currentCategories.map((elem) => {
        if (elem.name === header.name) {
          return { ...elem, order: currentHeader.order };
        }
        if (elem.name === currentHeader.name) {
          return { ...elem, order: header.order };
        }
        return elem;
      }),
    ]);
  }

  let clickHoldTimer = null;

  function handleTableHeaderMouseDown(e) {
    clickHoldTimer = setTimeout(() => {
      if (e.target.draggable) e.target.style.background = "#3f87a6";
    }, 400);
  }

  function handleTableHeaderMouseUp(e) {
    clearTimeout(clickHoldTimer);
  }

  return (
    <>
      <Checkboxes data={categories} onCheckboxChange={showHideColumns} />
      <Search handleSearch={handleSearch} />
      <TableWrapper>
        <StickyTable leftStickyColumnCount={3}>
          <Row>
            <Cell>№</Cell>
            {currentCategories.sort(dynamicSort("order")).map((category, i) =>
              category.hide ? (
                ""
              ) : (
                <Cell
                  key={category.name}
                  draggable={true}
                  onDragStart={(e) => tableDragStartHandler(e, category)}
                  onDragLeave={(e) => tableDragLeaveHandler(e)}
                  onDragEnd={(e) => tableDragEndHandler(e)}
                  onDragOver={(e) => tableDragOverHandler(e)}
                  onDrop={(e) => tableDropHandler(e, category)}
                  onMouseDown={(e) => handleTableHeaderMouseDown(e)}
                  onMouseUp={(e) => handleTableHeaderMouseUp(e)}
                  style={{ cursor: "grab", padding: ".7rem 1rem 2rem 1rem" }}
                >
                  <HeaderButton
                    onClick={(e) => handleTableHeaderClick(e, category.name)}
                  >
                    {category.name}
                    {category.name === sortCategory && <SortArrow>↑</SortArrow>}
                    {category.name === sortCategory.substr(1) && (
                      <SortArrow>↓</SortArrow>
                    )}
                  </HeaderButton>
                </Cell>
              )
            )}
          </Row>

          {currentItems.map((row, rowIndex) => (
            <Row key={row.id}>
              <Cell key={rowIndex + "cell"}>{rowIndex + 1}</Cell>
              {currentCategories.map((cell, cellIndex) =>
                cell.hide ? (
                  ""
                ) : (
                  <Cell key={row.id + cell.name}>
                    {types[cell.name] === "link" ? (
                      <img src={row[cell.name]} alt={"avatar"} />
                    ) : (
                      row[cell.name]
                    )}
                  </Cell>
                )
              )}
            </Row>
          ))}
        </StickyTable>
      </TableWrapper>
    </>
  );
};

export default Table;
