const express = require("express");
const app = express();
const _ = require("underscore");
const fs = require('fs');
const path = require('path');

const Personaje = require("./../models/personajes");
const Race = require("./../models/raza");


//peticion de llamada de personajes
app.get("/personaje", (req, res) => {
    Personaje.find()
        .populate('race', 'name skills')
        .then((r) => {
            if (!r)
                return res.status(400).json({
                    ok: false,
                    err: { message: "personajes no encontrados" },
                });

            res.json({
                ok: true,
                personajes: r,
            });
        })
        .catch((err) => {
            res.status(500).json({
                ok: false,
                err,
            });
        });
});

//peticion de ingreso de personajes
app.post("/personaje", (req, res) => {
    let data = _.pick(req.body, ["name", "race", "skills", "image"]);
    data.skills = (data.skills) ? JSON.parse(data.skills) : [];
    let personaje = new Personaje(data);

    personaje
        .save()
        .then(async(r) => {
            if (!r) return res.status(400).json({
                ok: false,
                err: { message: "personajes no ingresado" },
            });

            r.race = await Race.findOne({ _id: r.race });
            res.json({
                ok: true,
                personajes: r,
            });
        })
        .catch((err) => {
            res.status(500).json({
                ok: false,
                err,
            });
        });
});

//peticion de eliminacion de personajes

app.delete("/personaje/:id", (req, res) => {
    let id = req.params.id;

    Personaje.findOneAndDelete({ _id: id })
        .then((r) => {
            if (!r)
                return res.status(400).json({
                    ok: false,
                    err: { message: "personajes no encontrado" },
                });

            borra_archivo(r.image);
            res.json({
                ok: true,
                personajes: r,
            });
        })
        .catch((err) => {
            res.status(500).json({
                ok: false,
                err,
            });
        });
});


//llamado de razas
app.get('/raza', async(req, res) => {

    Race.find().then(r => {
        res.json({
            ok: true,
            race: r
        })
    }).catch(err => {
        return res.status(500).json({
            ok: false,
            err
        });
    })
});

//peticion 404/rutas que no existen
app.get('*', async(req, res) => {
    res.status(404).json({
        ok: false,
        err: {
            message: 'Ruta no encontrada'
        }
    })
});
//------------------------------------------------


//funcion para eliminar imagenes ligadas a personajes, se llama en la eliminacion del personaje
const borra_archivo = (nombreImagen) => {
    let pathImagen = path.resolve(__dirname, `../../uploads/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;