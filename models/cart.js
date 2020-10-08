const collection = 'carts';

const cart = function() {
    function updateOne(db, query, update) {
        db.collection(collection)
        .updateOne(query, update);
    }

    function insertOne(db, document) { 
        db.collection(collection).insertOne(document);
    }

    function findOne(db, query) { 
        return db.collection(collection).findOne(query);
    }

    return {
        updateOne: updateOne,
        insertOne: insertOne,
        findOne: findOne
    }
}

module.exports = cart();