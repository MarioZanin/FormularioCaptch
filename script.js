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
    var email = document.getElementById('email').value;
    var address = document.getElementById('address').value;
    var neighborhood = document.getElementById('neighborhood').value;
    var city = document.getElementById('city').value;
    var state = document.getElementById('state').value;
    var phone = document.getElementById('phone').value;
    var message = document.getElementById('message').value;

    // Codifique os dados do formulário para inclusão na URL
    var encodedName = encodeURIComponent(name);
    var encodedEmail = encodeURIComponent(email);
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
                   '&email=' + encodedEmail +
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
