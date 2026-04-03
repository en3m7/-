window.addEventListener('beforeunload', function() {
    sessionStorage.setItem('scrollPosition', window.scrollY);
});

window.addEventListener('load', function() {
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition) {
        setTimeout(() => {
            window.scrollTo({
                top: parseInt(savedPosition),
                behavior: 'instant'
            });
            sessionStorage.removeItem('scrollPosition');
        }, 100);
    }
});

document.documentElement.classList.add('preload');


const STORAGE_USERS = 'cosmic_users';
const STORAGE_CURRENT_USER = 'cosmic_current_user';
const STORAGE_ORDERS = 'cosmic_orders';

function initUsersStorage() {
    if (!localStorage.getItem(STORAGE_USERS)) {
        localStorage.setItem(STORAGE_USERS, JSON.stringify([]));
    }
}

function getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_USERS)) || [];
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
}

function registerUser(name, email, password) {
    const users = getUsers();
    
    if (users.some(user => user.email === email)) {
        showAlert('Пользователь с таким email уже существует', 'error');
        return false;
    }
    
    users.push({ name, email, password });
    saveUsers(users);
    
    loginUser(email, password);
    
    showAlert('Регистрация прошла успешно!', 'success');
    return true;
}

function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        const currentUser = { name: user.name, email: user.email };
        localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(currentUser));
        updateAuthUI();
        showAlert(`С возвращением, ${user.name}!`, 'success');
        return true;
    } else {
        showAlert('Неверный email или пароль', 'error');
        return false;
    }
}

function logoutUser() {
    localStorage.removeItem(STORAGE_CURRENT_USER);
    updateAuthUI();
    showAlert('Вы вышли из аккаунта', 'success');
}

function getCurrentUser() {
    const userJson = localStorage.getItem(STORAGE_CURRENT_USER);
    return userJson ? JSON.parse(userJson) : null;
}

function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userGreeting = document.getElementById('userGreeting');
    const greetingText = document.getElementById('greetingText');
    const profileLink = document.getElementById('profileLink');
    
    if (!authButtons || !userGreeting || !greetingText) return;
    
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        authButtons.style.display = 'none';
        userGreeting.style.display = 'flex';
        greetingText.textContent = `Привет, ${currentUser.name}!`;
        if (profileLink) profileLink.style.display = 'inline-block';
    } else {
        authButtons.style.display = 'block';
        userGreeting.style.display = 'none';
        if (profileLink) profileLink.style.display = 'none';
    }
}

function checkAuthStatus() {
    initUsersStorage();
    updateAuthUI();
}


function getOrders() {
    return JSON.parse(localStorage.getItem(STORAGE_ORDERS)) || [];
}

function saveOrder(orderData) {
    const orders = getOrders();
    const currentUser = getCurrentUser();
    const newOrder = {
        ...orderData,
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        userEmail: currentUser ? currentUser.email : 'guest'
    };
    orders.push(newOrder);
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
    return newOrder;
}


function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function saveTheme(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    
    const icon = toggle.querySelector('i');
    const text = toggle.querySelector('span');
    
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        text.textContent = 'Светлая';
    } else {
        icon.className = 'fas fa-moon';
        text.textContent = 'Темная';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    saveTheme(newTheme);
}


function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;
    
    const speed = 200;
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                let count = 0;
                
                const updateCounter = () => {
                    const increment = target / speed;
                    if (count < target) {
                        count += increment;
                        counter.innerText = Math.ceil(count);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => counterObserver.observe(counter));
}


const characters = [
    { 
        name: 'Космонавт', 
        image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400', 
        category: 'Космос' 
    },
    { 
        name: 'Пират', 
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400', 
        category: 'Приключения' 
    },
    { 
        name: 'Коржик', 
        image: 'https://images.pexels.com/photos/3717153/pexels-photo-3717153.jpeg?auto=compress&cs=tinysrgb&w=400', 
        category: 'Три кота' 
    },
    { 
        name: 'Человек-паук', 
        image: 'https://images.pexels.com/photos/2759772/pexels-photo-2759772.jpeg?auto=compress&cs=tinysrgb&w=400', 
        category: 'Супергерои' 
    },
    { 
        name: 'Надувной медведь', 
        image: 'https://images.pexels.com/photos/5876695/pexels-photo-5876695.jpeg?auto=compress&cs=tinysrgb&w=400', 
        category: 'Ростовые куклы' 
    },
    { 
        name: 'Инопланетянин', 
        image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400', 
        category: 'Космос' 
    },
    { 
        name: 'Робот', 
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400', 
        category: 'Фантастика' 
    },
    { 
        name: 'Звездочёт', 
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', 
        category: 'Сказки' 
    }
];

let currentPage = 0;
const itemsPerPage = 4;

