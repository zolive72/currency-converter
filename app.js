const baseCurrencyContainer = document.querySelector('[data-js="currency-one"]');
const targetCurrencyContainer = document.querySelector('[data-js="currency-two"]');
const amountToConvertContainer = document.querySelector('[data-js="currency-one-times"]');
const convertedAmountContainer = document.querySelector('[data-js="converted-value"]');
const unit_rateContainer = document.querySelector('[data-js="conversion-precision"]');

const getUTCDate = () => new Date().toUTCString().slice(0, 16);

const insertUnit_rateInDOM = () => {
  const { value: baseCurrency, rates } = baseCurrencyContainer;
  const { value: targetCurrency } = targetCurrencyContainer;

  unit_rateContainer.innerHTML = `1 ${baseCurrency} = ${rates[targetCurrency]} ${targetCurrency}`;
};

const insertConvertedAmountInDOM = (amount = 1) => {
  amountToConvertContainer.value = amount;
  const { value: targetCurrency } = targetCurrencyContainer;
  const { rates } = baseCurrencyContainer;

  convertedAmountContainer.textContent = (rates[targetCurrency] * amount).toFixed(2);
};

const createOptions = (currencyContainer, currencySelected, currencies) =>
  currencies.forEach(currency =>
    currencyContainer.innerHTML += currency === currencySelected
      ? `<option value = ${currency} selected>${currency}</option>`
      : `<option value = ${currency}>${currency}</option>`
  );

const storeRatesInLocalStorage = (rates, baseCurrencyWithDate) => {
  const JSONrates = JSON.stringify(rates);
  localStorage.setItem(baseCurrencyWithDate, JSONrates);
}

const getRates = async (baseCurrency) => {
  const baseCurrencyWithDate = `${baseCurrency} - ${getUTCDate()}`;
  const localStorageRates = localStorage.getItem(baseCurrencyWithDate);

  baseCurrencyContainer.rates = localStorageRates
    ? JSON.parse(localStorageRates)
    : await getFetchData(baseCurrency)

  if (!localStorageRates) {
    storeRatesInLocalStorage(baseCurrencyContainer.rates, baseCurrencyWithDate);
  }
  
  if (!baseCurrencyContainer.childElementCount) {
    let currencies = Object.keys(baseCurrencyContainer.rates);
    createOptions(baseCurrencyContainer, baseCurrency, currencies);
    createOptions(targetCurrencyContainer, 'BRL', currencies);
  }
  
  insertConvertedAmountInDOM();
  insertUnit_rateInDOM();
}

getRates('USD');

const changeBaseCurrency = ({ target }) => getRates(target.value);
const calculateConvertedAmount = ({ target }) => insertConvertedAmountInDOM(target.value);
const changeTargetCurrency = () => {
  insertConvertedAmountInDOM();
  insertUnit_rateInDOM();
};

baseCurrencyContainer.addEventListener('change', changeBaseCurrency);
targetCurrencyContainer.addEventListener('change', changeTargetCurrency);
amountToConvertContainer.addEventListener('input', calculateConvertedAmount);