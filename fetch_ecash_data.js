const axios = require('axios');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const API_KEY = 'A___0gXA5RTPqh9NpwqIhjzqwXCRAINE';
const TOTAL_ADDRESSES = 12000;
const LIMIT = 100;

const csvWriter = createCsvWriter({
    path: 'ecash_top_500.csv',
    header: [
        { id: 'address', title: 'Address' },
        { id: 'balance', title: 'Balance' },
    ],
});

const fetchData = async (offset) => {
    try {
        const response = await axios.get(`https://api.blockchair.com/ecash/addresses?q=balance(1000000000..400899880148961)&limit=${LIMIT}&offset=${offset}&key=${API_KEY}`);
        const addresses = response.data.data.map((item) => ({
            address: item.address,
            balance: item.balance,
        }));

        await csvWriter.writeRecords(addresses);

        if (offset + LIMIT < TOTAL_ADDRESSES) {
            setTimeout(() => fetchData(offset + LIMIT), 1000); // Wait 1 second between requests to avoid hitting rate limits
        } else {
            console.log('Completed fetching top 500 addresses.');
        }
    } catch (err) {
        console.error('Error fetching data:', err.message);
        setTimeout(() => fetchData(offset), 1000); // Retry after 1 second in case of error
    }
};

// Start fetching data
fetchData(0);