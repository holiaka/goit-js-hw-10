// Libries import
import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';

// Links to HTML elements
const ref = {
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
  input: document.querySelector('#search-box'),
};

//Hide data about country (-ies)
showInvitationText();

// Key var.
const DEBOUNCE_DELAY = 300;

// Added event listener link
ref.input.addEventListener('input', debounce(onTypingText, 300));

// Event listener callback func.
function onTypingText(evt) {
  const countryName = evt.target.value.trim();
  if (countryName.length) {
    fetchCountries(countryName)
      .then(data => {
        preprocessingData(data);
      })
      .catch(error => {
        onFetchError(error);
      });
  } else {
    showInvitationText();
  }
}

// Support functions list
function hiddenCountryDiscr() {
  ref.countryList.innerHTML = '';
  ref.countryInfo.innerHTML = '';
  ref.countryInfo.setAttribute('js-hidden', '');
}

function showInvitationText() {
  hiddenCountryDiscr();
  Notiflix.Notify.warning('You should type the country name, please !!!');
}

function preprocessingData(data) {
  hiddenCountryDiscr();

  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length > 1 && data.length <= 10) {
    createCountriesList(data);
  } else {
    createCountyDiscription(data);
  }
}

function onFetchError(error) {
  hiddenCountryDiscr();
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function hiddenCountryDiscr() {
  ref.countryList.innerHTML = '';
  ref.countryInfo.innerHTML = '';
  ref.countryInfo.setAttribute('js-hidden', '');
}

function createCountriesList(data) {
  data.map(item => {
    const {
      name: { official: country },
      flags: { svg: flag },
    } = item;
    const htmlLiElements = `<li class="country-item"><img src="${flag}" alt="Country flag" width="50" height ="25"><p>${country}</p></li>`;
    ref.countryList.innerHTML += htmlLiElements;
  });
}

function createCountyDiscription(data) {
  ref.countryInfo.removeAttribute('js-hidden');
  const {
    name: { official: country },
    capital,
    population,
    flags: { svg: flag },
    languages: lang,
    area,
    latlng: countryCoordinats,
    capitalInfo: { latlng: capitalCoordinats },
  } = data[0];

  const htmlInfo = `<img src="${flag}" alt="Country flag" width="100"><h1>${country}</h1>
      <p class="disc-text">Capital: ${capital.join(', ')}</p>
      <p class="disc-text">Population: ${(population / 1000000).toFixed(
        2
      )} M people</p>
      <p class="disc-text">Language(s): ${Object.values(lang).join(', ')}</p>
      <div id="map"></div>`;
  ref.countryInfo.innerHTML = htmlInfo;

  createMap(country, capital, area, countryCoordinats, capitalCoordinats);
}

function createMap(
  country,
  capital,
  area,
  countryCoordinats,
  capitalCoordinats
) {
  var map = L.map('map').setView(
    countryCoordinats,
    Math.round(-0.74 * Math.log(area) + 14)
  );

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  L.marker(capitalCoordinats)
    .addTo(map)
    .bindPopup(`Here ${capital}! It is the capital of ${country}!`)
    .openPopup();
}
