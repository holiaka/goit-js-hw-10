export function fetchCountries(name) {
    fetch(
        `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
    ).then(response => {
        if (!response.ok) {
            throw new Error(response.status);
        }
        return response.json();
    }).then(
        data => {
            preprocessingData(data);
    }).catch (
    error => console.log(error)
    );  
}

function preprocessingData(data) {
    data.map(iter => {
        let { name: { official: contry }, capital, population, flags: {svg: flag}, languages: lang } = iter;
        console.log(contry, ...capital, population, flag, ...Object.values(lang));
    });
    console.log([...data]);
}