const collection = 'items';

const item = function() {

    async function findOne(db, query) { 
        return await db.collection(collection).findOne(query);
    }

    return {
        findOne: findOne
    }
}

module.exports = item();