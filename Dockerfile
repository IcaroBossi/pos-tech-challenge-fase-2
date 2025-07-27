# Usar imagem oficial do Node.js LTS
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY src/ ./src/

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Mudar propriedade dos arquivos para o usuário nodejs
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expor porta da aplicação
EXPOSE 3000

# Definir variáveis de ambiente
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["node", "src/app.js"]
