


import knex from "../config/connectToDatabase";
import { tables } from "./common";

/**
* Query for Creating Products Table
*/

const createProductsTable = async () => {
    let exists = await knex.schema.hasTable(tables.products)
    if (!exists) {
        await knex.schema.createTable(tables.products, function (table) {
            table.increments('id', { primaryKey: true });
            table.string('name');
            table.text('description');
            table.string('barcode');
            table.double('price');
            table.string('status')
            table.timestamps({ defaultToNow: true });

        })
    }
}

/**
 * Query for Creating Categories Table
 */

const createCategoryTable = async () => {
    let exists = await knex.schema.hasTable(tables.categories)
    if (!exists) {
        await knex.schema.createTable(tables.categories, function (table) {
            table.increments('id', { primaryKey: true });
            table.string('name');
            table.integer('parent_id').unsigned().nullable();
            table.timestamps({ defaultToNow: true });

        })
    }
}

/**
 * Query for Creating Product Categories Table
 */

const createProductCategoriesTable = async () => {
    let exists = await knex.schema.hasTable(tables.productCategories)
    if (!exists) {
        await knex.schema.createTable(tables.productCategories, function (table) {
            table.increments('id', { primaryKey: true });
            table.integer('product_id').unsigned().nullable();
            table.integer('category_id').unsigned().nullable();
            table
                .foreign('product_id')
                .references('products.id')
            table
                .foreign('category_id')
                .references('categories.id')
            table.timestamps({ defaultToNow: true });

        })
    }
}

/**
* Query for Creating Attributes Table
*/

const createAttributesTable = async () => {
    let exists = await knex.schema.hasTable(tables.attributes)
    if (!exists) {
        await knex.schema.createTable(tables.attributes, function (table) {
            table.increments('id', { primaryKey: true });
            table.integer('product_id').unsigned().nullable();
            table.integer('size_id').unsigned().nullable();
            table.integer('color_id').unsigned().nullable();
            table
                .foreign('product_id')
                .references('products.id')
            table
                .foreign('size_id')
                .references('sizes.id')
            table
                .foreign('color_id')
                .references('colors.id')
            table.timestamps({ defaultToNow: true });

        })
    }
}

/**
* Query for Creating Attributes Table
*/

const createSizeTable = async () => {
    let exists = await knex.schema.hasTable(tables.sizes)
    if (!exists) {
        await knex.schema.createTable(tables.sizes, function (table) {
            table.increments('id', { primaryKey: true });
            table.string('size_value');
            table.timestamps({ defaultToNow: true });

        })
    }
}
/**
* Query for Creating Attributes Table
*/

const createColorTable = async () => {
    let exists = await knex.schema.hasTable(tables.colors)
    if (!exists) {
        await knex.schema.createTable(tables.colors, function (table) {
            table.increments('id', { primaryKey: true });
            table.string('color_value');
            table.timestamps({ defaultToNow: true });

        })
    }
}






export {
    createCategoryTable,
    createAttributesTable,
    createProductsTable,
    createSizeTable,
    createColorTable,
    createProductCategoriesTable
}