import Notiflix from 'notiflix';

const countryListRef = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

export function fetchCountries(name) {
  fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages,area,latlng,capitalInfo`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status)
      }
      console.dir(response);
      return response.json()
    })
    .then(data => {
      preprocessingData(data)
    })
    .catch(error => {
      onFetchError(error)
    });
}

function preprocessingData(data) {
  countryListRef.innerHTML = '';
  countryInfo.innerHTML = '';

  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length > 1 && data.length <= 10) {
    data.map(item => {
      let {
        name: { official: country },
        flags: { svg: flag },
      } = item;
      let htmlLiElements = `<li class="country-item"><img src="${flag}" alt="Country flag" width="50" height ="25"><p>${country}</p></li>`;
      countryListRef.innerHTML += htmlLiElements;
    });
  } else {
    countryInfo.removeAttribute('js-hidden');
    let {
      name: { official: country },
      capital,
      population,
      flags: { svg: flag },
      languages: lang,
      area,
      latlng: countryCoordinats,
      capitalInfo: { latlng: capitalCoordinats },
    } = iter;

    let htmlInfo = `<img src="${flag}" alt="Country flag" width="100"><h1>${country}</h1>
      <p class="disc-text">Capital: ${capital.join(', ')}</p>
      <p class="disc-text">Population: ${(population / 1000000).toFixed(
        2
      )} M people</p>
      <p class="disc-text">Language(s): ${Object.values(lang).join(', ')}</p>
      <div id="map"></div>`;
    countryInfo.innerHTML = htmlInfo;

    createMap(country, capital, area, countryCoordinats, capitalCoordinats);
  }
}

function onFetchError(error) {
  countryListRef.innerHTML = '';
  countryInfo.innerHTML = '';

  Notiflix.Notify.failure('Oops, there is no country with that name');
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
    Math.round(-0.74 * Math.log(area) + 13)
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
