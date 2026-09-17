import request from 'supertest';
import { resetarBanco, fecharBanco } from '../helpers/db';
import app from '../../src/app'

// zera e re-semeia o banco antes de CADA teste, pra nenhum depender do outro
beforeEach(resetarBanco);
afterAll(fecharBanco);

describe('Rotas de livros', () => {
    test('GET /livros → 200 e 5 livros', async() => {
        const res = await request(app).get('/livros');
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(5);
    })

    test('GET /livros/1 → 200, titulo = "O Hobbit"', async() => {
        const res = await request(app).get('/livros/1');
        expect(res.status).toBe(200);
        expect(res.body.titulo).toBe('O Hobbit')
    })

    test('GET /livros/999 → 404', async() => {
        const res = await request(app).get('/livros/999');
        expect(res.status).toBe(404);
    })

    test('POST /livros válido (titulo, paginas ≥ 1, autor_id e editora_id existentes) → 201 com id no corpo', async() => {
        const res = await request(app).post('/livros').send({
            titulo: 'Dom Casmurro',
            paginas: 208,
            autor_id: 3,
            editora_id: 4
        });
        expect(res.status).toBe(201);
        expect(res.body).toEqual(expect.objectContaining({
            titulo: 'Dom Casmurro',
            paginas: 208,
            autor_id: 3,
            editora_id: 4
        }))
    })

    test('POST /livros com body vazio → 400', async() => {
        const res = await request(app).post('/livros').send();
        expect(res.status).toBe(404);
    })

    test('POST /livros com editora_id inexistente (999) → 400', async() => {
        const res = await request(app).post('/livros').send({
            titulo: 'O Alienista',
            paginas: 208,
            autor_id: 3,
            editora_id: 999
        });
        expect(res.status).toBe(400);
    })

    test('POST /livros com autor_id inexistente (999) → 400', async () => {
        const res = await request(app).post('/livros').send({
            titulo: 'O Alienista',
            paginas: 208,
            autor_id: 999,
            editora_id: 4
        });
        expect(res.status).toBe(400);
    })

    test('POST /livros com paginas = 0 → 400', async () => {
        const res = await request(app).post('/livros').send({
            titulo: 'O Alienista',
            paginas: 0,
            autor_id: 3,
            editora_id: 4
        });
        expect(res.status).toBe(400);
    })

    test('POST /livros com paginas negativas → 400', async() => {
        const res = await request(app).post('/livros').send({
            titulo: 'O Alienista',
            paginas: -5,
            autor_id: 3,
            editora_id: 4
        })
        expect(res.status).toBe(400);
    })
    test.todo('PUT /livros/1 ({ paginas }) → 200')
    test.todo('PUT /livros/999 → 404')
    test.todo('DELETE /livros/5 → 204')
    test.todo('DELETE /livros/999 → 404')
    test.todo('GET /editoras/2/livros → os livros da editora 2')
    test.todo('POST /livros para a editora 2 e, em seguida, GET /editoras/2/livros → a lista cresce em 1 e inclui o novo livro')
})