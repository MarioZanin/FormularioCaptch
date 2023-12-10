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
async function onClick(event) {
  event.preventDefault();

  // Execute o reCAPTCHA
  const recaptchaToken = await grecaptcha.execute(recaptchaSiteKey, { action: 'submit' });

 // Obtenha os dados do formulário
 const name = document.getElementById('name').value;
 const email = document.getElementById('email').value;
 const address = document.getElementById('address').value;
 const neighborhood = document.getElementById('neighborhood').value;
 const city = document.getElementById('city').value;
 const state = document.getElementById('state').value;
 const phone = document.getElementById('phone').value;
 const message = document.getElementById('message').value;

 // Codifique os dados do formulário para inclusão na URL
 const encodedName = encodeURIComponent(name);
 const encodedEmail = encodeURIComponent(email);
 const encodedAddress = encodeURIComponent(address);
 const encodedNeighborhood = encodeURIComponent(neighborhood);
 const encodedCity = encodeURIComponent(city);
 const encodedState = encodeURIComponent(state);
 const encodedPhone = encodeURIComponent(phone);
 const encodedMessage = encodeURIComponent(message);

   // Crie a URL da página simulada de confirmação
  const confirmationUrl = ` https://mariozanin.github.io/FormularioCaptch/confirmar?name=${encodedName}&email=${encodedEmail}&address=${encodedAddress}&neighborhood=${encodedNeighborhood}&city=${encodedCity}&state=${encodedState}&phone=${encodedPhone}&message=${encodedMessage}&recaptchaToken=${recaptchaToken}`;
 

   // Redirecione para a página de confirmação
  window.location.href = confirmationUrl;
}