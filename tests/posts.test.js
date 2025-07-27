const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Post = require('../src/models/Post');

describe('Posts Controller', () => {
  // Configuração do banco de teste
  beforeAll(async () => {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-aulas-test';
    await mongoose.connect(MONGODB_URI);
  });

  beforeEach(async () => {
    // Limpa a coleção antes de cada teste
    await Post.deleteMany({});
  });

  afterAll(async () => {
    // Aguardar operações pendentes finalizarem
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Fechar conexão MongoDB de forma segura
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    
    // Aguardar um pouco mais para garantir limpeza completa
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  describe('POST /posts', () => {
    it('cria um novo post com dados válidos', async () => {
      const novoPost = {
        titulo: 'Teste de Post',
        conteudo: 'Conteúdo do post de teste com pelo menos 10 caracteres',
        autor: 'Professor Teste'
      };

      const response = await request(app)
        .post('/posts')
        .send(novoPost)
        .expect(201);

      expect(response.body.sucesso).toBe(true);
      expect(response.body.dados.titulo).toBe(novoPost.titulo);
      expect(response.body.dados.conteudo).toBe(novoPost.conteudo);
      expect(response.body.dados.autor).toBe(novoPost.autor);
    });

    it('retorna erro 400 para dados inválidos', async () => {
      const postInvalido = {
        titulo: 'A', // Muito curto
        conteudo: 'B', // Muito curto
        autor: '' // Vazio
      };

      const response = await request(app)
        .post('/posts')
        .send(postInvalido)
        .expect(400);

      expect(response.body.sucesso).toBe(false);
      expect(response.body.erros).toBeDefined();
    });
  });

  describe('GET /posts', () => {
    beforeEach(async () => {
      // Criar posts de teste
      await Post.create([
        {
          titulo: 'Post 1',
          conteudo: 'Conteúdo do primeiro post',
          autor: 'Autor 1'
        },
        {
          titulo: 'Post 2',
          conteudo: 'Conteúdo do segundo post',
          autor: 'Autor 2'
        }
      ]);
    });

    it('retorna lista de posts', async () => {
      const response = await request(app)
        .get('/posts')
        .expect(200);

      expect(response.body.sucesso).toBe(true);
      expect(response.body.dados).toHaveLength(2);
      expect(response.body.paginacao).toBeDefined();
    });

    it('aplica paginação corretamente', async () => {
      const response = await request(app)
        .get('/posts?page=1&limit=1')
        .expect(200);

      expect(response.body.dados).toHaveLength(1);
      expect(response.body.paginacao.paginaAtual).toBe(1);
      expect(response.body.paginacao.totalPosts).toBe(2);
    });
  });

  describe('GET /posts/:id', () => {
    let postId;

    beforeEach(async () => {
      const post = await Post.create({
        titulo: 'Post para teste de busca',
        conteudo: 'Conteúdo do post para teste',
        autor: 'Autor do teste'
      });
      postId = post._id;
    });

    it('retorna um post específico', async () => {
      const response = await request(app)
        .get(`/posts/${postId}`)
        .expect(200);

      expect(response.body.sucesso).toBe(true);
      expect(response.body.dados._id).toBe(postId.toString());
    });

    it('retorna 404 para post inexistente', async () => {
      const idInexistente = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/posts/${idInexistente}`)
        .expect(404);

      expect(response.body.sucesso).toBe(false);
    });

    it('retorna 400 para ID inválido', async () => {
      const response = await request(app)
        .get('/posts/id-invalido')
        .expect(400);

      expect(response.body.sucesso).toBe(false);
    });
  });

  describe('PUT /posts/:id', () => {
    let postId;

    beforeEach(async () => {
      const post = await Post.create({
        titulo: 'Post original',
        conteudo: 'Conteúdo original do post',
        autor: 'Autor original'
      });
      postId = post._id;
    });

    it('atualiza um post existente', async () => {
      const dadosAtualizacao = {
        titulo: 'Post atualizado',
        conteudo: 'Conteúdo atualizado do post'
      };

      const response = await request(app)
        .put(`/posts/${postId}`)
        .send(dadosAtualizacao)
        .expect(200);

      expect(response.body.sucesso).toBe(true);
      expect(response.body.dados.titulo).toBe(dadosAtualizacao.titulo);
      expect(response.body.dados.conteudo).toBe(dadosAtualizacao.conteudo);
    });

    it('retorna 404 para post inexistente', async () => {
      const idInexistente = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .put(`/posts/${idInexistente}`)
        .send({ titulo: 'Teste' })
        .expect(404);

      expect(response.body.sucesso).toBe(false);
    });
  });

  describe('DELETE /posts/:id', () => {
    let postId;

    beforeEach(async () => {
      const post = await Post.create({
        titulo: 'Post para deletar',
        conteudo: 'Conteúdo do post para deletar',
        autor: 'Autor do post'
      });
      postId = post._id;
    });

    it('deleta um post existente', async () => {
      const response = await request(app)
        .delete(`/posts/${postId}`)
        .expect(200);

      expect(response.body.sucesso).toBe(true);

      // Verificar se o post foi realmente deletado
      const postDeletado = await Post.findById(postId);
      expect(postDeletado).toBeNull();
    });

    it('retorna 404 para post inexistente', async () => {
      const idInexistente = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/posts/${idInexistente}`)
        .expect(404);

      expect(response.body.sucesso).toBe(false);
    });
  });

  describe('GET /posts/search', () => {
    beforeEach(async () => {
      await Post.create([
        {
          titulo: 'Matematica Basica',
          conteudo: 'Aula sobre numeros e operacoes',
          autor: 'Prof. Joao'
        },
        {
          titulo: 'Historia do Brasil',
          conteudo: 'Aula sobre periodo colonial',
          autor: 'Prof. Maria'
        }
      ]);
    });

    it('busca posts por termo no título', async () => {
      const response = await request(app)
        .get('/posts/search?q=Matematica')
        .expect(200);

      expect(response.body.sucesso).toBe(true);
      expect(response.body.dados).toHaveLength(1);
      expect(response.body.dados[0].titulo).toContain('Matematica');
    });

    it('busca posts por termo no conteúdo', async () => {
      const response = await request(app)
        .get('/posts/search?q=colonial')
        .expect(200);

      expect(response.body.sucesso).toBe(true);
      expect(response.body.dados).toHaveLength(1);
      expect(response.body.dados[0].conteudo).toContain('colonial');
    });

    it('retorna erro 400 sem termo de busca', async () => {
      const response = await request(app)
        .get('/posts/search')
        .expect(400);

      expect(response.body.sucesso).toBe(false);
    });
  });
});
