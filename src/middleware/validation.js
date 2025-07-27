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

module.exports = {
  validateCreatePost,
  validateUpdatePost,
  validateObjectId,
  validateSearchQuery
};
