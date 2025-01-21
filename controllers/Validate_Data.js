const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const checkRecordExists = async function checkRecordExists(model, condition) {
    try {
        const record = await prisma[model].findFirst({
                where: condition
            });
          
        return !!record;
    } catch (error) {
        console.error('Error checking record:', error);
        return false;
    }
}

// Usage example:
// (async () => {
//     const model = 'User'; // Replace 'User' with your model name
//     const condition = { email: 'example@example.com' }; // Replace with your condition
//     const exists = await checkRecordExists(model, condition);
//     console.log('Record exists:', exists);
// })();

module.exports = { checkRecordExists };
