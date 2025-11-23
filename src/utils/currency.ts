const USD_TO_INR = 82;

/**
 * Converts USD salary range to INR in lakhs format
 * Example: "$65k - $140k" -> "₹5L - ₹11.5L"
 */
export function formatToINR(salaryString: string): string {
  // Extract numbers from string like "$65k - $140k" or "$65k"
  const matches = salaryString.match(/\$(\d+)k\s*-\s*\$(\d+)k/);
  
  if (matches) {
    const minUSD = parseInt(matches[1]);
    const maxUSD = parseInt(matches[2]);
    
    const minINR = (minUSD * USD_TO_INR) / 100; // Convert to lakhs
    const maxINR = (maxUSD * USD_TO_INR) / 100;
    
    // Round to nearest 0.5 lakh
    const minRounded = Math.round(minINR * 2) / 2;
    const maxRounded = Math.round(maxINR * 2) / 2;
    
    return `₹${minRounded}L - ₹${maxRounded}L`;
  }
  
  // Single value format
  const singleMatch = salaryString.match(/\$(\d+)k/);
  if (singleMatch) {
    const usd = parseInt(singleMatch[1]);
    const inr = (usd * USD_TO_INR) / 100;
    const rounded = Math.round(inr * 2) / 2;
    return `₹${rounded}L`;
  }
  
  return salaryString;
}
