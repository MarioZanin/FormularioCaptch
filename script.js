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
    //grecaptcha.ready(function() {
    //grecaptcha.execute('siteKey', {action: 'submit'}).then(function(token) {
    
    // Substitua 'reCAPTCHA_site_key' pela sua chave do site reCAPTCHA
    //var siteKey = '6LeSzBApAAAAAPjsa_dNEHVPZQzx5q4TwBgiQqTf';
  
    // Chame a função submitForm para processar o formulário
    //submitForm(siteKey);
   

  // Execute o reCAPTCHA
  grecaptcha.ready(function() {
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
  })};
}