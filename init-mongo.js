// Script de inicialização do MongoDB
// Este arquivo é executado quando o container do MongoDB é criado pela primeira vez

db = db.getSiblingDB('blog-aulas');

// Criar coleção de posts com alguns dados de exemplo
db.posts.insertMany([
  {
    titulo: "Introdução à Matemática Básica",
    conteudo: "Nesta aula, vamos explorar os conceitos fundamentais da matemática, incluindo operações básicas, números inteiros e frações.",
    autor: "Prof. Maria",
    disciplina: "Matemática",
    tags: ["matemática", "números", "operações", "básico"],
    dataCriacao: new Date(),
    dataAtualizacao: new Date()
  },
  {
    titulo: "História do Brasil Colonial",
    conteudo: "Vamos estudar o período colonial brasileiro, desde a chegada dos portugueses até a independência.",
    autor: "Prof. João",
    disciplina: "História",
    tags: ["história", "brasil", "colonial", "portugal"],
    dataCriacao: new Date(),
    dataAtualizacao: new Date()
  },
  {
    titulo: "Fotossíntese e Respiração Celular",
    conteudo: "Nesta aula, vamos entender como as plantas produzem seu próprio alimento através da fotossíntese e como todos os seres vivos obtêm energia através da respiração celular.",
    autor: "Prof. Ana",
    disciplina: "Biologia",
    tags: ["biologia", "fotossíntese", "respiração", "células"],
    dataCriacao: new Date(),
    dataAtualizacao: new Date()
  }
]);

// Criar índices para melhorar performance
db.posts.createIndex({ "titulo": "text", "conteudo": "text" });
db.posts.createIndex({ "autor": 1 });
db.posts.createIndex({ "dataCriacao": -1 });

print("Base de dados inicializada com sucesso!");
