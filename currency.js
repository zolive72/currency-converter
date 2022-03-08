const APIKey = "3831f1d112ccec4e26008713";

const getFetchData = async (baseCurrency = "USD") => {
  const url = `https://v6.exchangerate-api.com/v6/${APIKey}/latest/${baseCurrency}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Não foi possível obter os dados');
    }

    const { conversion_rates } = await response.json();

    return conversion_rates;
  } catch (error) {
    alert(`Um erro aconteceu: %c${error.message}`);
  }
}
