const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const knex = require('knex')(require('./knexfile.js')[process.env.NODE_ENV || 'development']);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('movies/?movieTitle=', function (req, res) {
  console.log('here in ?');
  res.send(`received query by title get request`);
});

app.post('/movies', function (req, res) {
  if (!req.body.title || typeof String(req.body.title) !== 'string' ||
    !req.body.runtime || typeof parseInt(req.body.runtime) !== 'number' ||
    !req.body.release_year || typeof parseInt(req.body.release_year) !== 'number' ||
    !req.body.director || typeof String(req.body.director) !== 'string') {
    res.status(400)
      .send(`Invalid Data received`);
  } else {    
    return knex('movies').insert([{
      title: String(req.body.title), 
      runtime: parseInt(req.body.runtime), 
      release_year: parseInt(req.body.release_year), 
      director: String(req.body.director) }
    ])
    .then ( () => {
      res.status(200)
      .send('Post Completed');
    })   
  }
});

app.delete('/movies/:id', function (req, res) {
  let id = parseInt(req.params.id);
  if (id) {
    return (knex('movies')
      .where('id', id)
      .del())
      .then(() => {
        res.status(200)
          .send(`Movie with ID : ${id} has been deleted from the table`)
      })
  } else {
    res.status(400)
      .send(`No ID was provided`);
  }
});

app.get('/setCookie', function (req, res) {
  res.setHeader('Set-Cookie', ['firstName=Mike', 'lastName=Langenbach', 'language=javascript']);
  res.send(`Cookies Set`);
});

app.get('/readCookie', function (req, res) {
  let firstNameKey = "firstName=";
  let lastNameKey = "lastName=";
  let str = req.headers.cookie;

  let firstNameStartIndex = str.indexOf("firstName=");
  let lastNameStartIndex = str.indexOf("lastName=");

  let firstName = '';
  let lastName = '';

  for (let i = firstNameStartIndex + firstNameKey.length; i < str.length && str[i] !== ';'; i++) {
    if (str[i] !== ';')
      firstName += str[i];
  }

  for (let i = lastNameStartIndex + lastNameKey.length; i < str.length && str[i] !== ';'; i++) {
    if (str[i] !== ';')
      lastName += str[i];
  }

  res.send(`First Name : ${firstName} LastName : ${lastName}`);
});

app.get('/movies', function (req, res) {
  if (req.query.movieTitle) {
    knex
      .select('*')
      .from('movies')
      .where('title', req.query.movieTitle)
      .then( (data) => {
        if (data.length <= 0) {
          res.status(400)
            .send(`Your query string returned no results`)
        } else {
          res.status(200).json(data);
        }
      })
      .catch(err =>
        res.status(404).json({
          message:
            'The data you are looking for could not be found. Please try again'
        })
      );
  } else {
    knex
      .select('*')
      .from('movies')
      .then(data => res.status(200).json(data))
      .catch(err =>
        res.status(404).json({
          message:
            'The data you are looking for could not be found. Please try again'
        })
      );
  }
});



app.get('/movies/:id', function (req, res) {
  let id = parseInt(req.params.id);
  console.log(id);

  if (id) {
    knex
      .select('*')
      .from('movies')
      .where(`id`, id)
      .then((data) => {
        if (data.length === 0) {
          res.status(404)
            .send(`Movie ID Not Found`);
        } else {
          res.status(200).json(data)
        }
      })
      .catch(err =>
        res.status(404).json({
          message:
            'The data you are looking for could not be found. Please try again'
        })
      );
  } else {
    res.status(400)
      .send(`Invalid ID Supplied`);
  }
});

app.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
});