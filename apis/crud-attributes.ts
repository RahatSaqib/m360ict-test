import { Request, Response } from "express";
import knex from "../config/connectToDatabase";
import { tables } from "../common/common";

/**
* API Function for Create Attributes
@param req: request from client side
@param res: res which will recieve on client side
@param next: if I need to go throw any kind of function after processing business logic.
*/

const createAttributesApi = async (req: Request, res: Response) => {
    const { name, value } = req.body;
    try {
        let response
        if (name == 'color') {
            let isExist = await knex(tables.colors).select('*').where('color_value', value)
            if (!isExist.length)
                response = await knex(tables.colors).insert({ color_value: value });
        } else {
            let isExist = await knex(tables.sizes).select('*').where('size_value', value)
            if (!isExist.length)
                response = await knex(tables.sizes).insert({ size_value: value });
        }

        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create a attribute.' });
    }

}

/**
* API Function for Read Attributes
@param req: request from client side
@param res: res which will recieve on client side
@param next: if I need to go throw any kind of function after processing business logic.
*/

const readAttributesApi = async (req: Request, res: Response) => {
    const { id, name } = req.body;
    try {
        let tableName = tables.sizes
        if (name == 'color') {
            tableName = tables.colors
        }
        let response = await knex(tableName).select('*').where('id', id);

        res.status(200).json({ response });

    } catch (error) {
        res.status(500).json({ message: 'Failed to read a attribute.' });
    }

}


/**
* API Function for Update Attributes
@param req: request from client side
@param res: res which will recieve on client side
@param next: if I need to go throw any kind of function after processing business logic.
*/

const updateAttributesApi = async (req: Request, res: Response) => {
    const { id, values, name } = req.body;
    let statusCode = 200
    let message = 'Successfully updated attribute.'
    try {
        let tableName = tables.sizes
        if (name == 'color') {
            tableName = tables.colors
        }
        const attributes = await knex(tableName).select('*').where('id', id);
        if (attributes.length) {
            const updateCategory = await knex(tableName).where('id', id).update(values);
            if (!updateCategory) {
                statusCode = 404
                message = 'Failed to find a attribute.'
            }
        }
        else {
            statusCode = 404
            message = 'Failed to find a attribute.'
        }
        res.status(statusCode).json({ message });

    } catch (error) {
        res.status(500).json({ message: 'Failed to update a attribute.' });
    }

}

/**
* API Function for Delete Attributes
@param req: request from client side
@param res: res which will recieve on client side
@param next: if I need to go throw any kind of function after processing business logic.
*/

const deleteAttributesApi = async (req: Request, res: Response) => {
    const { id, name } = req.body;
    try {
        let tableName = tables.sizes
        let attribute_id = 'size_id'
        if (name == 'color') {
            tableName = tables.colors
            attribute_id = 'color_id'
        }
        let updateAttributes = await knex(tables.attributes).where(attribute_id, id).update({ [attribute_id]: null })
        if (updateAttributes) {
            let response = await knex(tableName)
                .where('id', id)
                .del()
        }

        res.status(200).json({ message: 'Successfully deleted a attribute.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete a attribute.' });
    }

}

export {
    createAttributesApi,
    readAttributesApi,
    updateAttributesApi,
    deleteAttributesApi
}