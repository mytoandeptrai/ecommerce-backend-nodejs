'use strict';

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

// Declare the Schema of the Mongo model
var InventorySchema = new mongoose.Schema(
   {
      inven_productId: {
         type: mongoose.Types.ObjectId,
         ref: 'Product',
      },
      inven_location: { type: String, default: 'unknown' },
      inven_stock: { type: Number, require: true },
      ivent_shopeId: {
         type: mongoose.Types.ObjectId,
         ref: 'Shop',
      },
      iven_reservation: { type: Array, default: [] },
   },
   {
      timestamps: true,
      collection: COLLECTION_NAME,
   }
);

//Export the model
module.exports = { inventory: mongoose.model(DOCUMENT_NAME, InventorySchema) };
