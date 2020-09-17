let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let raceSchema = new Schema({
    name: { type: String, required: [true, 'La del personaje es requerido'] },
    skills: { type: String, required: [true, 'El nombre del personaje es requerido'] },
});


module.exports = mongoose.model('Race', raceSchema);