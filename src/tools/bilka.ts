export async function getBilkaDiscounts(): Promise<string> {
  console.log("Tool getBilkaDiscounts called");
  // Replace this with your real data fetching logic
  const data = await fetch("https://your.bilka.api/discounts").then(res => res.json());
  return JSON.stringify(data);
}
