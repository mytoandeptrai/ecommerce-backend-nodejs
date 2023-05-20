const { inventory } = require('../inventory.model');

const insertInventory = async ({
   productId,
   shopId,
   stock,
   location = 'unknown',
}) => {
   return await inventory.create({
      inven_productId: productId.toString(),
      inven_shopId: shopId.toString(),
      inven_location: location,
      inven_stock: stock,
   });
};

module.exports = {
   insertInventory,
};
