const mongodb = require('mongodb');
const config = require('config');
const connectionString = config.get('db.connectionString');
const dbName = config.get('db.database');

const context = function() {
    // connect to the database and return connection
    async function connect() {
        try {
            const con = await mongodb.MongoClient.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true });
            return con.db(dbName);            
        } catch (error) {
            return error;
        }    
    }

    // this is the exported function that gets the connection
    async function get() {
        try {
            return await connect();
        } catch (error) {
            return error;
        }  
    }
    
    return {
        get: get
    }
}

module.exports = context();