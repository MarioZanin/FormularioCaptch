function submitForm() {
    var name = document.getElementById('name').value;
    var address = document.getElementById('address').value;
    var neighborhood = document.getElementById('neighborhood').value;
    var city = document.getElementById('city').value;
    var state = document.getElementById('state').value;
    var phone = document.getElementById('phone').value;
    var message = document.getElementById('message').value;
  
    var result = "Nome: " + name + "<br>" +
                 "Endereço: " + address + "<br>" +
                 "Bairro: " + neighborhood + "<br>" +
                 "Cidade: " + city + "<br>" +
                 "Estado: " + state + "<br>" +
                 "Telefone: " + phone + "<br>" +
                 "Mensagem: " + message;
  
    var newPage = window.open('');
    newPage.document.write(result);
  }
  