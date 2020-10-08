const collection = 'categories';

const category = function() {

    function find(db, query) { 
        return db.collection(collection).find(query).toArray();
    }

    return {
        find: find
    }
}

module.exports = category();