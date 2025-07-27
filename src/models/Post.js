const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'Título é obrigatório'],
    trim: true,
    maxlength: [200, 'Título deve ter no máximo 200 caracteres']
  },
  conteudo: {
    type: String,
    required: [true, 'Conteúdo é obrigatório'],
    trim: true
  },
  autor: {
    type: String,
    required: [true, 'Autor é obrigatório'],
    trim: true,
    maxlength: [100, 'Nome do autor deve ter no máximo 100 caracteres']
  },
  disciplina: {
    type: String,
    trim: true,
    maxlength: [100, 'Disciplina deve ter no máximo 100 caracteres']
  },
  tags: [{
    type: String,
    trim: true
  }],
  dataCriacao: {
    type: Date,
    default: Date.now
  },
  dataAtualizacao: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt
});

// Middleware para atualizar dataAtualizacao antes de salvar
postSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.dataAtualizacao = Date.now();
  }
  next();
});

// Índices para melhorar performance das buscas
postSchema.index({ titulo: 'text', conteudo: 'text' });
postSchema.index({ autor: 1 });
postSchema.index({ dataCriacao: -1 });

module.exports = mongoose.model('Post', postSchema);
