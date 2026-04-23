class CVLYAuth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('cvly_users') || '[]');
        this.init();
    }

    init() {
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const logoutBtn = document.getElementById('logoutBtn');

        if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        if (signupForm) signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail')?.value?.trim();
        const password = document.getElementById('loginPassword')?.value;

        const user = this.users.find(u => u.email === email && u.password === password);
        if (!user) {
            this.showNotification('Invalid credentials!', 'error');
            return;
        }

        localStorage.setItem('cvly_user', JSON.stringify(user));
        this.showNotification('Welcome back! 🎉', 'success');
        setTimeout(() => { window.location.href = "cv-list.html"; }, 1000);
    }

    handleSignup(e) {
        e.preventDefault();
        const name = document.getElementById('signupName')?.value?.trim();
        const email = document.getElementById('signupEmail')?.value?.trim();
        const password = document.getElementById('signupPassword')?.value;

        if (this.users.find(u => u.email === email)) {
            this.showNotification('Email already exists!', 'error');
            return;
        }

        const user = { id: Date.now(), name, email, password };
        this.users.push(user);
        localStorage.setItem('cvly_users', JSON.stringify(this.users));
        localStorage.setItem('cvly_user', JSON.stringify(user));

        this.showNotification('Account created! 🚀', 'success');
        setTimeout(() => { window.location.href = "cv-list.html"; }, 1000);
    }

    handleLogout() {
        localStorage.removeItem('cvly_user');
        window.location.href = "login.html";
    }

    showNotification(msg, type) {
        const n = document.createElement('div');
        n.style = `position:fixed;top:20px;right:20px;padding:15px 25px;background:${type=='success'?'#10b981':'#ef4444'};color:white;border-radius:10px;z-index:9999;box-shadow:0 10px 20px rgba(0,0,0,0.1);`;
        n.innerText = msg;
        document.body.appendChild(n);
        setTimeout(() => n.remove(), 3000);
    }
}
new CVLYAuth();