'use strict';

const { Schema } = require('mongoose');
const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
   {
      product_name: {
         type: String,
         required: true,
      },
      product_thumb: {
         type: String,
         required: true,
      },
      product_description: {
         type: String,
      },
      product_price: {
         type: Number,
         required: true,
      },
      product_quantity: {
         type: Number,
         required: true,
      },
      product_type: {
         type: String,
         required: true,
         enum: ['Electronic', 'Clothing', 'Furniture'],
      },
      product_attributes: {
         type: Schema.Types.Mixed,
         required: true,
      },
      product_shop: {
         type: mongoose.Types.ObjectId,
         ref: 'Shop',
      },
   },
   {
      timestamps: true,
      collection: COLLECTION_NAME,
   }
);

/** define the product type = clothing */

const clothingSchema = new Schema(
   {
      brand: { type: String, required: true },
      size: { type: String },
      material: { type: String },
      product_shop: {
         type: mongoose.Types.ObjectId,
         ref: 'Shop',
      },
   },
   {
      collection: 'clothes',
      timestamps: true,
   }
);

const electronicSchema = new Schema(
   {
      manufacturer: { type: String, required: true },
      model: { type: String },
      color: { type: String },
      product_shop: {
         type: mongoose.Types.ObjectId,
         ref: 'Shop',
      },
   },
   {
      collection: 'electronics',
      timestamps: true,
   }
);

//Export the model
module.exports = {
   product: mongoose.model(DOCUMENT_NAME, productSchema),
   clothing: mongoose.model('Clothing', clothingSchema),
   electronic: mongoose.model('Electronics', electronicSchema),
};
