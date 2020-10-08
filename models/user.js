const collection = 'users';

const user = function() {

    function findOne(db, query) { 
        return db.collection(collection).findOne(query);
    }

    return {
        findOne: findOne
    }
}

module.exports = user();