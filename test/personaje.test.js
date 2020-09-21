// const app = require('./../server/routes/personajes');
const app = require('./../server.js');
const supertest = require('supertest');
const request = supertest(app);

// const express = require('express');
// const app = express();


describe("Post Endpoints", () => {

    test("status 200 y resultado sin errores getPersonajes", done => {
        jest.useFakeTimers()

        request.get('/personaje').then(r => {
            let resultado = JSON.parse(r.res.text);
            expect(resultado.ok).toEqual(true);
            expect(r.status).toEqual(200);
            done()
        })
    });

    test("status 200 y resultado sin errores getRazas", done => {
        jest.useFakeTimers()

        request.get('/raza').then(r => {
            let resultado = JSON.parse(r.res.text);
            expect(resultado.ok).toEqual(true);
            expect(r.status).toEqual(200);
            done()
        })
    });

    test("status 200 y resultado sin errores postPersonaje", done => {
        jest.useFakeTimers()
        let dataSend = {
            name: 'testing',
            race: '5f62b1f0f678be45b4763f27',
            image: 'imgT'
        }
        request.post('/personaje')
            .send(dataSend)
            .then(async r => {
                let resultado = JSON.parse(r.res.text);
                expect(resultado.ok).toEqual(true);
                expect(r.status).toEqual(200);
                await request.delete(`/personaje/${resultado.personajes._id}`);
                done()
            })
    });

    test("status 200/500 y resultado sin errores deletePersonaje", done => {
        jest.useFakeTimers()
        let id = '5f67f30c9c0be40adc1d652e';

        request.delete(`/personaje/${id}`)
            .then(r => {
                let resultado = JSON.parse(r.res.text);

                //id ivalido
                expect(resultado.ok).toEqual(false);
                expect(resultado.err.message).toEqual("personajes no encontrado");
                expect(r.status).toEqual(400);

                //con un id valido
                // expect(resultado.ok).toEqual(true);
                // expect(resultado.personajes._id).toEqual(id);
                // expect(r.status).toEqual(200);
                done()
            })
    });
});