const express = require('express');
let app = express();
const fs = require('fs');
const path = require('path');

//carga de imagenes
app.get('/imagen/:img', (req, res) => {
    let img = req.params.img;
    let pathImagen = path.resolve(__dirname, `../../uploads/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen)
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/img_prueba.jpg');
        res.sendFile(noImagePath);
    }

});


module.exports = app;