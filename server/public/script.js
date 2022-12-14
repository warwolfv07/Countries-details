//Importing data from the other JS file
//import { countries_data } from "./countries_data.js";

//finding the DOM elements

const subHeader = document.querySelector("#subHeader");
const searchInfo = document.querySelector(".searchInfo");
const startingWord_btn = document.querySelector(".startingWord");
const anyWord_btn = document.querySelector(".anyWord");
const toggleSort_btn = document.querySelector(".toggleSort");
const searchBar = document.querySelector(".searchBar");
const outputSection = document.querySelector(".outputSection");

let tiles;

//global variables
let startingWord_btn_toggle = false;
let anyWord_btn_toggle = false;
let toggleSort_btn_toggle = false;
let searchValueFromSearchBar = ""; // storing value to trigger serch when buttons are toggled

//adding event listeners to the buttons and the search bar

/*
when clicked the buttons are doing the following:
1. toggling the value of the global variables assigned to them.
2. changing their color as per their toggled status.
3. checking if there is any search value in the search bar and calling the search function.
*/
try {
  startingWord_btn.addEventListener("click", (e) => {
    startingWord_btn_toggle = !startingWord_btn_toggle;
    if (startingWord_btn_toggle == true) {
      startingWord_btn.style.backgroundColor = "purple";
      anyWord_btn.style.backgroundColor = "rgb(133, 50, 133)";
    } else {
      startingWord_btn.style.backgroundColor = "rgb(133, 50, 133)";
    }
    anyWord_btn_toggle = false;
    if (searchValueFromSearchBar != "") search(searchValueFromSearchBar);
  });

  anyWord_btn.addEventListener("click", (e) => {
    anyWord_btn_toggle = !anyWord_btn_toggle;

    if (anyWord_btn_toggle == true) {
      anyWord_btn.style.backgroundColor = "purple";
      startingWord_btn.style.backgroundColor = "rgb(133, 50, 133)";
    } else {
      anyWord_btn.style.backgroundColor = "rgb(133, 50, 133)";
    }
    startingWord_btn_toggle = false;
    if (searchValueFromSearchBar != "") search(searchValueFromSearchBar);
  });

  toggleSort_btn.addEventListener("click", (e) => {
    toggleSort_btn_toggle = !toggleSort_btn_toggle;

    if (toggleSort_btn_toggle) {
      toggleSort_btn.innerHTML = "Z<->A";
      toggleSort_btn.style.backgroundColor = "purple";
    } else {
      toggleSort_btn.innerHTML = "A<->Z";
      toggleSort_btn.style.backgroundColor = "rgb(133, 50, 133)";
    }

    if (searchValueFromSearchBar != "") search(searchValueFromSearchBar);
  });

  //The search bar triggers the search function on every input, no need to click any extra buttons
  searchBar.addEventListener("input", (e) => {
    searchValueFromSearchBar = e.target.value;
    search(e.target.value);
  });
} catch (err) {
  console.log(err);
}

/* 
The search function does the following:
1. creates an array of the search results to be printed.
2. prints the info in searchInfo
*/
async function search(searchValue) {
  //options to customize the fetch function
  const postOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  let postData = {}; // data to send in the post request
  let option; // data about the two button toggles

  if (startingWord_btn_toggle) {
    if (searchValue.length != 1)
      // no need to search if inout is larger than one character.
      return;
    option = "starts_with";
    postData = { searchValue, option };
    postOptions.body = JSON.stringify(postData);

    //requesting server for data
    const response = await fetch("/api", postOptions);
    const queryResults = await response.json();

    searchInfo.innerHTML = `Countries starting with ${searchValue.toUpperCase()} are ${
      queryResults.nameArray.length
    }.`;

    //displaying information on the sub header
    subHeader.innerHTML = "";
    subHeader.innerHTML = `Total Number of Countries: ${queryResults.totalDocs}`;

    projectResults(queryResults.nameArray);
  } else if (anyWord_btn_toggle) {
    option = "includes";
    postData = { searchValue, option };
    postOptions.body = JSON.stringify(postData);

    const response = await fetch("/api", postOptions);
    const queryResults = await response.json();

    if (searchValue.length == 0) searchInfo.innerHTML = "";
    //if nothing is found then searchInfo will not be displayed
    else
      searchInfo.innerHTML = `Countries containing ${searchValue.toUpperCase()} are ${
        queryResults.nameArray.length
      }.`;
    //displaying information on the sub header
    subHeader.innerHTML = "";
    subHeader.innerHTML = `Total Number of Countries: ${queryResults.totalDocs}`;

    projectResults(queryResults.nameArray);
  }
}

/*
projectResults does the following:
1. it resets the output section to empty.
2. it checks if the sort button is toggled and it sorts the array top be displayed accordingly.
3. it creates child divs with the information to project and appends it to the output section to be displayed.
*/
async function projectResults(results) {
  outputSection.innerHTML = "";
  let sortedResults = results.sort();
  if (toggleSort_btn_toggle) sortedResults = results.reverse();

  sortedResults.forEach((country) => {
    const item = document.createElement("div");

    item.className = "countryTile";
    item.innerHTML = `${country}`;
    outputSection.appendChild(item);

    item.addEventListener("click", (e) => {
      const clickedCountry = e.target.innerHTML;
      const newTab = window.open("countries_details.html");
      fullDetails(newTab, clickedCountry);
    });
  });
}

function fullDetails(newTab, clickedCountry) {
  newTab.onload = async function () {
    const title = newTab.document.querySelector(".title");
    const flag = newTab.document.querySelector(".flag");
    const capital = newTab.document.querySelector(".capital");
    const languages = newTab.document.querySelector(".languages");
    const population = newTab.document.querySelector(".population");
    const region = newTab.document.querySelector(".region");
    const area = newTab.document.querySelector(".area");

    const postOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    };
    let postData = {}; // data to send in the post request
    const option = "full";
    postData = { clickedCountry, option };
    postOptions.body = JSON.stringify(postData);
    const response = await (await fetch("/full", postOptions)).json();

    const header = newTab.document.createElement("h1");
    header.innerHTML = response.data.queriedData[0].name;
    title.appendChild(header);

    const image = newTab.document.createElement("img");
    image.src = response.data.queriedData[0].flag;
    image.className = "flag_img";
    flag.appendChild(image);

    capital.innerHTML = `Capital : ${response.data.queriedData[0].capital}`;

    const langList = newTab.document.createElement("ul");
    const langArray = response.data.queriedData[0].languages;
    langArray.forEach((lang) => {
      const item = newTab.document.createElement("li");
      item.innerHTML = lang;
      langList.appendChild(item);
    });
    languages.innerHTML = `Languages: `;
    languages.appendChild(langList);

    population.innerHTML = `Polulation : ${response.data.queriedData[0].population}`;
    region.innerHTML = `Region : ${response.data.queriedData[0].region}`;
    area.innerHTML = `Area : ${response.data.queriedData[0].area} sq kms`;
  };
}
