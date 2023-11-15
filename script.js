function submitForm('6LeSzBApAAAAAPjsa_dNEHVPZQzx5q4TwBgiQqTf') {
  var name = document.getElementById('name').value;
  var address = document.getElementById('address').value;
  var neighborhood = document.getElementById('neighborhood').value;
  var city = document.getElementById('city').value;
  var state = document.getElementById('state').value;
  var phone = document.getElementById('phone').value;
  var message = document.getElementById('message').value;

  // Substitua 'seu_segredo' pela sua chave secreta do reCAPTCHA
  var recaptchaSecret = '6LeSzBApAAAAAFCNulGKzbAKDPKs0JebR2XJCB6-';

  // Substitua 'reCAPTCHA_site_key' pela sua chave do site reCAPTCHA
  var recaptchaToken;
  grecaptcha.ready(function() {
    grecaptcha.execute(siteKey, { action: 'submit' }).then(function(token) {
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
          // Se a verificação for bem-sucedida, envie os dados do formulário para a nova página
          window.location.href = 'resultado.html?name=' + encodeURIComponent(name) +
          '&address=' + encodeURIComponent(address) +
          '&neighborhood=' + encodeURIComponent(neighborhood) +
          '&city=' + encodeURIComponent(city) +
          '&state=' + encodeURIComponent(state) +
          '&phone=' + encodeURIComponent(phone) +
          '&message=' + encodeURIComponent(message);        } else {
          // Se a verificação falhar, trate de acordo (por exemplo, exiba uma mensagem de erro)
          console.error('Falha na verificação reCAPTCHA');
        }
      };

      xhr.send(params);
    });
  });
}

function onClick(event) {
  event.preventDefault();
  //grecaptcha.ready(function() {
  //grecaptcha.execute('6LeSzBApAAAAAPjsa_dNEHVPZQzx5q4TwBgiQqTf', {action: 'submit'}).then(function(token) {
  
  // Substitua 'reCAPTCHA_site_key' pela sua chave do site reCAPTCHA
  var siteKey = '6LeSzBApAAAAAPjsa_dNEHVPZQzx5q4TwBgiQqTf';

  // Chame a função submitForm para processar o formulário
  submitForm('6LeSzBApAAAAAPjsa_dNEHVPZQzx5q4TwBgiQqTf');
}