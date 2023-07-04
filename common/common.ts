
import fs from 'fs';
import csv from "csv-parser";
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
 * Function for wait process by specific time
 * @param ms : time you need to wait
 */

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Function for reading file from csv
 * @param filepath : path of csv file
 */

export const readFileFromCsv = async (filepath: string) => {
    var csvData: any = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filepath)
            .pipe(csv())
            .on('data', function (csvrow) {
                //do something with csvrow
                csvData.push(csvrow);
            })
            .on('end', function () {
                //do something with csvData
                resolve(csvData)
            });
    })
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
                let category = await knex(tables.categories).select(["name"]).where('id', categoryId.category_id)
                if (!product.categories) product.categories = []
                product.categories.push(category[0].name)
            }


            let attributes = await knex(tables.attributes).select(["size_id", "color_id"]).where('product_id', product.id)
            if (attributes[0].size_id) {
                let sizeInfo = await knex(tables.sizes).select(["size_value"]).where('id', attributes[0].size_id)
                product.size = sizeInfo[0].size_value
            }
            if (attributes[0].color_id) {
                let colorInfo = await knex(tables.colors).select(["color_value"]).where('id', attributes[0].color_id)
                product.color = colorInfo[0].color_value
            }
        }
        return products
    }
    catch (err) {
        throw err
    }
}



