require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require('express');
const bcrypt = require('bcrypt'); // Para criptografar a senha dos usuários
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./config/db'); // Conexão com o banco de dados MySQL

const app = express();
app.use(express.json()); // Middleware para lidar com JSON no corpo da requisição

// Configuração da sessão
app.use(session({
    secret: 'seuSegredoAqui',
    resave: false,
    saveUninitialized: true
}));

// Configuração do Passport com a estratégia do Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    // Verifique se o usuário já existe no banco de dados com o google_id
    db.query('SELECT * FROM Usuarios WHERE google_id = ?', [profile.id], (err, results) => {
        if (err) return done(err);

        if (results.length > 0) {
            // Usuário encontrado, faça login
            return done(null, results[0]);
        } else {
            // Usuário não encontrado, crie um novo com google_id, nome e email
            const query = 'INSERT INTO Usuarios (nome, email, google_id) VALUES (?, ?, ?)';
            db.query(query, [profile.displayName, profile.emails[0].value, profile.id], (err, result) => {
                if (err) return done(err);
                
                // Retorne o novo usuário
                const newUser = {
                    id: result.insertId,
                    nome: profile.displayName,
                    email: profile.emails[0].value,
                    google_id: profile.id
                };
                return done(null, newUser);
            });
        }
    });
  }
));

// Serialização e desserialização do usuário
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(passport.initialize());
app.use(passport.session());

// Rota de teste para verificar se o servidor está funcionando
app.get('/', (req, res) => res.send('API está funcionando com MySQL!'));

// Rota de registro de usuário
app.post('/api/register', async (req, res) => {
    const { nome, email, senha, carteira } = req.body;

    if (!nome || !email || !senha || !carteira) {
        return res.status(400).json({ error: 'Nome, e-mail, senha e endereço de carteira são obrigatórios' });
    }

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);
        const query = `INSERT INTO Usuarios (nome, email, senha) VALUES (?, ?, ?)`;
        
        db.query(query, [nome, email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ error: 'Erro ao registrar usuário' });

            const usuarioId = result.insertId;
            const carteiraQuery = `INSERT INTO Carteiras (usuario_id, endereco) VALUES (?, ?)`;
            
            db.query(carteiraQuery, [usuarioId, carteira], (err) => {
                if (err) return res.status(500).json({ error: 'Erro ao registrar carteira' });
                res.status(201).json({ message: 'Usuário registrado com sucesso' });
            });
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criptografar a senha' });
    }
});

// Rota de distribuição de airdrop com opção para apenas usuários verificados
app.post('/api/distribute', async (req, res) => {
    const quantidade = 10; // Quantidade fixa de tokens para cada usuário
    const somenteVerificados = req.body.somenteVerificados || false; // Adiciona opção para somente usuários verificados

    try {
        const query = somenteVerificados
            ? 'SELECT id FROM Usuarios WHERE perfil_verificado = TRUE'
            : 'SELECT id FROM Usuarios';

        db.query(query, (err, usuarios) => {
            if (err) {
                console.error('Erro ao buscar usuários:', err);
                return res.status(500).json({ error: 'Erro ao buscar usuários' });
            }

            usuarios.forEach((usuario) => {
                const airdropQuery = `INSERT INTO Airdrops (usuario_id, quantidade) VALUES (?, ?)`;
                db.query(airdropQuery, [usuario.id, quantidade], (err) => {
                    if (err) {
                        console.error('Erro ao registrar airdrop:', err);
                        return res.status(500).json({ error: 'Erro ao registrar airdrop' });
                    }
                });
            });

            res.status(200).json({ message: 'Airdrop distribuído com sucesso para os usuários qualificados' });
        });
    } catch (error) {
        console.error('Erro na distribuição de airdrops:', error);
        res.status(500).json({ error: 'Erro na distribuição de airdrops' });
    }
});

// Rota para login e incremento de interações
app.post('/api/auth/login', async (req, res) => {
    const { email, senha } = req.body;

    db.query('SELECT * FROM Usuarios WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro no servidor' });
        if (results.length === 0) return res.status(400).json({ error: 'Usuário não encontrado' });

        const usuario = results[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) return res.status(401).json({ error: 'Senha incorreta' });

        const atualizarInteracoesQuery = `UPDATE Usuarios SET interacoes = interacoes + 1 WHERE id = ?`;
        db.query(atualizarInteracoesQuery, [usuario.id], (err) => {
            if (err) return res.status(500).json({ error: 'Erro ao atualizar interações' });
            res.json({ message: 'Login realizado com sucesso e interações atualizadas' });
        });
    });
});

// Rota de autenticação com Google
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Rota de callback do Google após a autenticação
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.send('Login com Google realizado com sucesso!');
  }
);

// Rota para logout
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: 'Erro ao realizar logout' });
        res.send('Logout realizado com sucesso!');
    });
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

const path = require('path');

// Rota para servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Adicione esta linha ao seu código server.js
app.use(express.static('public'));
