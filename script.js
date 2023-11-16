// Carregar a chave do site reCAPTCHA do JSON (substitua com a sua chave)
var recaptchaSiteKey;
var xhrConfig = new XMLHttpRequest();
xhrConfig.onreadystatechange = function() {
  if (xhrConfig.readyState === XMLHttpRequest.DONE) {
    if (xhrConfig.status === 200) {
      var config = JSON.parse(xhrConfig.responseText);
      recaptchaSiteKey = config.recaptcha.siteKey;
    } else {
      console.error('Erro ao carregar as configurações.');
    }
  }
};

xhrConfig.open('GET', 'config.json', false);
xhrConfig.send();

// Função chamada pelo reCAPTCHA após a verificação bem-sucedida
function onClick(event) {
  event.preventDefault();

  // Execute o reCAPTCHA
  grecaptcha.execute(recaptchaSiteKey, { action: 'submit' }).then(function(token) {
    // Obtenha os dados do formulário
    var name = document.getElementById('name').value;
    var address = document.getElementById('address').value;
    var neighborhood = document.getElementById('neighborhood').value;
    var city = document.getElementById('city').value;
    var state = document.getElementById('state').value;
    var phone = document.getElementById('phone').value;
    var message = document.getElementById('message').value;

    // Codifique os dados do formulário para inclusão na URL
    var encodedName = encodeURIComponent(name);
    var encodedAddress = encodeURIComponent(address);
    var encodedNeighborhood = encodeURIComponent(neighborhood);
    var encodedCity = encodeURIComponent(city);
    var encodedState = encodeURIComponent(state);
    var encodedPhone = encodeURIComponent(phone);
    var encodedMessage = encodeURIComponent(message);

    // Crie a URL da página simulada de processamento
    var simulatedUrl = 'processar-formulario.html';

    // Adicione os parâmetros à URL
    simulatedUrl += '?name=' + encodedName +
                   '&address=' + encodedAddress +
                   '&neighborhood=' + encodedNeighborhood +
                   '&city=' + encodedCity +
                   '&state=' + encodedState +
                   '&phone=' + encodedPhone +
                   '&message=' + encodedMessage +
                   '&recaptchaToken=' + token;

    // Redirecione para a página simulada
    window.location.href = simulatedUrl;
  });
}




function submitForm(siteKey) {
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
  submitForm(siteKey);
}