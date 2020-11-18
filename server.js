'use strict'
// -------------------------
// Application Dependencies
// -------------------------
const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const methodOverride = require('method-override');
const { render } = require('ejs');

// -------------------------
// Environment variables
// -------------------------
require('dotenv').config();
const HP_API_URL = process.env.HP_API_URL;

// -------------------------
// Application Setup
// -------------------------
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware
// Utilize ExpressJS functionality to parse the body of the request
app.use(express.urlencoded({ extended: true }));

// Application Middleware override
app.use(methodOverride('_method'));

// Specify a directory for static resources
app.use(express.static('./public'));
app.use(express.static('./img'));

// Database Setup

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

// Set the view engine for server-side templating
app.set('view engine', 'ejs');


app.get('/home',renderHome);
app.get('/house_name/characters',renderchar);
app.post('/my-characters.pust',addtoDB);
app.get('/my-characters.pust',renderFav);
app.get('/details/:id',details);
app.put('/update/:id',update);
app.delete('/delete/:id',handerDelet);

function handerDelet (req,res) {
  const id = [req.params.id];
  const sqlDelet = 'delete from exam where id=$1';
  client.query(sqlDelet,id).then( () => {
    res.redirect('/fav');
  });
}

function update (req,res) {
  const id = req.params.id;
  const {image,patronus,alive} = req.body;
  const safeValue = [image,patronus,alive,id];
  const sqlUpdate = 'update exam set img=$1, patronus=$2, alive=$3 where id=$4;';
  client.query(sqlUpdate,safeValue).then ( () => {
    res.redirect('/fav');
  } );
}

function details (req,res) {
  const id =[req.params.id]
  const sqlGet = 'select * from exam where id=$1;';
  client.query(sqlGet,id).then( (data) =>
    res.render('fav',{result : data.rows})

  );}

function renderFav (req,res) {
  const sqlGet = 'select * from exam;';
  client.query(sqlGet).then (data => {
    if ( data.rowCount === 0) {res.send(' no fav data was added');}
    else {
      res.render('fav',{result : data.rows});
    }
  });
}


function addtoDB (req,res) {
  const {image,patronus,alive} = req.body;
  const sqlInsert= 'insert into exam;';
  const saveValue = [image,patronus,alive];
  client.query(sqlInsert,saveValue).then ( () => {
    res.redirect('/fav');

  });
}



function Hary (data) {
  this.patronus = data.patronus,
  this.alive = data.alive,
  this.image = data.image;
}

function renderchar (req,res) {
  superagent.get(HP_API_URL).then ( data => {

    data.body.forEach(element => {
      if(element.body.house === 'gryffindor') {
        let array = element.body.map( obj => {
          return new Hary (obj);
        });
        res.render('pages/show',{result:array});
      }

      if(element.body.house === 'hufflepuff') {
        let array = element.body.map( obj => {
          return new Hary (obj);
        });
        res.render('pages/show',{result:array});
      }
      if(element.body.house === 'gryffindor') {
        let array = element.body.map( obj => {
          return new Hary (obj);
        });
        res.render('pages/show',{result:array});
      }
      if(element.body.house === 'ravenclaw') {
        let array = element.body.map( obj => {
          return new Hary (obj);
        });
        res.render('pages/show',{result:array});
      }


    });


  });
}




function renderHome (req,res) {
  res.render('pages/home');
}
// ----------------------
// ------- Routes -------
// ----------------------


// --------------------------------
// ---- Pages Routes functions ----
// --------------------------------



// -----------------------------------
// --- CRUD Pages Routes functions ---
// -----------------------------------



// Express Runtime
client.connect().then(() => {
  app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
}).catch(error => console.log(`Could not connect to database\n${error}`));
