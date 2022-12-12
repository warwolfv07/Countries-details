import {countries_data} from "./countries_data.js"

const subHeader = document.querySelector("#subHeader")
const searchInfo = document.querySelector(".searchInfo")
const startingWord_btn = document.querySelector(".startingWord")
const anyWord_btn = document.querySelector(".anyWord")
const toggleSort_btn = document.querySelector(".toggleSort")
const searchBar = document.querySelector(".searchBar")
const outputSection = document.querySelector(".outputSection")

let startingWord_btn_toggle = false
let anyWord_btn_toggle = false
let toggleSort_btn_toggle = false
let searchValueFromSearchBar = ''

subHeader.innerHTML = `Total Number of Countries: ${countries_data.length}`

startingWord_btn.addEventListener( "click", (e) => {
    startingWord_btn_toggle = !startingWord_btn_toggle
    //console.log(startingWord_btn_toggle)
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

searchBar.addEventListener( "input", (e) => {
    searchValueFromSearchBar = e.target.value
    search(e.target.value)
})

function search(searchValue){
    
    const results = []
    if(startingWord_btn_toggle){
        if(searchValue.length != 1)
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
            searchInfo.innerHTML = ''
        else
            searchInfo.innerHTML = `Countries containing ${searchValue} are ${results.length}.`
        projectResults(results)
    }
}

function projectResults(results){
    //console.log(results)
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