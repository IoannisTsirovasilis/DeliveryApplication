const collection = 'carts';

const cart = function() {
    async function findOneAndUpdate(db, query, update) {
        await db.collection(collection)
        .findOneAndUpdate(query, update);
    }

    async function insertOne(db, document) { 
        await db.collection(collection).insertOne(document);
    }

    async function findOne(db, query) { 
        return await db.collection(collection).findOne(query);
    }

    return {
        findOneAndUpdate: findOneAndUpdate,
        insertOne: insertOne,
        findOne: findOne
    }
}

module.exports = cart();