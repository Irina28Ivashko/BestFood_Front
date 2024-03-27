//  для пересчета энергетической ценности продукта в зависимости от его массы

export const calculateNutritionalValue = (product, grams) => {
  return {
    calories: (product.calories * grams) / 100,
    proteins: (product.proteins * grams) / 100,
    fats: (product.fats * grams) / 100,
    carbohydrates: (product.carbohydrates * grams) / 100,
  };
};
