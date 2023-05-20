'use strict';

'use strict';

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';

// Declare the Schema of the Mongo model
var discountSchema = new mongoose.Schema(
   {
      discount_name: { type: String, required: true },
      discount_description: { type: String, required: true },
      discount_type: {
         type: String,
         default: 'fixed_amount',
      } /** fix_amount or percentage */,
      discount_value: { type: Number, required: true },
      discount_code: { type: String, required: true },
      discount_start_date: { type: Date, required: true },
      discount_end_date: { type: Date, required: true },
      discount_max_uses: {
         type: Number,
         required: true,
      } /** maximum using for users */,
      discount_max_value: {
         type: Number,
         required: true,
      },
      discount_uses_count: {
         type: Number,
         required: true,
      } /** how many discount has been used */,
      discount_users_used: { type: Array, default: [] },
      discount_max_uses_per_user: {
         type: Number,
         default: 1,
         required: true,
      } /** number accept using for each user */,
      discount_min_order_value: {
         type: Number,
         required: true,
      },
      discount_shopId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Shop',
      },
      discount_is_active: {
         type: Boolean,
         default: true,
      },
      discount_applies_to: {
         type: String,
         required: true,
         enum: ['all', 'specific'],
      },
      discount_product_ids: {
         type: Array,
         default: [],
      } /** number of products has been accepted to use this discount */,
   },
   {
      timestamps: true,
      collection: COLLECTION_NAME,
   }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, discountSchema);
