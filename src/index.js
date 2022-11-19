import './css/styles.css';
import debounce from "lodash.debounce";
import { fetchCountries } from "./js/fetchCountries";

const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
inputRef.addEventListener("input", debounce(onTypingText, 300));

function onTypingText(evt) {
    fetchCountries('Ukraine');    
}






