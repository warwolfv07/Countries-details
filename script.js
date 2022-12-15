//Importing data from the other JS file
import {countries_data} from "./countries_data.js"

//finding the DOM elements
const subHeader = document.querySelector("#subHeader")
const searchInfo = document.querySelector(".searchInfo")
const startingWord_btn = document.querySelector(".startingWord")
const anyWord_btn = document.querySelector(".anyWord")
const toggleSort_btn = document.querySelector(".toggleSort")
const searchBar = document.querySelector(".searchBar")
const outputSection = document.querySelector(".outputSection")

//global variables
let startingWord_btn_toggle = false
let anyWord_btn_toggle = false
let toggleSort_btn_toggle = false
let searchValueFromSearchBar = ''// storing value to trigger serch when buttons are toggled

//displaying information on the sub header
subHeader.innerHTML = `Total Number of Countries: ${countries_data.length}`

//adding event listeners to the buttons and the search bar

/*
when clicked the buttons are doing the following:
1. toggling the value of the global variables assigned to them.
2. changing their color as per their toggled status.
3. checking if there is any search value in the search bar and calling the search function.
*/
startingWord_btn.addEventListener( "click", (e) => {
    startingWord_btn_toggle = !startingWord_btn_toggle
    if(startingWord_btn_toggle == true){
        startingWord_btn.style.backgroundColor = 'purple'
        anyWord_btn.style.backgroundColor = 'rgb(133, 50, 133)'
    }
    else{
        startingWord_btn.style.backgroundColor = 'rgb(133, 50, 133)'
    }
    anyWord_btn_toggle = false
    if(searchValueFromSearchBar != '')
        search(searchValueFromSearchBar)
    
})

anyWord_btn.addEventListener( "click", (e) => {
    anyWord_btn_toggle = !anyWord_btn_toggle

    if(anyWord_btn_toggle == true){
        anyWord_btn.style.backgroundColor = 'purple'
        startingWord_btn.style.backgroundColor = 'rgb(133, 50, 133)'
        
    }
    else{
        anyWord_btn.style.backgroundColor = 'rgb(133, 50, 133)'
    }
    startingWord_btn_toggle = false
    if(searchValueFromSearchBar != '')
        search(searchValueFromSearchBar)
    
})

toggleSort_btn.addEventListener( "click", (e) => {
    toggleSort_btn_toggle = !toggleSort_btn_toggle
    
    if(toggleSort_btn_toggle){
        toggleSort_btn.innerHTML = 'Z<->A'
        toggleSort_btn.style.backgroundColor = 'purple'
    }
    else{
        toggleSort_btn.innerHTML = 'A<->Z'
        toggleSort_btn.style.backgroundColor = 'rgb(133, 50, 133)'
    }

    if(searchValueFromSearchBar != '')
        search(searchValueFromSearchBar)
    
})

//The search bar triggers the search function on every input, no need to click any extra buttons
searchBar.addEventListener( "input", (e) => {
    searchValueFromSearchBar = e.target.value
    search(e.target.value)
})

/* 
The search function does the following:
1. creates an array of the search results to be printed.
2. prints the info in searchInfo
*/
function search(searchValue){
    
    const results = []
    if(startingWord_btn_toggle){
        if(searchValue.length != 1) // no need to search if inout is larger than one character.
            return
        
        countries_data.forEach(country => {
            if(country.name.startsWith(searchValue.toUpperCase()))
                results.push(country.name)
        });
    
        searchInfo.innerHTML = `Countries starting with ${searchValue.toUpperCase()} are ${results.length}.`
        projectResults(results)
    }
    else if(anyWord_btn_toggle){
        countries_data.forEach( country => {
            if(country.name.toUpperCase().indexOf(searchValue.toUpperCase()) != -1)
                results.push(country.name)
        })
        if(searchValue.length == 0)
            searchInfo.innerHTML = '' //if nothing is found then searchInfo will not be displayed
        else
            searchInfo.innerHTML = `Countries containing ${searchValue} are ${results.length}.`
        projectResults(results)
    }
}

/*
projectResults does the following:
1. it resets the output section to empty.
2. it checks if the sort button is toggled and it sorts the array top be displayed accordingly.
3. it creates child divs with the information to project and appends it to the output section to be displayed.
*/
function projectResults(results){
    outputSection.innerHTML = ''
    let sortedResults = results.sort()
    if(toggleSort_btn_toggle)
        sortedResults = results.reverse()

    sortedResults.forEach(country => {
        const item = document.createElement('div')
        item.className = 'countryTile'
        item.innerHTML = country
        outputSection.appendChild(item)    
    });
    
}