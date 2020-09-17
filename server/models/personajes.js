let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let personajeSchema = new Schema({
    name: { type: String, required: [true, 'El nombre del personaje es requerido'] },
    race: { type: Schema.Types.ObjectId, ref: 'Race', required: [true, 'La raza del personaje es nesesaria'] },
    skills: { type: Array, required: true, default: [] },
    image: { type: String, required: [true, 'La imagen es nesesaria'] }
});

module.exports = mongoose.model('Personaje', personajeSchema);