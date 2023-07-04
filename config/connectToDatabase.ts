
import knexBuilder from 'knex';

 const knex = knexBuilder({
    client: 'mysql2',
    connection: {
        host: process.env.HOST,
        port: 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    }
});
export default knex
