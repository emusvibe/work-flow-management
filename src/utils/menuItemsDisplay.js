
const navNames = [
  "Create Job",
  "View Job",
  "Create Invoice",
  "View Invoice",
  "Create Quotation",
  "View Quotation",
  "View Client",
]
export const menuItemsDisplay = (navName) => {
  if(navNames.includes(navName)){
    return true
  }
  return false;
}