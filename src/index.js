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

  clearCountryInfo();
  clearCountryList();
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
    clearCountryList();
  }
}

function markupCountryList(countries) {
  const markupList = countries
    .map(
      ({ name, flags }) =>
        `<li>
        <div class = "countrylist">
            <img src = ${flags.svg} alt = "flag" class = "flag" width = 35 hight = 20>
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
        `<div class = "wrapper">
            <img src = ${flags.svg} alt = "flag" width = 50 hight = 30>
            <h1 name = "country">${name.official}</h1>
        </div>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Languages: ${Object.values(languages).join(',')}</p>`
    )
    .join('');

  refs.countryInfo.innerHTML = markup;
}

function fetchError() {
  clearCountryInfo();
  clearCountryList();
  console.log('THIS IS CATH!!!');
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function clearCountryList() {
  refs.countryList.innerHTML = '';
}

function clearCountryInfo() {
  refs.countryInfo.innerHTML = '';
}
