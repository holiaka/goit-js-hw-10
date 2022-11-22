// Fetch func.
export function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages,area,latlng,capitalInfo`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    console.dir(response);
    return response.json();
  });
}
