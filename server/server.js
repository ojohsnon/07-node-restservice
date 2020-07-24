require('./config/config');

const express = require('express')
const mongoose = require('mongoose');
const path = require('path')

const app = express()
const bodyParser = require('body-parser')

// Configurar cabeceras y cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname , '../public')))



//configuraci{on global de rutas}
app.use(require('./routes/index'))
 
mongoose.connect(process.env.URLDB,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex:true
},
(err, res)=>{
  if (err)throw err;
  console.log("Base de datos online");
});


app.listen(process.env.PORT, ()=>{
    console.log('Escuchando puerto:', process.env.PORT)
})