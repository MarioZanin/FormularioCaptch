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

// Rota para processar o formulário
app.post('/processar-formulario', async (req, res) => {
  const { name, email, address, neighborhood, city, state, phone, message, recaptchaToken } = req.body;

  // Verifica o reCAPTCHA
  const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`;

  try {
    const recaptchaResponse = await axios.post(recaptchaUrl);

    if (recaptchaResponse.data.success) {
      // Envia o e-mail de confirmação para o e-mail fornecido no formulário
      const emailBody = `
        Obrigado por preencher o formulário, ${name}!

        Para confirmar sua identidade, clique no link a seguir:
        https://mariozanin.github.io/FormularioCaptch/confirmar?email=${email}&token=${recaptchaToken}
      `;

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
          // Agora, você pode decidir se deseja processar o formulário imediatamente ou aguardar a confirmação
          res.status(200).send('E-mail de confirmação enviado com sucesso!');
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
  
 // Seu código existente...

// Rota para confirmar a identidade
app.post('/confirmar', (req, res) => {
    const { name, email, address, neighborhood, city, state, phone, message, recaptchaToken } = req.body;
  
    // Verifique se o token é válido (pode incluir lógica mais robusta)
    if (recaptchaToken) {
      // Envie o e-mail de confirmação para o e-mail fornecido no formulário
      const emailBody = `
        Obrigado por preencher o formulário, ${name}!
  
        Seu formulário foi recebido. Agora você pode clicar no link a seguir para confirmar:
        https://mariozanin.github.io/FormularioCaptch/processar-formulario?name=${name}&email=${email}&address=${address}&neighborhood=${neighborhood}&city=${city}&state=${state}&phone=${phone}&message=${message}&recaptchaToken=${recaptchaToken}
      `;
  
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
          res.status(200).send('E-mail de confirmação enviado com sucesso!');
        }
      });
    } else {
      console.error('Token inválido.');
      res.status(400).send('Token inválido.');
    }
  });
  
  // Rota para processar o formulário após a confirmação
  app.post('/processar-formulario', async (req, res) => {
    const { name, email, address, neighborhood, city, state, phone, message, recaptchaToken } = req.body;
  
    // Verifique o reCAPTCHA
    const recaptchaUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaToken}`;
  
    try {
      const recaptchaResponse = await axios.post(recaptchaUrl);
  
      if (recaptchaResponse.data.success) {
        // Processar o formulário após a confirmação
        // Seu código de processamento do formulário aqui...
        res.status(200).send('Formulário processado com sucesso!');
      } else {
        console.error('Falha na verificação reCAPTCHA');
        res.status(400).send('Falha na verificação reCAPTCHA.');
      }
    } catch (error) {
      console.error('Erro na verificação reCAPTCHA:', error.message);
      res.status(500).send('Erro ao processar o formulário.');
    }
  });
  