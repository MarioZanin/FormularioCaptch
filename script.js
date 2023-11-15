function submitForm() {
  var name = document.getElementById('name').value;
  var address = document.getElementById('address').value;
  var neighborhood = document.getElementById('neighborhood').value;
  var city = document.getElementById('city').value;
  var state = document.getElementById('state').value;
  var phone = document.getElementById('phone').value;
  var message = document.getElementById('message').value;

  // Preencha o espaço '  ' pela sua chave secreta do reCAPTCHA
  var recaptchaSecret = '6LeSzBApAAAAAFCNulGKzbAKDPKs0JebR2XJCB6-';

  // Preencha abaixo o espaço '   ' pela sua chave do site reCAPTCHA
  var recaptchaToken;
  grecaptcha.ready(function() {
    grecaptcha.execute('6LeSzBApAAAAAPjsa_dNEHVPZQzx5q4TwBgiQqTf', { action: 'submit' }).then(function(token) {
      recaptchaToken = token;

      // Envie a solicitação POST para a API do reCAPTCHA
      var xhr = new XMLHttpRequest();
      var url = 'https://www.google.com/recaptcha/api/siteverify';
      var params = 'secret=' + recaptchaSecret + '&response=' + recaptchaToken;

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

      xhr.onload = function() {
        var response = JSON.parse(xhr.responseText);

        // Verifique a resposta da API do reCAPTCHA
        if (response.success) {
          // Se a verificação for bem-sucedida, envie os dados do formulário para a API do seu servidor
          sendFormDataToServer(name, address, neighborhood, city, state, phone, message, recaptchaToken);
        } else {
          // Se a verificação falhar, trate de acordo (por exemplo, exiba uma mensagem de erro)
          console.error('Falha na verificação reCAPTCHA');
        }
      };

      xhr.send(params);
    });
  });
}

function sendFormDataToServer(name, address, neighborhood, city, state, phone, message, recaptchaToken) {
  // Substitua a URL abaixo pela URL da sua API onde você deseja enviar os dados do formulário
  var apiUrl = 'https://www.google.com/recaptcha/api/siteverify MÉTODO: POST';

  // Montar os dados do formulário
  var formData = {
    name: name,
    address: address,
    neighborhood: neighborhood,
    city: city,
    state: state,
    phone: phone,
    message: message,
    recaptchaToken: recaptchaToken
  };

  // Envie os dados para a API do seu servidor
  var xhr = new XMLHttpRequest();
  xhr.open('POST', apiUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log('Formulário enviado com sucesso para o servidor:', xhr.responseText);
    } else {
      console.error('Erro ao enviar o formulário para o servidor. Status:', xhr.status);
    }
  };

  xhr.send(JSON.stringify(formData));
}

function onClick(event) {
    e.preventDefault();
    grecaptcha.ready(function() {
      grecaptcha.execute('6LeSzBApAAAAAPjsa_dNEHVPZQzx5q4TwBgiQqTf', {action: 'submit'}).then(function(token) {
        
       var result = "Nome: " + name + "<br>" +
        "Endereço: " + address + "<br>" +
        "Bairro: " + neighborhood + "<br>" +
        "Cidade: " + city + "<br>" +
        "Estado: " + state + "<br>" +
        "Telefone: " + phone + "<br>" +
        "Mensagem: " + message;

       var newPage = window.open('');
       newPage.document.write(result);
     
      });
    });
}