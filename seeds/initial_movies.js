
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('movies').del()
    .then(function () {
      // Inserts seed entries
      return knex('movies').insert([
        {id: 1, title: 'Vicky Cristina Barcelona', runtime: 90, release_year: 2000, director: 'Somebody'},
        {id: 2, title: 'The Martian', runtime: 90, release_year: 2018, director: 'Ridley Scott'},
        {id: 3, title: 'Midnight in Paris', runtime: 95, release_year: 1777, director: 'Somebody Else'}
      ]);
    });
};


// table.increments('id');
// table.string('title').notNullable();
// table.integer('runtime');
// table.date('release_date');
// table.string('director');