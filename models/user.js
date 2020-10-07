const collection = 'users';

const user = function() {

    async function findOne(db, query) { 
        return await db.collection(collection).findOne(query);
    }

    return {
        findOne: findOne
    }
}

module.exports = user();