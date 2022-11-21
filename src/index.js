// Libries import
import './css/styles.css';
import debounce from "lodash.debounce";
import { fetchCountries } from "./js/fetchCountries";

// Key var.
const DEBOUNCE_DELAY = 300;

// Input link
const inputRef = document.querySelector('#search-box');    
inputRef.addEventListener("input", debounce(onTypingText, 300));

// Event listener callback func.
function onTypingText(evt) {
    let countryName = evt.target.value.trim();
    fetchCountries(countryName);    
}






