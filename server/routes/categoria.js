const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/authenticacion');

let app = express();

let Categoria = require('../models/categoria')

// =============================
// Mostrar todas las categorias
// =============================

app.get('/categoria', (req, res)=>{

});

// =============================
// Mostrar una categoria por ID
// =============================

app.get('/categoria/:id', (req, res)=>{
    //Categoria.findByID()
});

// =============================
// Crear nueva categoria
// =============================

app.post('/categoria/:id', verificaToken, (req, res)=>{
    //regresa la nueva categoría
    //req.usuario._id
});

// =============================
// Actualizar categoria
// =============================

app.put('/categoria/:id', verificaToken, (req, res)=>{
    
});

// =============================
// Borrar categoría
// =============================

app.put('/categoria/:id', verificaToken, (req, res)=>{
    //solo un admin puede borrar categoria
    //Categoria.findByIdAndRemove
});

module.exports = app;