const collection = 'categories';

const category = function() {

    async function find(db, query) { 
        return await db.collection(collection).find(query);
    }

    return {
        find: find
    }
}

module.exports = category();