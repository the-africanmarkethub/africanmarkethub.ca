export const formatAmount = (
  value: string | number = 0,
  currency: string = "CAD",
  locale: string = "en-CA"
) => {
  const numericValue = Number(value);
  const amount = isNaN(numericValue) ? 0 : numericValue;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    // "symbol" is the official way to get CA$ for CAD in en-CA.
    // In some browsers, if it defaults to just $, use "code" or
    // a custom string for the checkout page.
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
  }).format(amount);
};
