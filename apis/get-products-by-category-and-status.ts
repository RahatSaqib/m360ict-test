import { Request, Response } from "express";
import knex from "../config/connectToDatabase";
import { processProducts, tables } from "../common/common";

/**
*  Function for get all category ids related child category from db
@param categoryIds: where we store all categories
@param categoryId: id which will query for parent_id

*/
const getCategoryId = async (categoryIds: any, categoryId: any): Promise<string[]> => {
    let category = await knex(tables.categories).select(['id', 'parent_id']).where('id', categoryId).first()
    categoryIds.push(categoryId)
    if (category.parent_id && category.parent_id !== 'null') {
        return await getCategoryId(categoryIds, category.parent_id)
    }
    return categoryIds

}

/**
* API Function for getting products by category and status from db
@param req: request from client side
@param res: res which will recieve on client side
*/

const getProductsByCategoryAndStatus = async (req: Request, res: Response) => {
    try {
        let { categoryId, status } = req.body
        let products: any = []
        let fieldsToFetch = ['id', 'name', 'description', 'barcode', 'price', 'status']

        if (categoryId) {
            let category = await knex(tables.categories).select(['id', 'parent_id']).where('id', categoryId).first()
            let categoryIds = [category.id]
            if (category.parent_id && category.parent_id !== 'null') {
                categoryIds = await getCategoryId(categoryIds, category.parent_id)
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
                products = await knex(tables.products).select(fieldsToFetch)
                    .whereIn('id', modifiedProductIds)
            }
            else {
                products = await knex(tables.products).select(fieldsToFetch)
                    .whereIn('id', modifiedProductIds).where('status', status)
            }
        }
        else if (!categoryId && status) {
            products = await knex(tables.products).select(fieldsToFetch)
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