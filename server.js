const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Dados fictícios de usuário
const users = [
    { id: 1, username: 'usuario', password: 'senha_secreta', totpSecret: process.env.TOTP_SECRET }
];

// Rota para renderizar a página de login
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Rota para processar o formulário de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Gera um token de autenticação
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Gera um segredo TOTP para o usuário, se ainda não tiver
        if (!user.totpSecret) {
            user.totpSecret = speakeasy.generateSecret({ length: 20 }).base32;
        }

        // Envia o segredo para o e-mail do usuário
        const emailBody = `Seu código TOTP: ${user.totpSecret}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: `${username}@example.com`, // Substitua pelo e-mail real do usuário
            subject: 'Código TOTP',
            text: emailBody
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Erro ao enviar e-mail:', error);
                res.status(500).send('Erro ao processar o login.');
            } else {
                console.log('E-mail enviado:', info.response);
                // Renderiza a página para inserir o código TOTP
                res.sendFile(__dirname + '/totp.html');
            }
        });
    } else {
        res.status(401).send('Credenciais inválidas.');
    }
});

// Rota para verificar o código TOTP
app.post('/verify-totp', (req, res) => {
    const { username, totp } = req.body;
    const user = users.find(u => u.username === username);

    if (user) {
        // Verifica o código TOTP
        const verified = speakeasy.totp.verify({
            secret: user.totpSecret,
            encoding: 'base32',
            token: totp,
            window: 1
        });

        if (verified) {
            res.status(200).send('Código TOTP válido. Login bem-sucedido!');
        } else {
            res.status(401).send('Código TOTP inválido.');
        }
    } else {
        res.status(401).send('Usuário não encontrado.');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
