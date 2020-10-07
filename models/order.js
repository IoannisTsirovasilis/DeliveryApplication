const collection = 'orders';

const order = function() {
    async function find(db, query) {
        return await db.collection(collection).find(query).toArray();
    }

    async function insertOne(db, document) { 
        await db.collection(collection).insertOne(document);
    }

    async function findOne(db, query) { 
        return await db.collection(collection).findOne(query);
    }

    return {
        find: find,
        insertOne: insertOne,
        findOne: findOne
    }
}

module.exports = order();