import { Request, Response } from "express";
import knex from "../config/connectToDatabase";
import { processProducts, tables } from "../common/common";

/**
* API Function for SEARCH properties from db
@param req: request from client side
@param res: res which will recieve on client side
@param next: if I need to go throw any kind of function after processing business logic.
*/
const getCategoryId = async (categoryIds: any, categoryId: any): Promise<string[]> => {
    let category = await knex(tables.categories).select(['id', 'parent_id']).where('id', categoryId)
    categoryIds.push(categoryId)
    if (category[0].parent_id && category[0].parent_id !== 'null') {
        return await getCategoryId(categoryIds, category[0].parent_id)
    }
    return categoryIds

}
const getProductsByCategoryAndStatus = async (req: Request, res: Response) => {
    try {
        let { categoryId, status } = req.body
        let products: any = []
        if (categoryId) {
            let category = await knex(tables.categories).select(['id', 'parent_id']).where('id', categoryId)
            let categoryIds = [category[0].id]
            if (category[0].parent_id && category[0].parent_id !== 'null') {
                categoryIds = await getCategoryId(categoryIds, category[0].parent_id)
            }
            categoryIds = [...new Set(categoryIds)]
            let productIds = await knex(tables.productCategories).select(['product_id']).whereIn('category_id', categoryIds)
            let modifiedProductIds: any = []

            for (let product of productIds) {
                if (!modifiedProductIds.includes(product.product_id)) {
                    modifiedProductIds.push(product.product_id)
                }
            }

            if (!status) {
                products = await knex(tables.products).select(['id', 'name', 'description', 'barcode', 'price', 'status'])
                    .whereIn('id', modifiedProductIds)
            }
            else {
                products = await knex(tables.products).select(['id', 'name', 'description', 'barcode', 'price', 'status'])
                    .whereIn('id', modifiedProductIds).where('status', status)
            }
        }
        else if (!categoryId && status) {
            products = await knex(tables.products).select(['id', 'name', 'description', 'barcode', 'price', 'status'])
                .where('status', status)
        }
        else {
            res.status(300).json({
                success: false,
                message: "Filter parameter missing categoryId / status"
            })
            return
        }

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
export default getProductsByCategoryAndStatus