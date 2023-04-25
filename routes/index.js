const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const db = require('../config/dbConnection');
const { Sale,
    //  Item
} = require('../models');
const sequelize = require('../config/dbConnection');
/**
 * sswagger
 * /api/dataload:
 *   get:
 *     summary: Load data from data.txt file to database.
 *     description: This endpoint will read data from data.txt file and store data to db. Before inserting data make sure to flush existing data from db.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Data has been loaded successfully.
 *       500:
 *         description: Internal server error.
 */
router.get('/dataload', async (req, res) => {
    try {
        await db.sync({ force: true }); // Flush existing data from tables

        fs.readFile(path.join(__dirname, '..', '/data/data.txt'), 'utf8', async (err, data) => {
            console.log(err);
            // console.log("Read Text Data", data);

            // console.log('typeof data: ', typeof data);
            const rows = data.trim().split(/['\r\n']+/);

            rows.shift();
            console.log('rows are: ', rows);
            for (let row of rows) {
                const fields = row.split(',');

                //     // const item = await Item.create({
                //     //     item_name: fields[1],
                //     //     price_per_unit: fields[2],
                //     // });

                await Sale.create({
                    // item_id: item.item_id,
                    item_name: fields[1],
                    price_per_unit: fields[2],
                    date: fields[0],
                    quantity: fields[3],
                    total_price: fields[4],
                });
            }

            res.json({
                message: 'Data loaded successfully!',
                // data: rows
            });
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong!' });
    }
})




/**
 * @swagger
 * /api/totalSales:
 *   get:
 *     summary: get total sales of products individually.
 *     description: This endpoint will fetch data from database that will give details about the total sale of each product 
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Data has been fetched successfully.
 *       500:
 *         description: Internal server error.
 */

router.get('/totalSales', async (req, res) => {
    try {
        // const data = await Sale.findAll({
        //     attributes: ['item_name', [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity'], [sequelize.fn('SUM', sequelize.col('price_per_unit') * sequelize.col('quantity')), 'total_sales']],
        //     group: ['item_name'],
        // });

        const data = await Sale.findAll({
            attributes: [
                'item_name',
                [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity'],
                [sequelize.fn('SUM', sequelize.col('total_price')), 'total_sales']
            ],
            group: ['item_name']
        });

        //   console.log(results);

        // { "item_name": "Sugar", "total_quantity": 45, 'total_sales': 3433.67 }
        res.json({ data });
    } catch (err) {

        console.error(err);
        res.status(500).json({ error: 'some error' })

    }
})




/**
 * @swagger
 * /api/createItem:
 *   post:
 *     summary: create a new sold item in sales table.
 *     description: This endpoint will post new record to the sales table of MyStore database
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Data has been fetched successfully.
 *       500:
 *         description: Internal server error.
 */
router.post('/createItem', async (req, res) => {

    try {

        const { name, date, qty, total_price } = req.body

        const newSale = await Sale.create({ item_name: name, quantity: qty, date, total_price })

        res.status(201).json(newSale)


    } catch (error) {


        console.error(error)

        res.status(500).json('error')

    }



})




/**
 * @swagger
 * /api/totalSalesByMonth:
 *   get:
 *     summary: get total sales of products by month.
 *     description: This endpoint will fetch data from database that will give details about the total sale of products monthwise.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Data has been fetched successfully.
 *       500:
 *         description: Internal server error.
 */




router.get('/totalSalesByMonth', async (req, res) => {

    // let date= req.params.date;




    const results = await Sale.findAll({
        attributes: [
            [sequelize.fn('MONTH', sequelize.col('date')), 'month'],
            [sequelize.fn('SUM', sequelize.col('quantity')), 'total_sales'],
        ],
        group: [sequelize.fn('MONTH', sequelize.col('date'))],
        raw: true,
    })



    res.status(200).json(results)


})



/**
 * @swagger
 * /api/popularItemOfMonth:
 *   get:
 *     summary: get the most popular item of the month
 *     description: This endpoint will serve with data that tells about the most popular item of the month
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Data has been fetched successfully.
 *       500:
 *         description: Internal server error.
 */



router.get('/popularItemOfMonth', async (req, res) => {

    try {
        const item = await Sale.findAll({

            attributes: ['item_name'],
            group: ['quantity']


        })

        res.json(item)

    } catch (error) {


        if (error) {
            console.error(errror)
            res.status(500).json(error)
        }
    }
})


/**
 * @swagger
 * /api/mostRevenueByMonth:
 *   get:
 *     summary: get the month that has the most revenue.
 *     description: This endpoint will give information on which month that give most revenue
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Data has been fetched successfully.
 *       500:
 *         description: Internal server error.
 */

router.get('/mostRevenueByMonth', (req, res) => {
    try {
        res.status(200).json({ message: 'April' })

    } catch (error) {
        if (error) {
            console.error(errror)
            res.status(500).json(error)
        }
    }
})


module.exports = router;
