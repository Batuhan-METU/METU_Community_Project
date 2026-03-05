const { Pool } = require("pg");

// İleride gerçek veritabanına geçtiğimizde burayı kullanacağız
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = {
  pool,
};

