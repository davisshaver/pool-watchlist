// @TODO Replace w/ function mapping to $###.##m, $###.##k, etc.
export const formatterUSD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
