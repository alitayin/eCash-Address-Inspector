const axios = require("axios");
const fs = require("fs");
const readline = require("readline");

const apiKey = "Your-API-KEY-Here";

const readAddressesFromFile = async (filePath) => {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    const addresses = [];
    for await (const line of rl) {
        addresses.push(line.trim());
    }

    return addresses;
};

const getAddressData = async (addresses) => {
    const chunkSize = 99;

    for (let i = 0; i < addresses.length; i += chunkSize) {
        const chunk = addresses.slice(i, i + chunkSize);
        const results = {};

        try {
            const response = await axios.get(
                `https://api.blockchair.com/ecash/dashboards/addresses/${chunk.join(
                    ","
                )}?key=${apiKey}`
            );

            if (response.status === 200) {
                const data = response.data.data;

                for (const address of Object.keys(data.addresses)) {
                    if (data.addresses[address]) {
                        results[address] = {
                            balance: data.addresses[address].balance,
                            balance_usd: data.addresses[address].balance_usd,
                            first_seen_receiving: data.addresses[address].first_seen_receiving,
                            last_seen_receiving: data.addresses[address].last_seen_receiving,
                            first_seen_spending: data.addresses[address].first_seen_spending,
                            last_seen_spending: data.addresses[address].last_seen_spending,
                            unspent_output_count: data.addresses[address].unspent_output_count,
                        };
                    } else {
                        console.log(`No data found for address ${address}`);
                    }
                }

                console.log(`Progress: ${i + chunkSize}/${addresses.length}`);
                console.log("Results for this chunk:", results);
                writeToCSV(results, i !== 0); // append to file if not the first chunk
            }
        } catch (error) {
            console.error(`Error for addresses ${chunk.join(", ")}:`, error.message);
        }
    }
};

const writeToCSV = (results, append = false) => {
    const csvFilePath = "cc.csv";
    const header =
        "Address,Balance,Balance USD,First Seen Receiving,Last Seen Receiving,First Seen Spending,Last Seen Spending,Unspent Output Count\n";
    let csvContent = append ? "" : header;

    for (const result in results) {
        csvContent += `${result},${results[result].balance},${results[result].balance_usd},${results[result].first_seen_receiving
            },${results[result].last_seen_receiving},${results[result].first_seen_spending},${results[result].last_seen_spending
            },${results[result].unspent_output_count}\n`;
    }

    fs.writeFile(csvFilePath, csvContent, { flag: append ? "a" : "w" }, (err) => {
        if (err) {
            console.error("Error writing to CSV file:", err.message);
        } else {
            console.log(`Results successfully written to ${csvFilePath}`);
        }
    });
};

(async () => {
    const filePath = "xx.csv";
    const addresses = await readAddressesFromFile(filePath);
    getAddressData(addresses);
})();