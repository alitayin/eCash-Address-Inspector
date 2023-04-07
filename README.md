

# ECash-Address-Inspector

This project retrieves information about ECash addresses through the Blockchair API, including balance, first received, last received, first spent, last spent, and the number of unused outputs. The list of addresses to query is read from a CSV file, and the query results are written to a new CSV file.

https://api.blockchair.com/premium

## Usage
1. Install dependencies:
npm install axios fs readline

2. Place your API key in the `apiKey` variable in the `process_csv.js` file.
3. Name the CSV file (one address per line, first column) as "xx.csv" and place it in the project folder.
4. Run the script:

node process_csv.js

5. The query results will be written to a file named "cc.csv".

If you don't have a key, you can change the `const chunkSize = 99` to `10`. However, be aware that the free API has access restrictions, so it is not recommended to read more than 500 addresses.

## Dependencies
- axios
- fs
- readline


