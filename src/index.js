import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
// import countryList from './templates/countryList.hbs';
// import countryInfo from './templates/countryInfo.hbs';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(findCountry, DEBOUNCE_DELAY));

function findCountry(e) {
  const findToCountry = e.target.value.trim();

  clearCountry();
  if (findToCountry === '') {
    return;
  }

  fetchCountries(findToCountry).then(renderCountry).catch(fetchError);
}

function renderCountry(country) {
  if (country.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
  if (country.length > 1 && country.length <= 10) {
    markupCountryList(country);
  } else if (country.length === 1) {
    markupCountryInfo(country);
  }
}

function markupCountryList(countries) {
  const markupList = countries
    .map(
      ({ name, flags }) =>
        `<li>
        <div class = "country-item">
            <img src = ${flags.svg} alt = "flag" class = "flag--small">
            <h2 name = "country">${name.official}</h2>
        </div>
        </li>`
    )
    .join('');

  refs.countryList.innerHTML = markupList;
}

function markupCountryInfo(countries) {
  const markup = countries
    .map(
      ({ name, capital, population, languages, flags }) =>
        `<div class = "country-item">
            <img src = ${flags.svg} class = "flag" alt = "flag">
            <h1 name = "country">${name.official}</h1>
        </div>
        <p class = "country-info">Capital: 
        <span class = "country-info-description">${capital}</span></p>
        <p class = "country-info">Population: 
        <span class = "country-info-description">${population}</span></p>
        <p class = "country-info">Languages: 
        <span class = "country-info-description">${Object.values(
          languages
        ).join(',')}</span></p>`
    )
    .join('');

  refs.countryInfo.innerHTML = markup;
}

function fetchError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function clearCountry() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
