const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');

const path = require('path')

// default options
app.use( fileUpload({ useTempFiles: true }) );

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
            ok:false,
            err:{
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    //valida tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo)<0){
        return res.status(400).json({
            ok:false,
            err: {
                message: 'Los tipos permitidas son: ' + tiposValidos.join(', ')
            }
        })
    }

    let archivo = req.files.archivo;

    let nombreCortado = archivo.name.split('.');
    let extencion = nombreCortado[nombreCortado.length - 1];

    // extenciones permitidas
    let extencionesValidas= ['png', 'jpg', 'gif', 'jpeg']

    if (extencionesValidas.indexOf(extencion)<0){
        return res.status(400).json({
            ok:false,
            err: {
                message: 'Las extenciones permitidas son: ' + extencionesValidas.join(', '),
                ext: extencion
            }
        })
    }
    
    //Cambiar nombre al archivo
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${ extencion }`

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) =>{
        if (err)
          return res.status(500).json({
              ok:false,
              err
          });
        if (tipo === 'usuarios'){
            imagenUsuario(id, res, nombreArchivo);
        }else{
            imagenProducto(id, res, nombreArchivo);
        }
        
        
      });
});

function imagenUsuario(id, res, nombreArchivo){
    Usuario.findById(id, (err, usuarioDB) => {
        if (err){
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok:false,
                err
            });
            
        }
        
        if(!usuarioDB){
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Usuario no existe'
                }
            });
            
        }

        
        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save( (err, usuarioDB)=>{
            res.json({
                ok:true,
                usuario: usuarioDB
            });
        })

        
    });

}

function imagenProducto(id, res, nombreArchivo){
    Producto.findById(id, (err, prductoDB) => {
        if (err){
            borraArchivo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok:false,
                err
            });
            
        }
        
        if(!prductoDB){
            borraArchivo(nombreArchivo, 'productos');

            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Prodcuto no existe'
                }
            });
            
        }
        
        borraArchivo(prductoDB.img, 'productos');

        prductoDB.img = nombreArchivo;
        prductoDB.save( (err, prductoDB)=>{
            res.json({
                ok:true,
                producto: prductoDB
            });
        })

        
    });
}

function borraArchivo(nombreImagen, tipo){
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`); 

    if ( fs.existsSync(pathImagen) ){
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;