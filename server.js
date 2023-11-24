const jwt = require('jsonwebtoken');
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Função para gerar um token de confirmação
function generateConfirmationToken(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Rota para processar o formulário
app.post('/processar-formulario', async (req, res) => {
  const { name, email, address, neighborhood, city, state, phone, message, recaptchaToken } = req.body;

  // Verifica o reCAPTCHA
  const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`;

  try {
    const recaptchaResponse = await axios.post(recaptchaUrl);

    if (recaptchaResponse.data.success) {
      // Gera o token de confirmação
      const confirmationToken = generateConfirmationToken(email);

      // Envia o e-mail de confirmação com o token
      const emailBody = `
        Obrigado por preencher o formulário, ${name}!

        Para confirmar sua identidade, clique no link a seguir:
        http://seusite.com/confirmar?email=${email}&token=${confirmationToken}
      `;

      const mailOptions = {
        from: process.env.EMAIL_USER,  // Use o remetente configurado no seu .env
        to: email,  // Usa o e-mail fornecido no formulário como destinatário
        subject: 'Confirmação de Identidade',
        text: emailBody
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erro ao enviar e-mail de confirmação:', error);
          res.status(500).send('Erro ao processar o formulário.');
        } else {
          console.log('E-mail de confirmação enviado:', info.response);
          // Agora, você pode decidir se deseja processar o formulário imediatamente ou aguardar a confirmação
          res.status(200).send('E-mail de confirmação enviado com sucesso!');
        }
      });
    } else {
      console.error('Falha na verificação reCAPTCHA');
      //res.status(400).send('Falha na verificação reCAPTCHA.');
      res.status(400).json({ success: false, error: 'Falha na verificação reCAPTCHA.' });
    }
  } catch (error) {
    console.error('Erro na verificação reCAPTCHA:', error.message);
    res.status(500).send('Erro ao processar o formulário.');
  }
});


// Rota para confirmar a identidade
app.get('/confirmar', (req, res) => {
  const { email, token } = req.query;

  // Verifica se o token é válido
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Token inválido:', err);
      return res.status(400).send('Token inválido.');
    }

  // Processa o formulário
    res.status(200).send('Identidade confirmada. Formulário processado com sucesso!');
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
