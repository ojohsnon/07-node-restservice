const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/authenticacion');


let app = express();

let Producto = require('../models/producto');

// =============================
// Obtener todos los productos
// =============================

app.get('/productos', verificaToken, (req, res)=>{
    // trae todos los productos
    // populate: usuario categoria
    // paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({disponible:true})
            .skip(desde)
            .limit(limite)
            .exec((err, productos)=>{
                if (err){
                    return res.status(400).json({
                        ok:false,
                        err
                    })
                }
                Producto.count({estado:true}, (err, conteo)=>{
                    res.json({
                        ok:true,
                        count: conteo,
                        productos
                    })
                });
            })
});

// =============================
// Obtener un producto por ID
// =============================

app.get('/productos/:id', verificaToken, (req, res)=>{
    //populate: usuario categoria
    let id = req.params.id;
    Producto.findById(id)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB)=>{
            if (err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }
            if (!productoDB){
                return res.status(400).json({
                    ok:false,
                    err:{
                        message: 'El ID no es correcto'
                    }
                })
            }
            res.json({
                ok:true,
                producto: productoDB
            })
        })
});

// =============================
// Crear un nuevo producto
// =============================

app.post('/productos', verificaToken, (req, res)=>{
    // grabar el usuario
    // grabar una categoria
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB)=>{
        if (err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!productoDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        
        return res.json({
            ok:true,
            producto: productoDB
        })
    });
});

// =============================
// Actualizar un producto
// =============================

app.put('/productos/:id', verificaToken, (req, res)=>{
    // grabar el usuario
    // grabar una categoria
    let id = req.params.id;
    let body = req.body;

    let bodyProdcuto = {
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoria,
        disponible: body.disponible
    }

    Producto.findByIdAndUpdate(id, bodyProdcuto, {new: true, runValidators: true}, (err, productoDB) =>{
        if (err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!productoDB){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            producto: productoDB
        }) 
    })
});

// =============================
// Actualizar un producto
// =============================

app.delete('/productos/:id', (req, res)=>{
    // desabilitar disponible
    let id = req.params.id;

    let cambiaDisponible = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambiaDisponible, {new: true}, (err, productoBorrado) =>{
        if (err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok: true,
            message: 'El producto ha sido borrado'
        }) 
    })
});



module.exports = app;