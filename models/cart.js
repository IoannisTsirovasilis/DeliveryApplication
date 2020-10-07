const collection = 'carts';

const cart = function() {
    async function updateOne(db, query, update) {
        await db.collection(collection)
        .updateOne(query, update);
    }

    async function insertOne(db, document) { 
        await db.collection(collection).insertOne(document);
    }

    async function findOne(db, query) { 
        return await db.collection(collection).findOne(query);
    }

    return {
        updateOne: updateOne,
        insertOne: insertOne,
        findOne: findOne
    }
}

module.exports = cart();