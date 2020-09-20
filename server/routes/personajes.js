const express = require("express");
const app = express();
const _ = require("underscore");
const fs = require('fs');
const path = require('path');

const Personaje = require("./../models/personajes");
const Race = require("./../models/raza");

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

//------------------------------------------------

app.put('/habilidades/:id', async(req, res) => {
    try {

        let id = req.params.id;
        let newSkills = {...req.body };

        let { skills } = await Personaje.findOne({ _id: id });

        (!(skills.find((s) => s.name == newSkills.name))) && skills.push(newSkills);

        saveHabilities(id, skills, res);

    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        });
    }
});

app.delete('/habilidades/:id/:skill', async(req, res) => {
    try {

        let id = req.params.id;
        let skillDeleted = req.params.skill;

        let { skills } = await Personaje.findOne({ _id: id });

        if (skills.length == 0) return res.status(400).json({
            ok: false,
            err: { message: 'No hay habilidades ingresadas' }
        });

        skills = skills.filter((r) => (r.name != skillDeleted));
        saveHabilities(id, skills, res);
    } catch (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }
});

// app.post('/raza', async(req, res) => {
//     let race = new Race({
//         ...req.body
//     });
//     let raceEntry = await race.save();
//     res.json(raceEntry);
// });

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


app.get('*', async(req, res) => {
    res.status(404).json({
        ok: false,
        err: {
            message: 'Ruta no encontrada'
        }
    })
});
//------------------------------------------------

const saveHabilities = (id, skill, res) => {

    Personaje.updateOne({ _id: id }, { skills: skill })
        .then((r) => {
            if (!r)
                return res.status(400).json({
                    ok: false,
                    err: { message: "personaje no encontrados" },
                });
            res.json({
                ok: true,
                personaje: r,
            });
        })
        .catch((err) => {
            res.status(500).json({
                ok: false,
                err,
            });
        });
};

const borra_archivo = (nombreImagen) => {
    let pathImagen = path.resolve(__dirname, `../../uploads/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;