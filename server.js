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
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Rota para processar o formulário
app.post('/processar-formulario', async (req, res) => {
  const { name, email, address, neighborhood, city, state, phone, message, recaptchaToken } = req.body;

  // Verifica o reCAPTCHA
  const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`;

  try {
    const recaptchaResponse = await axios.post(recaptchaUrl);

    if (recaptchaResponse.data.success) {
      // Envia o e-mail de confirmação para o e-mail fornecido no formulário
      const emailBody = 
       Nome: ${name}
       E-mail: ${email}
       Endereço: ${address}
       Bairro: ${neighborhood}
       Cidade: ${city}
       Estado: ${state}
       Telefone: ${phone}
       Mensagem: ${message}
       Obrigado por preencher o formulário, ${name}!

       Para confirmar sua identidade, clique no link a seguir:
        http://seusite.com/confirmar?email=${email}&token=${recaptchaToken}
      ;

      const mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: email,
        subject: 'Confirmação de Identidade',
        text: emailBody
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Erro ao enviar e-mail de confirmação:', error);
          res.status(500).send('Erro ao processar o formulário.');
        } else {
          console.log('E-mail de confirmação enviado:', info.response);
          res.status(200).send('Formulário processado com sucesso!');
        }
      });
    } else {
      console.error('Falha na verificação reCAPTCHA');
      res.status(400).send('Falha na verificação reCAPTCHA.');
    }
  } catch (error) {
    console.error('Erro na verificação reCAPTCHA:', error.message);
    res.status(500).send('Erro ao processar o formulário.');
  }
});

// Rota para confirmar a identidade
app.get('/confirmar', (req, res) => {
  const { email, token } = req.query;

  // Verifica se o token é válido (pode incluir lógica mais robusta)
  if (token) {
    // Envia e-mail de confirmação para mariozanin5@gmail.com
    const emailBody = `Identidade confirmada para o e-mail: ${email}`;

    const mailOptions = {
      from: process.env.EMAIL_SENDER,
      to: 'mariozanin5@gmail.com', // Destinatário fixo para confirmação
      subject: 'Confirmação de Identidade',
      text: emailBody
    };
  // Processa o formulário
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erro ao enviar e-mail de confirmação:', error);
        res.status(500).send('Erro ao confirmar identidade.');
      } else {
        console.log('E-mail de confirmação enviado:', info.response);
        res.status(200).send('Identidade confirmada com sucesso!');
      }
    });
  } else {
    console.error('Token inválido.');
    res.status(400).send('Token inválido.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
