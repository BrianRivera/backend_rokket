require('./config/config');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors())


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require('./server/routes/upload.js'));
app.use(require('./server/routes/imagenes.js'));
app.use(require('./server/routes/personajes.js'));
//conexion con mongo
let conexion = async() => await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
conexion();

app.listen(process.env.PORT, () => {
    console.log('ESCUCHANDO EL PUERTO: ', process.env.PORT);
});

module.exports = app;