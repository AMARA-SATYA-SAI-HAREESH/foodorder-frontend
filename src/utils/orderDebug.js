// src/utils/orderDebug.js
export const debugOrderCreation = (items, token) => {
  console.group("🛒 Order Debug Information");
  console.log("Token exists:", !!token);
  console.log("Number of items:", items.length);

  items.forEach((item, index) => {
    console.log(`Item ${index + 1}:`, {
      id: item._id,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      restaurantId: item.restaurantId,
      hasRestaurantId: !!item.restaurantId,
    });
  });

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  console.log("Total amount:", totalAmount);

  const restaurantIds = [
    ...new Set(items.map((item) => item.restaurantId).filter((id) => id)),
  ];
  console.log("Unique restaurant IDs:", restaurantIds);

  console.groupEnd();

  return {
    hasToken: !!token,
    itemCount: items.length,
    totalAmount,
    restaurantIds,
    allItemsHaveRestaurantId: items.every((item) => item.restaurantId),
  };
};
