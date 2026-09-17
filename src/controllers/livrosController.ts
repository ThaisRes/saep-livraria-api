import type { Request, Response } from 'express';
import { AppDataSource } from '../db/dataSource';
import { Livro } from '../models/livro';
import { Autor } from '../models/autor';
import { Editora} from '../models/editora';

const livros = () => AppDataSource.getRepository(Livro);
const autores = () => AppDataSource.getRepository(Autor);
const editoras = () => AppDataSource.getRepository(Editora);

export async function listarLivros(_req: Request, res: Response): Promise<void> {
  res.json(await livros().find({ order: { id: 'ASC' } }));
}

export async function mostrarLivro(req: Request, res: Response): Promise<void> {
  const livro = await livros().findOneBy({ id: Number(req.params.id) });
  if (!livro) {
    res.status(404).json({ erro: 'Livro não encontrado' });
    return;
  }
  res.json(livro);
}

export async function criarLivro(req: Request, res: Response): Promise<void> {
  const dados = req.body as Partial<Livro>;
  const livro = livros().create(dados);
  if(!dados){
    res.status(404).json({erro: 'Os dados do livro devem ser informados.'})
  };
  
  if(!dados.paginas || dados.paginas <= 0){
    res.status(400).json({erro: 'O número de páginas deve ser maior que zero'})
  }

  const autorID = await autores().findOneBy({id: Number(dados.autor_id)});
  if(!autorID){
    res.status(400).json({erro: 'Autor não cadastrado'})
  }

  const editoraID = await editoras().findOneBy({id: Number(dados.editora_id)});
  if(!editoraID){
    res.status(400).json({erro: 'Editora não cadastrada'})
  }

  await livros().save(livro);
  res.status(201).json(livro);
}

export async function atualizarLivro(req: Request, res: Response): Promise<void> {
  const repo = livros();
  const livro = await repo.findOneBy({ id: Number(req.params.id) });
  if (!livro) {
    res.status(404).json({ erro: 'Livro não encontrado' });
    return;
  }
  repo.merge(livro, req.body as Partial<Livro>);
  await repo.save(livro);
  res.json(livro);
}

export async function excluirLivro(req: Request, res: Response): Promise<void> {
  const resultado = await livros().delete(Number(req.params.id));
  if (resultado.affected === 0) {
    res.status(404).json({ erro: 'Livro não encontrado' });
    return;
  }
  res.status(204).send();
}
