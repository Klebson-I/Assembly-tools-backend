const {createPool} = require('mysql2/promise');

export const pool = createPool({
    user:"root",
    database:"assembly",
    host:"localhost",
    namedPlaceholders:true,
    decimalNumbers:true
})