import request from 'supertest';
import { resetarBanco, fecharBanco } from '../helpers/db';
import app from '../../src/app'

// zera e re-semeia o banco antes de CADA teste, pra nenhum depender do outro
beforeEach(resetarBanco);
afterAll(fecharBanco);

describe('Rotas de livros', () => {
    test.todo('GET /livros → 200 e 5 livros')
    test.todo('GET /livros/1 → 200, titulo = "O Hobbit"')
    test.todo('GET /livros/999 → 404')
    test.todo('POST /livros válido (titulo, paginas ≥ 1, autor_id e editora_id existentes) → 201 com id no corpo')
    test.todo('POST /livros com body vazio → 400')
    test.todo('POST /livros com editora_id inexistente (999) → 400')
    test.todo('POST /livros com autor_id inexistente (999) → 400')
    test.todo('POST /livros com editora_id inexistente (999) → **400')
    test.todo('POST /livros com paginas = 0 → **400')
    test.todo('POST /livros com paginas negativas → 400')
    test.todo('PUT /livros/1 ({ paginas }) → 200')
    test.todo('PUT /livros/999 → 404')
    test.todo('DELETE /livros/5 → 204')
    test.todo('DELETE /livros/999 → 404')
    test.todo('GET /editoras/2/livros → os livros da editora 2')
    test.todo('POST /livros para a editora 2 e, em seguida, GET /editoras/2/livros → a lista cresce em 1 e inclui o novo livro')
})