export const formatCurrency = (amount?: number | null, currency?: string): string => {
  if (amount === undefined || amount === null) return '₹0';
  const curr = currency?.toUpperCase() || 'INR';
  const symbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  const symbol = symbols[curr] || `${curr} `;
  const formattedNumber = Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formattedNumber}`;
};
