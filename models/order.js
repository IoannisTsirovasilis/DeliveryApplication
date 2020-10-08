const collection = 'orders';

const order = function() {
    function find(db, query) {
        return db.collection(collection).find(query).toArray();
    }

    function insertOne(db, document) { 
        db.collection(collection).insertOne(document);
    }

    return {
        find: find,
        insertOne: insertOne
    }
}

module.exports = order();