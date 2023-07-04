import { Request, Response } from "express";
import knex from "../config/connectToDatabase";
import { tables } from "../common/common";

/**
* API Function for Create categories
@param req: request from client side
@param res: res which will recieve on client side

*/

const createCategoriesApi = async (req: Request, res: Response) => {
    const { name, parent_id } = req.body;
    try {
        let response
        let isExist = await knex(tables.categories).select('*').where('name', name)
        if (!isExist.length)
            response = await knex(tables.categories).insert({ name, parent_id });
        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create a category.' });
    }

}

/**
* API Function for Read Categories
@param req: request from client side
@param res: res which will recieve on client side

*/

const readCategoriesApi = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
        const category = await knex(tables.categories).select('*').where('id', id);
        if (category.length) {
            const parentCategory = await knex(tables.categories).select('*').where('id', category[0].parent_id)
            let response = {
                ...category[0],
                parent_category: parentCategory[0].name
            }
            res.status(200).json({ response });
        }
        else {
            res.status(200).json({ category });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to read a category.' });
    }

}


/**
* API Function for Update Categories
@param req: request from client side
@param res: res which will recieve on client side

*/

const updateCategoriesApi = async (req: Request, res: Response) => {
    const { id, values } = req.body;
    let statusCode = 200
    let message = 'Successfully Updated category.'
    try {
        const category = await knex(tables.categories).select('*').where('id', id);
        if (category.length) {
            const updateCategory = await knex(tables.categories).where('id', id).update(values);
            if (!updateCategory) {
                statusCode = 404
                message = 'Failed to find a category.'
            }
        }
        else {
            statusCode = 404
            message = 'Failed to find a category.'
        }
        res.status(statusCode).json({ message });

    } catch (error) {
        res.status(500).json({ message: 'Failed to update a category.' });
    }

}

/**
* API Function for Delete Categories
@param req: request from client side
@param res: res which will recieve on client side

*/

const deleteCategoriesApi = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
        let deletedAttributes = await knex(tables.productCategories).where('category_id', id).del()
        if (deletedAttributes) {
            await knex(tables.categories)
                .where('id', id)
                .del()
        }

        res.status(200).json({ message: 'Successfully deleted a category.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update a category.' });
    }

}

export {
    createCategoriesApi,
    readCategoriesApi,
    updateCategoriesApi,
    deleteCategoriesApi
}