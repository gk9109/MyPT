

export async function searchProductsByName(query) {
  if (!query) return [];

  const normalizedQuery = query.trim().toLowerCase();
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(normalizedQuery)}&search_simple=1&action=process&json=1&page_size=15`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.products || data.products.length === 0) return [];

    // Map, and filter
    const results = data.products
      .filter((p) => p.product_name && p.nutriments) // must have name + nutrition
      .map((p) => ({
        id: p.code,
        name: p.product_name,
        brand: p.brands || "",
        calories: p.nutriments["energy-kcal_100g"] || 0,
        protein: p.nutriments["proteins_100g"] || 0,
        fat: p.nutriments["fat_100g"] || 0,
        carbs: p.nutriments["carbohydrates_100g"] || 0,
        quantity: p.quantity || "",
        serving: p.serving_size || "",
        image: p.image_front_small_url || "",
      }))
      // Local filter for better match
      .filter((p) => {
        const q = normalizedQuery;
            return (
              p.name.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q)
            );
      });

    return results.slice(0, 10); // limit to 10 clean results
  } catch (error) {
    console.error("Error searching OpenFoodFacts:", error);
    return [];
  }
}
