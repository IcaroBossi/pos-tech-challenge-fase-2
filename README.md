# 📚 Blog de Aulas - API Back-end

API REST para um blog de aulas desenvolvida para a disciplina de Back-End da Pós-Tech FIAP. Esta aplicação permite que professores da rede pública criem, editem e compartilhem conteúdo de aulas de forma centralizada e tecnológica.

## 🎯 Objetivo

Resolver o problema da falta de plataformas onde professores da rede pública possam postar suas aulas e transmitir conhecimento para alunos de forma prática, centralizada e tecnológica.

## 🚀 Funcionalidades

- ✅ **Criação de posts**: Professores podem criar novas postagens
- ✅ **Listagem de posts**: Visualização de todos os posts com paginação
- ✅ **Busca de posts**: Busca por palavra-chave no título, conteúdo ou tags
- ✅ **Edição de posts**: Atualização de postagens existentes
- ✅ **Exclusão de posts**: Remoção de postagens
- ✅ **Filtros**: Filtrar posts por autor ou disciplina

## 🛠️ Tecnologias Utilizadas

- **Node.js** - Ambiente de execução JavaScript
- **Express.js** - Framework web para Node.js
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **Docker** - Containerização da aplicação
- **Jest** - Framework de testes
- **Joi** - Validação de dados
- **Helmet** - Segurança HTTP
- **CORS** - Controle de acesso entre origens

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- Docker e Docker Compose
- Git

## 🔧 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone https://github.com/IcaroBossi/pos-tech-challenge-fase-2.git
cd pos-tech-challenge-fase-2
```

### 2. Configuração com Docker (Recomendado)

```bash
# Construir e iniciar todos os serviços
docker-compose up --build

# Para rodar em background
docker-compose up -d --build
```

A aplicação estará disponível em:
- **API**: http://localhost:3000
- **MongoDB Express**: http://localhost:8081 (admin/admin123)

### 3. Configuração Manual (Alternativa)

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Iniciar MongoDB
# Iniciar aplicação em modo desenvolvimento
npm run dev
```

## 📡 Endpoints da API

### Posts

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/posts` | Lista todos os posts com paginação |
| `GET` | `/posts/:id` | Busca um post específico |
| `POST` | `/posts` | Cria um novo post |
| `PUT` | `/posts/:id` | Atualiza um post existente |
| `DELETE` | `/posts/:id` | Remove um post |
| `GET` | `/posts/search` | Busca posts por palavra-chave |

### Outros

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/health` | Status de saúde da aplicação |

## 📝 Exemplos de Uso da API

### Criar um Post

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Introdução ao JavaScript",
    "conteudo": "Nesta aula vamos aprender os conceitos básicos do JavaScript...",
    "autor": "Prof. João Silva",
    "disciplina": "Programação",
    "tags": ["javascript", "programação", "básico"]
  }'
```

### Listar Posts

```bash
curl http://localhost:3000/posts?page=1&limit=10
```

### Buscar Posts

```bash
curl "http://localhost:3000/posts/search?q=javascript"
```

### Buscar Post por ID

```bash
curl http://localhost:3000/posts/ID_DO_POST
```

### Atualizar Post

```bash
curl -X PUT http://localhost:3000/posts/ID_DO_POST \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "JavaScript Avançado",
    "conteudo": "Nesta aula vamos ver conceitos avançados..."
  }'
```

### Deletar Post

```bash
curl -X DELETE http://localhost:3000/posts/ID_DO_POST
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

## 📊 Estrutura do Projeto

```
pos-tech-challenge-fase-2/
├── src/
│   ├── app.js              # Aplicação principal
│   ├── config/
│   │   └── database.js     # Configuração do MongoDB
│   ├── controllers/
│   │   └── postsController.js # Controlador dos posts
│   ├── middleware/
│   │   └── validation.js   # Middlewares de validação
│   ├── models/
│   │   └── Post.js        # Modelo do Post
│   └── routes/
│       └── posts.js       # Rotas dos posts
├── tests/
│   └── posts.test.js      # Testes unitários
├── docker-compose.yml     # Configuração Docker Compose
├── Dockerfile            # Configuração Docker
├── init-mongo.js         # Script de inicialização do MongoDB
└── package.json         # Dependências e scripts
```

## 🔒 Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/blog-aulas
NODE_ENV=development
```

## 🐳 Docker

O projeto inclui configuração completa do Docker:

- **Dockerfile**: Para construir a imagem da aplicação
- **docker-compose.yml**: Para orquestrar aplicação + MongoDB + Mongo Express
- **init-mongo.js**: Script para inicializar o banco com dados de exemplo

## 📈 Cobertura de Testes

O projeto mantém cobertura de testes superior a 20% conforme requisito da disciplina. Para verificar a cobertura:

```bash
npm run test:coverage
```

## 🔄 CI/CD

O projeto utiliza GitHub Actions para automação:

- ✅ Execução de testes em múltiplas versões do Node.js
- 🔍 Análise de segurança com Snyk
- 🐳 Build e push automático de imagens Docker
- 📊 Cobertura de código com Codecov
- 🚀 Deploy automatizado na branch main

## 📊 Monitoramento

### Health Check

```bash
curl http://localhost:3000/health
```

### Logs

A aplicação registra:
- Requisições HTTP
- Conexões com banco de dados
- Erros e exceções

## 🔒 Segurança

- Rate limiting (100 req/15min por IP)
- Helmet para headers de segurança
- Validação rigorosa de dados
- Sanitização de inputs
- Auditoria de dependências

## 📈 Performance

- Índices otimizados no MongoDB
- Paginação eficiente
- Busca por texto completo
- Cache de consultas (através do Mongoose)

## 🚀 Deploy

### Docker Hub

As imagens são automaticamente publicadas no Docker Hub:

```bash
docker pull icarobossi/blog-aulas-api:latest
```

## 📝 Experiências e Desafios

### Principais Aprendizados

1. **Arquitetura RESTful**: Implementação de uma API seguindo princípios REST
2. **Validação de Dados**: Uso do Joi para validação robusta
3. **Containerização**: Configuração completa com Docker e Docker Compose
4. **Testes Automatizados**: Cobertura de código e testes de integração
5. **CI/CD**: Automação completa com GitHub Actions

### Desafios Enfrentados

1. **Configuração do MongoDB**: Integração com Docker e configuração de índices
2. **Validação Complexa**: Balanceamento entre validação client-side e server-side
3. **Testes de Integração**: Configuração de ambiente de teste isolado
4. **Performance**: Otimização de consultas e implementação de paginação

## 👨‍💻 Autor

**Ícaro Bossi**
- GitHub: [@IcaroBossi](https://github.com/IcaroBossi)
- Projeto: Pós-Tech FIAP - Tech Challenge Fase 2 - Back-End
