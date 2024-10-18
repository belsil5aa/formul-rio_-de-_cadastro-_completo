document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const cpf = document.getElementById('cpf').value;
    const birthdate = document.getElementById('birthdate').value;

    if (!validateEmail(email)) {
        displayMessage('Email inválido.', 'error');
        return;
    }

    if (!validateCPF(cpf)) {
        displayMessage('CPF inválido.', 'error');
        return;
    }

    displayMessage('Cadastro realizado com sucesso!', 'success');
});

document.getElementById('fetchAddress').addEventListener('click', function() {
    const cep = document.getElementById('address').value.replace(/\D/g, '');
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    displayMessage('CEP não encontrado.', 'error');
                } else {
                    document.getElementById('addressDetails').innerHTML = `
                        <p>Logradouro: ${data.logradouro}</p>
                        <p>Bairro: ${data.bairro}</p>
                        <p>Cidade: ${data.localidade} - ${data.uf}</p>
                    `;
                }
            })
            .catch(() => displayMessage('Erro ao buscar o CEP.', 'error'));
    } else {
        displayMessage('CEP inválido.', 'error');
    }
});

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validateCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) {
        remainder = 0;
    }
    if (remainder !== parseInt(cpf.substring(9, 10))) {
        return false;
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) {
        remainder = 0;
    }
    return remainder === parseInt(cpf.substring(10, 11));
}

function displayMessage(message, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.className = type;
}
