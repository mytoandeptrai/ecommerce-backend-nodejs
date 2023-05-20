'use strict';
const { BadRequestError } = require('../core/error.response');

const {
   product,
   clothing,
   electronic,
   furniture,
} = require('../models/product.model');
const { insertInventory } = require('../models/repositories/inventory.repo');
const {
   findAllDraftForShop,
   publishProductByShop,
   findAllPublishForShop,
   unPublishProductByShop,
   searchProductByUser,
   findAllProducts,
   findProduct,
   updateProductById,
} = require('../models/repositories/product.repo');
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils');

/** combine factory and strategy patterns class to create product */
class ProductFactory {
   /**
    * @param {string} type
    * @param {requestBody} payload
    */

   static productRegistry = {}; /** contains key-class */

   static registerProductType(type, classRef) {
      this.productRegistry[type] = classRef;
   }

   /** MUTATIONS */
   static async createProduct(type, payload) {
      const productClass = this.productRegistry[type];
      if (!productClass)
         throw new BadRequestError(`Invalid type product ${type}`);

      return new productClass(payload).createProduct();
   }

   static async updateProduct(type, productId, payload) {
      const productClass = this.productRegistry[type];
      if (!productClass)
         throw new BadRequestError(`Invalid type product ${type}`);

      return new productClass(payload).updateProduct(productId);
   }

   static async publishProductByShop({ product_shop, product_id }) {
      return await publishProductByShop({ product_shop, product_id });
   }

   static async unPublishProductByShop({ product_shop, product_id }) {
      return await unPublishProductByShop({ product_shop, product_id });
   }

   /** QUERIES */
   static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
      const query = { product_shop, isDraft: true };
      return await findAllDraftForShop({ query, limit, skip });
   }

   static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
      const query = { product_shop, isPublish: true };
      return await findAllPublishForShop({ query, limit, skip });
   }

   static async getListSearchProduct({ keySearch }) {
      return await searchProductByUser({ keySearch });
   }

   static async findAllProducts({
      limit = 50,
      sort = 'ctime',
      page = 1,
      filter = { isPublish: true },
   }) {
      const select = ['product_name', 'product_price', 'product_thumb', 'product_shop'];

      return await findAllProducts({
         limit,
         sort,
         filter,
         page,
         select,
      });
   }

   static async findProduct({ product_id }) {
      return await findProduct({ product_id, unSelect: ['__v'] });
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
      const newProduct = await product.create({ ...this, _id: product_id });

      if (newProduct) {
         /** add product_stock in inventory collection */
         await insertInventory({
            productId: newProduct._id,
            shopId: this.product_shop,
            stock: this.product_quantity,
         });
      }

      return newProduct;
   }

   async updateProduct(productId, bodyUpdate) {
      return await updateProductById({ productId, bodyUpdate, model: product });
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

   async updateProduct(productId) {
      /**
       * FLOWS:
       * STEP 1: Remove all attr has undefined or null
       * STEP 2: Check needed field to update
       */
      const objectParams = removeUndefinedObject(this);
      if (objectParams.product_attributes) {
         /** update child */
         const correctObjectParams = updateNestedObjectParser(
            objectParams.product_attributes
         );
         await updateProductById({
            productId,
            bodyUpdate: correctObjectParams,
            model: clothing,
         });
      }

      const updateProduct = await super.updateProduct(
         productId,
         updateNestedObjectParser(objectParams)
      );
      return updateProduct;
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
         throw new BadRequestError('Create new Electronic error');

      /** super is extended class */
      const newProduct = await super.createProduct(newElectronic._id);
      if (!newProduct) throw new BadRequestError('Create new Product error');

      return newProduct;
   }
}
class Furniture extends Product {
   async createProduct() {
      const body = {
         ...this.product_attributes,
         product_shop: this.product_shop,
      };

      const newFurniture = await furniture.create(body);
      if (!newFurniture)
         throw new BadRequestError('Create new Furniture error');

      /** super is extended class */
      const newProduct = await super.createProduct(newFurniture._id);
      if (!newProduct) throw new BadRequestError('Create new Product error');

      return newProduct;
   }
}

/** Register for product type above */
ProductFactory.registerProductType('Electronics', Electronic);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
