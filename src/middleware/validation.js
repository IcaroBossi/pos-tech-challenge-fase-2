const Joi = require('joi');

// Schema de validação para criação de posts
const createPostSchema = Joi.object({
  titulo: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Título é obrigatório',
      'string.min': 'Título deve ter pelo menos 3 caracteres',
      'string.max': 'Título deve ter no máximo 200 caracteres',
      'any.required': 'Título é obrigatório'
    }),
  
  conteudo: Joi.string()
    .trim()
    .min(10)
    .required()
    .messages({
      'string.empty': 'Conteúdo é obrigatório',
      'string.min': 'Conteúdo deve ter pelo menos 10 caracteres',
      'any.required': 'Conteúdo é obrigatório'
    }),
  
  autor: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Autor é obrigatório',
      'string.min': 'Nome do autor deve ter pelo menos 2 caracteres',
      'string.max': 'Nome do autor deve ter no máximo 100 caracteres',
      'any.required': 'Autor é obrigatório'
    }),
  
  disciplina: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Disciplina deve ter no máximo 100 caracteres'
    }),
  
  tags: Joi.array()
    .items(Joi.string().trim())
    .optional()
    .messages({
      'array.base': 'Tags devem ser um array de strings'
    })
});

// Schema de validação para atualização de posts
const updatePostSchema = Joi.object({
  titulo: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Título deve ter pelo menos 3 caracteres',
      'string.max': 'Título deve ter no máximo 200 caracteres'
    }),
  
  conteudo: Joi.string()
    .trim()
    .min(10)
    .optional()
    .messages({
      'string.min': 'Conteúdo deve ter pelo menos 10 caracteres'
    }),
  
  autor: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Nome do autor deve ter pelo menos 2 caracteres',
      'string.max': 'Nome do autor deve ter no máximo 100 caracteres'
    }),
  
  disciplina: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Disciplina deve ter no máximo 100 caracteres'
    }),
  
  tags: Joi.array()
    .items(Joi.string().trim())
    .optional()
    .messages({
      'array.base': 'Tags devem ser um array de strings'
    })
});

// Middleware para validar criação de posts
const validateCreatePost = (req, res, next) => {
  const { error } = createPostSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Dados inválidos',
      erros: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

// Middleware para validar atualização de posts
const validateUpdatePost = (req, res, next) => {
  const { error } = updatePostSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Dados inválidos',
      erros: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

// Middleware para validar ObjectId do MongoDB
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'ID inválido'
    });
  }
  
  next();
};

// Validação para busca de posts
const validateSearchQuery = (req, res, next) => {
  const { q } = req.query;
  
  if (!q || q.trim().length === 0) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Parâmetro de busca (q) é obrigatório'
    });
  }
  
  if (q.trim().length < 2) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Termo de busca deve ter pelo menos 2 caracteres'
    });
  }
  
  next();
};

// ==================== VALIDAÇÕES DE PROFESSOR ====================

// Schema de validação para criação de professor
const createProfessorSchema = Joi.object({
  nome: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Nome é obrigatório',
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres',
      'any.required': 'Nome é obrigatório'
    }),
  
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      'string.empty': 'Email é obrigatório',
      'string.email': 'Email deve ter um formato válido',
      'any.required': 'Email é obrigatório'
    }),
  
  disciplina: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Disciplina deve ter no máximo 100 caracteres'
    })
});

// Schema de validação para atualização de professor
const updateProfessorSchema = Joi.object({
  nome: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres'
    }),
  
  email: Joi.string()
    .trim()
    .email()
    .optional()
    .messages({
      'string.email': 'Email deve ter um formato válido'
    }),
  
  disciplina: Joi.string()
    .trim()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Disciplina deve ter no máximo 100 caracteres'
    })
});

// Middleware para validar criação de professor
const validateCreateProfessor = (req, res, next) => {
  const { error } = createProfessorSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Dados inválidos',
      erros: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

// Middleware para validar atualização de professor
const validateUpdateProfessor = (req, res, next) => {
  const { error } = updateProfessorSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Dados inválidos',
      erros: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

// ==================== VALIDAÇÕES DE ALUNO ====================

// Schema de validação para criação de aluno
const createAlunoSchema = Joi.object({
  nome: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Nome é obrigatório',
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres',
      'any.required': 'Nome é obrigatório'
    }),
  
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      'string.empty': 'Email é obrigatório',
      'string.email': 'Email deve ter um formato válido',
      'any.required': 'Email é obrigatório'
    }),
  
  turma: Joi.string()
    .trim()
    .max(50)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Turma deve ter no máximo 50 caracteres'
    })
});

// Schema de validação para atualização de aluno
const updateAlunoSchema = Joi.object({
  nome: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 100 caracteres'
    }),
  
  email: Joi.string()
    .trim()
    .email()
    .optional()
    .messages({
      'string.email': 'Email deve ter um formato válido'
    }),
  
  turma: Joi.string()
    .trim()
    .max(50)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Turma deve ter no máximo 50 caracteres'
    })
});

// Middleware para validar criação de aluno
const validateCreateAluno = (req, res, next) => {
  const { error } = createAlunoSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Dados inválidos',
      erros: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

// Middleware para validar atualização de aluno
const validateUpdateAluno = (req, res, next) => {
  const { error } = updateAlunoSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      sucesso: false,
      mensagem: 'Dados inválidos',
      erros: error.details.map(detail => detail.message)
    });
  }
  
  next();
};

module.exports = {
  validateCreatePost,
  validateUpdatePost,
  validateObjectId,
  validateSearchQuery,
  validateCreateProfessor,
  validateUpdateProfessor,
  validateCreateAluno,
  validateUpdateAluno
};
