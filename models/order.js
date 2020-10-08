const collection = 'orders';

const order = function() {
    async function find(db, query) {
        return await db.collection(collection).find(query).toArray();
    }

    async function insertOne(db, document) { 
        await db.collection(collection).insertOne(document);
    }

    return {
        find: find,
        insertOne: insertOne
    }
}

module.exports = order();