exports.up = function (knex) {
    return knex.schema.createTable('animals', table => {
      table.increments();
      table.string('name', 64).unique().notNullable();
      table.string('habitat', 64);
      table.string('size', 16);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('animals');
  };