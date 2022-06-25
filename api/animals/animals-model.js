const database = require('../../data/db-config.js');

function getAll() {
  return database('animals');
}

function getByID(ID) {
  return database('animals').where({ ID }).first();
}

function insert(animal) {
  return database('animals').insert(animal).then( ([ID]) => getByID(ID) );
}

function update(ID, changes) {
  return database('animals').update(changes).where({ ID }).then(() => getByID(ID));
}

async function remove(ID) {
  const result = await getByID(ID);
  await database('animals').delete().where({ ID });
  return result;
}

module.exports = {
    insert,
    update,
    remove,
    getAll,
    getByID,
  }