import { Request, Response } from "express";
import knex from "../config/connectToDatabase";
import { processProducts, tables } from "../common/common";

/**
* API Function for Create Products
@param req: request from client side
@param res: res which will recieve on client side

*/

const createProductsApi = async (req: Request, res: Response) => {
    const { mainInfo, categoryIds, attributes } = req.body;
    try {
        let response
        let isExist = await knex(tables.products).select('*').where('barcode', mainInfo.barcode)
        if (!isExist.length)
            response = await knex(tables.products).insert(mainInfo);
        if (response) {

            //Add Category Id to product-categories table
            for (let categoryId of categoryIds) {
                await knex(tables.productCategories).insert({
                    product_id: response[0],
                    category_id: categoryId

                });
            }

            //Add Attributes  to product-attrobutes table
            await knex(tables.attributes).insert({
                product_id: response[0],
                size_id: attributes.sizeId,
                color_id: attributes.colorId
            });

        }

        res.status(200).json({ message: 'Successfully created product' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create a category.' });
    }

}

/**
* API Function for Read Products
@param req: request from client side
@param res: res which will recieve on client side
*/

const readProductsApi = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
        let products = await knex(tables.products).select(['id', 'name', 'description', 'barcode', 'price', 'status'])
            .where('id', id)

        //Process Products and add info from attributes and categories table
        products = await processProducts(products)

        res.status(200).json({
            success: true,
            data: products
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            data: []
        })
    }

}


/**
* API Function for Update Products
@param req: request from client side
@param res: res which will recieve on client side

*/

const updateProductsApi = async (req: Request, res: Response) => {
    const { id, values } = req.body;
    let statusCode = 200
    let message = 'Successfully Updated Product.'
    try {
        let products = await knex(tables.products).select('*').where('id', id)
        if (products.length) {

            // If m
            if (values.mainInfo) {
                const updateProduct = await knex(tables.products).where('id', id).update({ ...products, ...values.mainInfo });
                if (!updateProduct) {
                    statusCode = 404
                    message = 'Failed to find a product.'
                }
            }

            if (values.categoryIds.length) {
                await knex(tables.productCategories)
                    .where('product_id', id)
                    .del()
                for (let categoryId of values.categoryIds) {
                    await knex(tables.productCategories).insert({
                        product_id: id,
                        category_id: categoryId

                    });
                }
            }

            if (values.attributes) {
                let attributes = await knex(tables.attributes).select('*').where('product_id', id).first()

                if (typeof values.attributes.sizeId !== "undefined") {
                    values.attributes.size_id = values.attributes.sizeId
                    delete values.attributes.sizeId
                }
                if (typeof values.attributes.colorId !== "undefined") {
                    values.attributes.color_id = values.attributes.colorId
                    delete values.attributes.colorId
                }
                await knex(tables.attributes).update({ ...attributes, ...values.attributes });
            }

        }
        else {
            statusCode = 404
            message = 'Failed to find a product.'
        }
        res.status(statusCode).json({ message });

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Failed to update a product.' });
    }

}

/**
* API Function for Delete Categories
@param req: request from client side
@param res: res which will recieve on client side
*/

const deleteProductsApi = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
        await knex(tables.productCategories).where('product_id', id).del()
        await knex(tables.attributes).where('product_id', id).del()
        await knex(tables.products).where('id', id).del()
        res.status(200).json({ message: 'Successfully deleted a product.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update a product.' });
    }

}

export {
    createProductsApi,
    readProductsApi,
    updateProductsApi,
    deleteProductsApi
}