function loadCharacters(page) {
    const grid = document.getElementById('character-grid');
    if (!grid) return;
    
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    const items = characters.slice(start, end);

    items.forEach(char => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-3';
        col.setAttribute('data-aos', 'fade-up');
        col.setAttribute('data-aos-delay', '100');
        
        col.innerHTML = `
            <div class="character-card">
                <img src="${char.image}" alt="${char.name}" 
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/400x600?text=${encodeURIComponent(char.name)}+${encodeURIComponent(char.category)}'"
                     loading="lazy">
                <div class="character-info">
                    <h5 class="mb-1">${char.name}</h5>
                    <p class="mb-0 small">${char.category}</p>
                </div>
            </div>
        `;
        grid.appendChild(col);
    });

    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        if (end >= characters.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
        }
    }
}


function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'cosmic-alert';
    
    if (type === 'success') {
        alertDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h4>Спасибо!</h4>
            <p>${message}</p>
        `;
    } else {
        alertDiv.style.background = 'linear-gradient(135deg, #ff6b6b, #ff8e8e)';
        alertDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <h4>Ошибка</h4>
            <p>${message}</p>
        `;
    }
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 300);
    }, type === 'success' ? 3000 : 2000);
}


window.addEventListener('load', function() {
    console.log('Космические праздники: загрузка завершена');
    
    checkAuthStatus();
    
    loadTheme();
    
    setTimeout(() => {
        document.documentElement.classList.remove('preload');
        document.documentElement.classList.add('loaded');
    }, 50);
    
    if (typeof AOS !== 'undefined') {
        setTimeout(() => {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100,
                delay: 50,
                disable: false,
                startEvent: 'load',
                throttleDelay: 99,
                mirror: false
            });
            
            setTimeout(() => {
                AOS.refresh();
            }, 100);
        }, 100);
    }
    
    initCounters();
    
    loadCharacters(currentPage);
    
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            currentPage++;
            loadCharacters(currentPage);
            if (typeof AOS !== 'undefined') {
                setTimeout(() => AOS.refresh(), 100);
            }
        });
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value;
            const confirm = document.getElementById('registerConfirmPassword').value;
            
            if (!name || !email || !password) {
                showAlert('Заполните все поля', 'error');
                return;
            }
            
            if (password !== confirm) {
                showAlert('Пароли не совпадают', 'error');
                return;
            }
            
            if (password.length < 6) {
                showAlert('Пароль должен быть не менее 6 символов', 'error');
                return;
            }
            
            if (registerUser(name, email, password)) {
                const modalElement = document.getElementById('registerModal');
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) modal.hide();
                
                registerForm.reset();
            }
        });
    }
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                showAlert('Введите email и пароль', 'error');
                return;
            }
            
            if (loginUser(email, password)) {
                const modalElement = document.getElementById('loginModal');
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) modal.hide();
                
                loginForm.reset();
            }
        });
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
    
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navLinks && navbarCollapse) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        const phoneInput = orderForm.querySelector('input[type="tel"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                let x = e.target.value.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
                e.target.value = !x[2] ? x[1] : '+7 (' + x[2] + ') ' + x[3] + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
            });
        }
        
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]');
            const phone = this.querySelector('input[type="tel"]');
            const email = this.querySelector('input[type="email"]');
            const date = this.querySelector('input[type="date"]');
            const service = this.querySelector('select');
            const children = this.querySelector('input[type="number"]');
            const comments = this.querySelector('textarea');
            
            if (!name.value.trim()) {
                showAlert('Введите имя', 'error');
                name.focus();
                return;
            }
            
            const phoneDigits = phone.value.replace(/\D/g, '');
            if (phoneDigits.length < 11) {
                showAlert('Введите корректный телефон', 'error');
                phone.focus();
                return;
            }
            
            const orderData = {
                name: name.value.trim(),
                phone: phone.value.trim(),
                email: email.value.trim(),
                date: date.value,
                service: service.value,
                children: children.value,
                comments: comments.value.trim()
            };
            
            saveOrder(orderData);
            
            const modalElement = document.getElementById('orderModal');
            if (modalElement && typeof bootstrap !== 'undefined') {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) modal.hide();
            }
            
            showAlert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
            this.reset();
        });
    }
    
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 5px 30px var(--shadow-color)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.boxShadow = '0 2px 20px var(--shadow-color)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        });
    }
    
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
        const scrollY = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${sectionId}`) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    window.addEventListener('load', updateActiveNav);
    
    document.addEventListener('copy', function(e) {
        e.clipboardData.setData('text/plain', 'Закажите космический праздник - будет весело! Сайт: космические-праздники.рф');
        e.preventDefault();
    });
    
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.loading = 'lazy';
        });
    }
});