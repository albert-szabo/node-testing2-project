exports.seed = function(knex, Promise) {
  return knex('animals')
    .truncate()
    .then(function() {
      return knex('animals').insert([
        { name: 'giraffe', habitat: 'African savanna', size: 'very large' },
        { name: 'dolphin', habitat: 'ocean', size: 'large' },
        { name: 'lynx', habitat: 'various', size: 'medium' },
        { name: 'squirrel', habitat: 'various', size: 'small' },
        { name: 'owl', habitat: 'forest', size: 'medium' }
      ]);
    });
};
