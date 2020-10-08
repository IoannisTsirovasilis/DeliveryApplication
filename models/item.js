const collection = 'items';

const item = function() {

    function findOne(db, query) { 
        return db.collection(collection).findOne(query);
    }

    return {
        findOne: findOne
    }
}

module.exports = item();