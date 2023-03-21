
const express = require('express')
const path = require('path');
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

/* CSS FILES */
app.get('/css/style.css', function(req, res) {
  res.sendFile(__dirname + "/css/style.css");
});

app.get('/css/topnav.css', function(req, res) {
  res.sendFile(__dirname + "/css/topnav.css");
});

app.get('/css/login.css', function(req, res) {
  res.sendFile(__dirname + "/css/login.css");
});

/* JS FILES */
app.get('/js/banco.js', function(req, res) {
  res.sendFile(__dirname + "/js/banco.js");
});

app.get('/js/auth.js', function(req, res) {
  res.sendFile(__dirname + "/js/auth.js");
});

app.get('/js/imagenes.js', function(req, res) {
  res.sendFile(__dirname + "/js/imagenes.js");
});

app.get('/js/lineas.js', function(req, res) {
  res.sendFile(__dirname + "/js/lineas.js");
});

/* HTML FILES */
app.get('/index.html', function(req, res) {
  res.sendFile(__dirname + "index.html");
});

app.get('/Monthly.html', function(req, res) {
  res.sendFile(__dirname + "Monthly.html");
});

app.get('/Auth.html', function(req, res) {
  res.sendFile(__dirname + "/Auth.html");
});

app.listen(port, () => {
  console.log('Server started at http://localhost:' + port);
})