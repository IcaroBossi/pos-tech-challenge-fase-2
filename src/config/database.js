const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-aulas';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB conectado: ${conn.connection.host}`);
    
    // Log de eventos de conexão
    mongoose.connection.on('connected', () => {
      console.log('Mongoose conectado ao MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Erro na conexão do Mongoose:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose desconectado');
    });

  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
};

// Fechar a conexão 
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('Conexão com MongoDB fechada');
  } catch (error) {
    console.error('Erro ao fechar conexão com MongoDB:', error);
  }
};

module.exports = { connectDB, closeDB };
