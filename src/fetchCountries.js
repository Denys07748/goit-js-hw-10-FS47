const BASE_URL = 'https://restcountries.com/v3.1';

export function fetchCountries(country) {
  return fetch(
    `${BASE_URL}/name/${country}?fields=name,capital,population,languages,flags`
  ).then(response => {
    return response.json();
  });
}
