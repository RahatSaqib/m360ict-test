

import { createAttributesTable, createCategoryTable, createColorTable, createProductCategoriesTable, createProductsTable, createSizeTable } from './db-tables';
import knex from '../config/connectToDatabase';



export const tables: any = {
    products: "products",
    attributes: "product_attributes",
    sizes: "sizes",
    colors: "colors",
    categories: "categories",
    productCategories: "product_categories",
}

/**
 * Function for creating db tables if not exists
 */

export const checkTableExistOrNot = async () => {
    try {
        await createProductsTable()
        await createCategoryTable()
        await createProductCategoriesTable()
        await createSizeTable()
        await createColorTable()
        await createAttributesTable()
    }
    catch (err) {
        console.log(err)
    }
}

export const processProducts = async (products: any) => {
    try {
        for (let product of products) {
            let categoryIds = await knex(tables.productCategories).select(["category_id"]).where('product_id', product.id)
            for (let categoryId of categoryIds) {
                let category = await knex(tables.categories).select(["name"]).where('id', categoryId.category_id).first()
                if (!product.categories) product.categories = []
                product.categories.push(category.name)
            }


            let attributes = await knex(tables.attributes).select(["size_id", "color_id"]).where('product_id', product.id).first()
            if (attributes.size_id) {
                let sizeInfo = await knex(tables.sizes).select(["size_value"]).where('id', attributes.size_id).first()
                product.size = sizeInfo.size_value
            }
            if (attributes.color_id) {
                let colorInfo = await knex(tables.colors).select(["color_value"]).where('id', attributes.color_id).first()
                product.color = colorInfo.color_value
            }
        }
        return products
    }
    catch (err) {
        throw err
    }
}




