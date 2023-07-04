import { Request, Response } from "express";
import knex from "../config/connectToDatabase";
import { processProducts, tables } from "../common/common";

/**
* API Function for SEARCH properties from db
@param req: request from client side
@param res: res which will recieve on client side
@param next: if I need to go throw any kind of function after processing business logic.
*/

const searchProductsApi = async (req: Request, res: Response) => {
    try {
        let { searchString } = req.body
        let products = await knex(tables.products).select(['id', 'name', 'description', 'barcode', 'price', 'status'])
            .whereRaw(`LOWER(name) like '%${searchString}%'`)
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