// import { db } from "../logic/firebase";

// const fetchBuildWeekProjects = async buildWeek => {
//   let listOfProjects = [];
//   const unsubscribe = await db.collection("build_weeks")
//     .doc(`${buildWeek}`)
//     .collection("projects")
//     .onSnapshot(snapshot => {
//       snapshot.docChanges().forEach(function(change) {
//         // console.log(change.doc.data());
//         listOfProjects.push(change.doc.data());
//       });
//     });
//   return listOfProjects;
// };

// export default fetchBuildWeekProjects;
