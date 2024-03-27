export const energyRecipe = (ingredients) => {
  const total = ingredients.reduce(
    (acc, ingredient) => {
      // Пересчитываем вес ингредиента в граммы, если указаны нестандартные единицы измерения
      const weightInGrams =
        ingredient.unit === 'гр' ? ingredient.amount : ingredient.amount * ingredient.unitWeight;

      acc.calories += (ingredient.calories * weightInGrams) / 100;
      acc.proteins += (ingredient.proteins * weightInGrams) / 100;
      acc.fats += (ingredient.fats * weightInGrams) / 100;
      acc.carbohydrates += (ingredient.carbohydrates * weightInGrams) / 100;
      acc.totalGrams += weightInGrams;

      return acc;
    },
    { calories: 0, proteins: 0, fats: 0, carbohydrates: 0, totalGrams: 0 },
  );

  if (total.totalGrams === 0) {
    return { calories: 0, proteins: 0, fats: 0, carbohydrates: 0 };
  }

  // Расчет энергетической ценности на 100 грамм
  const per100Grams = {
    calories: (total.calories / total.totalGrams) * 100,
    proteins: (total.proteins / total.totalGrams) * 100,
    fats: (total.fats / total.totalGrams) * 100,
    carbohydrates: (total.carbohydrates / total.totalGrams) * 100,
  };

  return per100Grams;
};
