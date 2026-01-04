const Aluno = require('../models/Aluno');

// GET /alunos - Lista todos os alunos
const listarAlunos = async (req, res) => {
  try {
    const { page = 1, limit = 10, nome, turma } = req.query;
    const skip = (page - 1) * limit;
    
    // Filtros
    const filtros = {};
    if (nome) filtros.nome = new RegExp(nome, 'i');
    if (turma) filtros.turma = new RegExp(turma, 'i');
    
    // Buscar alunos com paginação
    const alunos = await Aluno.find(filtros)
      .sort({ dataCriacao: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .select('-__v');
    
    // Total de alunos para paginação
    const total = await Aluno.countDocuments(filtros);
    
    res.status(200).json({
      sucesso: true,
      dados: alunos,
      paginacao: {
        paginaAtual: parseInt(page),
        totalPaginas: Math.ceil(total / limit),
        totalAlunos: total,
        alunosPorPagina: alunos.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

// GET /alunos/:id - Busca um aluno específico
const buscarAlunoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const aluno = await Aluno.findById(id).select('-__v');
    
    if (!aluno) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Aluno não encontrado'
      });
    }
    
    res.status(200).json({
      sucesso: true,
      dados: aluno
    });
  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

// POST /alunos - Cria um novo aluno
const criarAluno = async (req, res) => {
  try {
    const { nome, email, turma } = req.body;
    
    // Verificar se já existe aluno com este email
    const alunoExistente = await Aluno.findOne({ email: email.toLowerCase() });
    if (alunoExistente) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Já existe um aluno cadastrado com este email'
      });
    }
    
    const novoAluno = new Aluno({
      nome,
      email,
      turma
    });
    
    const alunoSalvo = await novoAluno.save();
    
    res.status(201).json({
      sucesso: true,
      mensagem: 'Aluno criado com sucesso!',
      dados: alunoSalvo
    });
  } catch (error) {
    console.error('Erro ao criar aluno:', error);
    
    if (error.name === 'ValidationError') {
      const erros = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Dados inválidos',
        erros
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Já existe um aluno cadastrado com este email'
      });
    }
    
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

// PUT /alunos/:id - Atualiza um aluno existente
const atualizarAluno = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizacao = { ...req.body };
    
    // Se o email está sendo atualizado, verificar duplicidade
    if (dadosAtualizacao.email) {
      const alunoExistente = await Aluno.findOne({ 
        email: dadosAtualizacao.email.toLowerCase(),
        _id: { $ne: id }
      });
      if (alunoExistente) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Já existe um aluno cadastrado com este email'
        });
      }
    }
    
    // Atualizar data de modificação
    dadosAtualizacao.dataAtualizacao = new Date();
    
    const alunoAtualizado = await Aluno.findByIdAndUpdate(
      id,
      dadosAtualizacao,
      { 
        new: true,
        runValidators: true
      }
    ).select('-__v');
    
    if (!alunoAtualizado) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Aluno não encontrado'
      });
    }
    
    res.status(200).json({
      sucesso: true,
      mensagem: 'Aluno atualizado com sucesso!',
      dados: alunoAtualizado
    });
  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    
    if (error.name === 'ValidationError') {
      const erros = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Dados inválidos',
        erros
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Já existe um aluno cadastrado com este email'
      });
    }
    
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

// DELETE /alunos/:id - Remove um aluno
const deletarAluno = async (req, res) => {
  try {
    const { id } = req.params;
    
    const alunoRemovido = await Aluno.findByIdAndDelete(id);
    
    if (!alunoRemovido) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Aluno não encontrado'
      });
    }
    
    res.status(200).json({
      sucesso: true,
      mensagem: 'Aluno removido com sucesso!',
      dados: alunoRemovido
    });
  } catch (error) {
    console.error('Erro ao deletar aluno:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  listarAlunos,
  buscarAlunoPorId,
  criarAluno,
  atualizarAluno,
  deletarAluno
};
