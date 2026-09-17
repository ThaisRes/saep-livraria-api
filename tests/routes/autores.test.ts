import request from 'supertest';
import { resetarBanco, fecharBanco } from '../helpers/db';
import app from '../../src/app'

// zera e re-semeia o banco antes de CADA teste, pra nenhum depender do outro
beforeEach(resetarBanco);
afterAll(fecharBanco);

describe('Rotas de autores', () => {
    test('GET /autores` → 200 e 3 autores', async () => {
        const res = await request(app).get('/autores');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(3);
    })

    test('GET /autores/1` → 200, `nome` = JRR Tolkien', async () => {
        const res = await request(app).get('/autores/1');
        expect(res.status).toBe(200);
        expect(res.body.nome).toBe('JRR Tolkien');
    })

    test('GET /autores/999` → 404', async () => {
        const res = await request(app).get('/autores/999');
        expect(res.status).toBe(404);
    })

    test('POST /autores` válido (`{ nome, nacionalidade }`) → 201 com `id` no corpo', async () => {
        const res = await request(app).post('/autores').send(
                {
                    nome:'Clarice Lispector',
                    nacionalidade: 'Ucraniana/Brasileira'
                }
            );
        expect(res.status).toBe(201);
        expect(res.body).toEqual(
            expect.objectContaining({
                nome:'Clarice Lispector',
                nacionalidade: 'Ucraniana/Brasileira'
            })
        );
    })

    test('POST /autores` com body vazio → 400', async () => {
        const res = await request(app).post('/autores').send();
        expect(res.status).toBe(400);
    }) /*ta vindo 500 */

    test('PUT /autores/1` (`{ nacionalidade }`) → 200 com a nacionalidade nova', async () => {
        const res = await request(app).put('/autores/1').send({nacionalidade: 'Inglês'});
        expect(res.status).toBe(200);
        expect(res.body.nacionalidade).toBe('Inglês');
    })

    test('PUT /autores/999` → 404', async () => {
        const res = await request(app).put('/autores/999').send({nacionalidade: 'Inglês'});
        expect(res.status).toBe(404);
    })

    test('DELETE /autores/3` → 204', async () => {
        const res = await request(app).delete('/autores/3');
        expect(res.status).toBe(204);
    })

    test('DELETE /autores/999` → 404', async () => {
        const res = await request(app).delete('/autores/999');
        expect(res.status).toBe(404);
    })

    test('GET /autores/1/livros` → 2 livros', async () => {
        const res = await request(app).get('/autores/1/livros');
        expect(res.body).toHaveLength(2);
    })

    test('GET /autores/3/livros` → 1 livro', async () => {
        const res = await request(app).get('/autores/3/livros');
        expect(res.body).toHaveLength(1);
    })
});