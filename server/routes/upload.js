const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Personaje = require('../models/personajes');
app.use(fileUpload());
//imgreso de imagenes
app.put('/upload/:id', (req, res) => {

    let id = req.params.id;
    //valida si existe archivo
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'no se a seleccionado ni un archivo'
            }
        });
    }
    //separa nombre y extencion
    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extencion = nombreArchivo[nombreArchivo.length - 1];
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    //valida extenciones
    if (extencionesValidas.indexOf(extencion) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'las extenciones permitidas son' + extencionesValidas.join(', '),
                ext: extencion
            }
        })
    }


    //cambia el nombre al archivo
    let nombreArchivoFinal = `${id}-${new Date().getMilliseconds() }.${extencion}`;

    //guarda el archivo
    archivo.mv(`uploads/${ nombreArchivoFinal }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        //actualiza personaje con dato de imagen
        imagenPersonaje(id, res, nombreArchivoFinal)
    });
});
//actualiza el personaje con su imagen
const imagenPersonaje = async(id, res, nombreArchivoFinal) => {
    Personaje.updateOne({ _id: id }, { image: nombreArchivoFinal })
        .then((r) => {
            res.json({
                ok: true,
                personajes: r,
                nombreArchivoFinal
            });
        }).catch((err) => {
            res.status(500).json({
                ok: false,
                err
            });
        });
}



module.exports = app;