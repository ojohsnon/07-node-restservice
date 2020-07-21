
const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/authenticacion');


let app = express();

let Categoria = require('../models/categoria')

// =============================
// Mostrar todas las categorias
// =============================

app.get('/categoria', verificaToken, (req, res)=>{
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias)=>{
            if (err){
                return res.status(400).json({
                    ok:false,
                    err
                })
            }
            res.json({
                ok:true,
                categorias
            })
        })
});

// =============================
// Mostrar una categoria por ID
// =============================

app.get('/categoria/:id', (req, res)=>{
    //Categoria.findByID()
    let id = req.params.id;
    Categoria.findById(id)
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB)=>{
            if (err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            if (!categoriaDB){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message: 'El ID no es correcto'
                    }
                })
            }
            res.json({
                ok:true,
                categoria: categoriaDB
            })
        })

});

// =============================
// Crear nueva categoria
// =============================

app.post('/categoria', verificaToken, (req, res)=>{
    //regresa la nueva categoría
    //req.usuario._id
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        
        return res.json({
            ok:true,
            categoria: categoriaDB
        })
    });

});

// =============================
// Actualizar categoria
// =============================

app.put('/categoria/:id', verificaToken, (req, res)=>{
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true}, (err, categoriaDB) =>{
        if (err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            categoria: categoriaDB
        }) 
    })
});

// =============================
// Borrar categoría
// =============================

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res)=>{
    //solo un admin puede borrar categoria
    //Categoria.findByIdAndRemove
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        if (!categoriaBorrada){
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Catergoria no encontrada'
                }
            })
        }
        res.json({
            ok : true,
            message: 'Categoría borrada '
        })
    })
});

module.exports = app;