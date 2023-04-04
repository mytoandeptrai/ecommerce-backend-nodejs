'use strict';
const { BadRequestError } = require('../core/error.response');
/** USE FACTORY DESIGN PATTERN */

const { product, clothing, electronic } = require('../models/product.model');

/** define factory class to create product */
class ProductFactory {
   /**
    * @param {string} type
    * @param {requestBody} payload
    */
   static async createProduct(type, payload) {
      switch (type) {
         case 'Electronic':
            return new Electronic(payload).createProduct();
         case 'Clothing':
            return new Clothing(payload).createProduct();
         default:
            throw new BadRequestError(`Invalid type product ${type}`);
      }
   }
}

/** define basic product class based on product model*/
class Product {
   constructor({
      product_name,
      product_thumb,
      product_description,
      product_price,
      product_quantity,
      product_type,
      product_shop,
      product_attributes,
   }) {
      this.product_name = product_name;
      this.product_thumb = product_thumb;
      this.product_description = product_description;
      this.product_price = product_price;
      this.product_quantity = product_quantity;
      this.product_type = product_type;
      this.product_shop = product_shop;
      this.product_attributes = product_attributes;
   }

   /** create new product */
   async createProduct(product_id) {
      return await product.create({ ...this, _id: product_id });
   }
}

/** define class for different product types Clothing */
class Clothing extends Product {
   async createProduct() {
      const body = {
         ...this.product_attributes,
         product_shop: this.product_shop,
      };

      const newClothing = await clothing.create(body);
      if (!newClothing) throw new BadRequestError('Create new Clothing error');

      /** super is extended class */
      const newProduct = await super.createProduct(newClothing._id);
      if (!newProduct) throw new BadRequestError('Create new Product error');

      return newProduct;
   }
}

/** define class for different product types Electronic */
class Electronic extends Product {
   async createProduct() {
      const body = {
         ...this.product_attributes,
         product_shop: this.product_shop,
      };

      const newElectronic = await electronic.create(body);
      if (!newElectronic)
         throw new BadRequestError('Create new Clothing error');

      /** super is extended class */
      const newProduct = await super.createProduct(newElectronic._id);
      if (!newProduct) throw new BadRequestError('Create new Product error');

      return newProduct;
   }
}

module.exports = ProductFactory;
