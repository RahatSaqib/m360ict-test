import { Request, Response } from "express";
import knex from "../config/connectToDatabase";
import { processProducts, tables } from "../common/common";

/**
* API Function for SEARCH procucts from db
@param req: request from client side
@param res: res which will recieve on client side
*/

const searchProductsApi = async (req: Request, res: Response) => {
    try {
        let { searchString } = req.body
        let products = await knex(tables.products).select(['id', 'name', 'description', 'barcode', 'price', 'status'])
            .whereRaw(`LOWER(name) like '%${searchString.toLowerCase()}%'`)
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
export default searchProductsApi