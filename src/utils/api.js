import { DATA } from "./DATA";
export const getItems = () => {
  // return fetch(
  //   "http://www.filltext.com/?rows=100&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={city}&description={lorem|32}&date={date|10-10-2010}&ip={ip}"
  // ).then((res) => res.json());
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(DATA);
    }, 300);
  });
};
