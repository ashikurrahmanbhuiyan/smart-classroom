function selectAccount(type) {
    document.getElementById('teacher').classList.remove('active');
    document.getElementById('student').classList.remove('active');
    document.getElementById(type).classList.add('active');

    const welcomeMessage = document.getElementById('welcome-message');
    welcomeMessage.textContent = type === 'teacher' ? 'Hello Teacher. Log in' : 'Hello Student. Log in';
}

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    alert('Login successful!');
}