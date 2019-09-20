import Fuse from "fuse.js";

function fuzzySearch(list, keys, e) {
  e.preventDefault();
  //console.log(list.arr, 'list.arr')
  //console.log('list', list)
  let options = {
    findAllMatches: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [...keys]
  };
  const fuse = new Fuse(list, options); // "list" is the item array
  console.log("INPUT: ", e.target.value);
  const result = fuse.search(e.target.value);
  return result;
}

export default fuzzySearch;
