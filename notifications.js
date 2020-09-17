"use strict";

const _ = require("underscore");
const {
    Pool,
    Client
} = require("pg");

const TENANT_ID = 16959;

module.exports = {
    GetOrdersToday: function () {
        const self = this;
        let getOrderPromise = new Promise(function (resolve, reject) {
            let orderCount = 0;
            let orderTotal = 0.0;
            let sql = 'SELECT count("OrderSummaryId") as OrderCount, sum("OrderAmount") as OrderTotal FROM public."OrderSummary"';
            sql += ' WHERE "CreateDate" >= DATE_TRUNC(\'day\', CURRENT_TIMESTAMP AT TIME ZONE \'UTC\' + INTERVAL \'-5 hours\') - INTERVAL \'-5 hours\'';
            sql += ' AND "TenantId" = ' + TENANT_ID;
            const pgPool = self.GetPgPool();
            pgPool.query(sql, (err, result) => {
                if (err) {
                    reject("Error fetching orders for today", err);
                }
                orderTotal = parseFloat(result.rows[0].ordertotal);
                orderCount = result.rows[0].ordercount;
                
                if (orderTotal != 0) {
                    orderTotal = orderTotal.toFixed(2);
                }
                var orderMessage = "";
                if (orderCount > 0) {
                    orderMessage += " for today. You have " + orderCount + " orders so far, and the total revenue is $" + orderTotal;
                } else {
                    orderMessage += '<break time="1s"/>Damn! you dont have any orders<break time="1.5s"/> SAD FACE!';
                }

                //console.log(orderMessage);
                pgPool.end();
                resolve(orderMessage);
            });
        });
        return getOrderPromise;
    },
    GetOrdersThisWeek: function () {
        const self = this;
        let getOrderPromise = new Promise(function (resolve, reject) {
            let orderCount = 0;
            let orderTotal = 0.0;
            let sql = 'SELECT count("OrderSummaryId") as OrderCount, sum("OrderAmount") as OrderTotal FROM public."OrderSummary"';
            sql += ' WHERE "CreateDate" >= DATE_TRUNC(\'week\', CURRENT_TIMESTAMP AT TIME ZONE \'UTC\' + INTERVAL \'-5 hours\') - INTERVAL \'-5 hours\'';
            sql += ' AND "TenantId" = ' + TENANT_ID;

            const pgPool = self.GetPgPool();
            pgPool.query(sql, (err, result) => {
                if (err) {
                    reject("Error fetching orders for this week");
                }
                orderTotal = parseFloat(result.rows[0].ordertotal);
                orderCount = result.rows[0].ordercount;

                if (orderTotal != 0) {
                    orderTotal = orderTotal.toFixed(2);
                }
                var orderMessage = "";
                if (orderCount > 0) {
                    orderMessage += " for this week. You have " + orderCount + " orders so far, and the total revenue is $" + orderTotal;
                } else {
                    orderMessage += '<break time="1s"/>Damn! you dont have any orders<break time="1.5s"/> SAD FACE!';
                } //console.log(orderMessage);
                pgPool.end();
                resolve(orderMessage);
            });
        });
        return getOrderPromise;
    },
    GetOrdersThisMonth: function () {
        const self = this;
        let getOrderPromise = new Promise(function (resolve, reject) {
            var orderCount = 0;
            var orderTotal = 0.0;
            let sql = 'SELECT count("OrderSummaryId") as OrderCount, sum("OrderAmount") as OrderTotal FROM public."OrderSummary"';
            sql += ' WHERE "CreateDate" >= DATE_TRUNC(\'month\', CURRENT_TIMESTAMP AT TIME ZONE \'UTC\' + INTERVAL \'-5 hours\') - INTERVAL \'-5 hours\'';
            sql += ' AND "TenantId" = ' + TENANT_ID;

            const pgPool = self.GetPgPool();
            pgPool.query(sql, (err, result) => {
                if (err) {
                    reject("Error fetching orders for this month");
                }
                orderTotal = parseFloat(result.rows[0].ordertotal);
                orderCount = result.rows[0].ordercount;

                if (orderTotal != 0) {
                    orderTotal = orderTotal.toFixed(2);
                }
                var orderMessage = "";
                if (orderCount > 0) {
                    orderMessage += " for this month. You have " + orderCount + " orders so far, and the total revenue is $" + orderTotal;
                } else {
                    orderMessage += '<break time="1s"/>Damn! you dont have any orders<break time="1.5s"/> SAD FACE!';
                }
                //console.log(orderMessage);
                pgPool.end();
                resolve(orderMessage);
            });
        });
        return getOrderPromise;
    },
    GetPopularProductToday: function () {
        const self = this;
        let productPromise = new Promise(function (resolve, reject) {
            let sql = 'SELECT "TenantId" , "ProductCode" , "ProductName", SUM("Qty") AS TotalQty';
            sql += ' FROM "PopularProduct"';
            sql += ' WHERE "Createdate" >= DATE_TRUNC(\'day\', CURRENT_TIMESTAMP AT TIME ZONE \'UTC\' + INTERVAL \'-5 hours\') - INTERVAL \'-5 hours\'';
            sql += ' AND "TenantId" = ' + TENANT_ID;
            sql += ' GROUP BY "TenantId", "ProductCode", "ProductName"';
            sql += ' ORDER BY SUM("Qty") DESC';
            sql += ' LIMIT 1';

            const pgPool = self.GetPgPool();
            pgPool.query(sql, (err, result) => {
                if (err) {
                    reject("Error fetching popular product for today");
                }
                const productCode = result.rows[0].ProductCode;
                const productName = result.rows[0].ProductName;
                const qty = result.rows[0].totalqty;

                const productMessage = ", " + productName + " with ProductCode " + productCode + " is the popular product today with " + qty + " orders";
                //console.log(productMessage);
                pgPool.end();
                resolve(productMessage);
            });

        });
        return productPromise;
    },
    GetPopularProductThisWeek: function () {
        const self = this;
        let productPromise = new Promise(function (resolve, reject) {
            let sql = 'SELECT "TenantId" , "ProductCode" , "ProductName", SUM("Qty") AS TotalQty';
            sql += ' FROM "PopularProduct"';
            sql += ' WHERE "Createdate" >= DATE_TRUNC(\'week\', CURRENT_TIMESTAMP AT TIME ZONE \'UTC\' + INTERVAL \'-5 hours\') - INTERVAL \'-5 hours\'';
            sql += ' AND "TenantId" = ' + TENANT_ID;
            sql += ' GROUP BY "TenantId", "ProductCode", "ProductName"';
            sql += ' ORDER BY SUM("Qty") DESC';
            sql += ' LIMIT 1';

            const pgPool = self.GetPgPool();
            pgPool.query(sql, (err, result) => {
                if (err) {
                    reject("Error fetching popular product for this week");
                }
                const productCode = result.rows[0].ProductCode;
                const productName = result.rows[0].ProductName;
                const qty = result.rows[0].totalqty;

                const productMessage = ", " + productName + " with ProductCode " + productCode + " is the popular product this week with " + qty + " orders";
                //console.log(productMessage);
                pgPool.end();
                resolve(productMessage);
            });

        });
        return productPromise;
    },
    GetPopularProductThisMonth: function () {
        const self = this;
        let productPromise = new Promise(function (resolve, reject) {
            let sql = 'SELECT "TenantId" , "ProductCode" , "ProductName", SUM("Qty") AS TotalQty';
            sql += ' FROM "PopularProduct"';
            sql += ' WHERE "Createdate" >= DATE_TRUNC(\'month\', CURRENT_TIMESTAMP AT TIME ZONE \'UTC\' + INTERVAL \'-5 hours\') - INTERVAL \'-5 hours\'';
            sql += ' AND "TenantId" = ' + TENANT_ID;
            sql += ' GROUP BY "TenantId", "ProductCode", "ProductName"';
            sql += ' ORDER BY SUM("Qty") DESC';
            sql += ' LIMIT 1';

            const pgPool = self.GetPgPool();
            pgPool.query(sql, (err, result) => {
                if (err) {
                    reject("Error fetching popular product for this month");
                }
                const productCode = result.rows[0].ProductCode;
                const productName = result.rows[0].ProductName;
                const qty = result.rows[0].totalqty;

                const productMessage = ", " + productName + " with ProductCode <say-as interpret-as='spell-out'>" + productCode + "</say-as> is the popular product this month with " + qty + " orders";
                //console.log(productMessage);
                pgPool.end();
                resolve(productMessage);
            });

        });
        return productPromise;
    },
    GetInventoryStatus: function () {
        const self = this;
        let inventoryPromise = new Promise(function (resolve, reject) {

            let sql = 'SELECT "ProductCode", "ProductName",  "TenantId", SUM("StockAvailable") AS "Available"';
            sql += ' FROM "LowInventory"';
            sql += ' WHERE "CreateDate" > DATE_TRUNC(\'day\', CURRENT_TIMESTAMP AT TIME ZONE \'UTC\' + INTERVAL \'-5 hours\') - INTERVAL \'-5 hours\'';
            sql += ' AND "TenantId" = ' + TENANT_ID;
            sql += ' GROUP BY "ProductCode", "ProductName", "TenantId"';
            sql += ' ORDER BY SUM("StockAvailable")';

            const pgPool = self.GetPgPool();
            pgPool.query(sql, (err, result) => {
                if (err) {
                    reject("Error fetching inventory update");
                }
                var message = "";
                var itemCount = result.rows.length;
                var count = 0;

                if (itemCount > 0) {
                    message += '<break time="1s"/> <prosody volume="x-loud">You have products going out of stock.</prosody> <break time="1s"/> ';
                }

                _.each(result.rows, function (row) {
                    if (count < 3) {
                        message += ", " + row.ProductName + " has " + row.Available + " in stock";
                    }
                    count++;
                });

                if (itemCount > 3) {
                    message += "<break time='1s'/>  you have " + (itemCount - 3) + " more products going out of stock. Please update your inventory.";
                }

                if (itemCount == 0) {
                    message = "Your inventory looks good at the moment";
                }

                pgPool.end();
                resolve(message);
            });

        });
        return inventoryPromise;
    },
    GetPgPool: function () {
        return new Pool({
            user: "dev",
            host: "kiboko2.chqdf0xymded.us-east-1.rds.amazonaws.com",
            database: "kiboko",
            password: "kibo123!",
            port: 5432
        });
    }
};