/* ========================================
   ENHANCED FEATURES - Funcionalidades Avançadas
   ======================================== */

class EnhancedFeatures {
    constructor() {
        // Verificar se já foi inicializado
        if (window.enhancedFeatures && window.enhancedFeatures.initialized) {
            return window.enhancedFeatures;
        }
        this.initialized = true;
        this.init();
    }

    init() {
        this.initToastSystem();
        this.initBackToTop();
        this.initProgressBar();
        this.initSearchSystem();
        this.initScrollAnimations();
        this.initPerformanceOptimizations();
    }

    // Sistema de Toast Notifications
    initToastSystem() {
        this.toastContainer = document.createElement('div');
        this.toastContainer.className = 'toast-container';
        document.body.appendChild(this.toastContainer);

        // Auto-hide toasts after 4 seconds
        this.toastContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('toast-close')) {
                e.target.closest('.toast').remove();
            }
        });
    }

    showToast(message, type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle'
        };

        toast.innerHTML = `
            <i class="toast-icon ${icons[type]}"></i>
            <span>${message}</span>
            <i class="toast-close fas fa-times"></i>
        `;

        this.toastContainer.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }

    // Back to Top Button
    initBackToTop() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        backToTopBtn.setAttribute('aria-label', 'Voltar ao topo');
        document.body.appendChild(backToTopBtn);

        // Show/hide based on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        // Smooth scroll to top
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            this.showToast('Voltando ao topo...', 'info', 2000);
        });
    }

    // Progress Bar
    initProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // Sistema de Busca
    initSearchSystem() {
        // Verificar se a barra de pesquisa já existe (já está no HTML do header)
        const searchContainer = document.querySelector('.search-container');
        
        if (searchContainer) {
            // Se já existe, apenas inicializar a funcionalidade
            this.setupSearchFunctionality();
        } else {
            // Fallback: criar se não existir (para compatibilidade)
            this.createSearchBar();
        }
    }

    createSearchBar() {
        // Criar barra de busca (fallback para compatibilidade)
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <div class="search-bar">
                <i class="fas fa-search search-icon"></i>
                <input type="text" placeholder="Buscar lojas, produtos, serviços..." class="search-input">
                <button class="search-clear" style="display: none;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="search-results"></div>
        `;

        // Adicionar ao header
        const header = document.querySelector('.header-nav');
        
        if (header) {
            header.insertBefore(searchContainer, header.firstChild);
        }

        this.setupSearchFunctionality();
    }

    setupSearchFunctionality() {
        // Aguardar um pouco para garantir que o DOM esteja pronto
        setTimeout(() => {
            const searchInput = document.querySelector('.search-input');
            const searchClear = document.querySelector('.search-clear');
            const searchResults = document.querySelector('.search-results');

            if (!searchInput) return;

            // Verificar se os event listeners já foram adicionados
            if (searchInput.hasAttribute('data-search-initialized')) {
                return;
            }

            // Marcar como inicializado
            searchInput.setAttribute('data-search-initialized', 'true');

        // Dados das lojas para busca
        const storesData = [
            {
                name: 'RSX Store',
                description: 'Produtos digitais com entrega automática',
                features: ['produtos digitais', 'entrega automática', 'suporte especializado', 'preços acessíveis', 'garantia total'],
                url: '/rsx-store',
                icon: 'fas fa-store'
            },
            {
                name: 'RSX Bots',
                description: 'Bots personalizados para Discord e automação',
                features: ['bots discord', 'automação', 'aplicações personalizadas', 'integrações api', 'mensalidades'],
                url: '/rsx-bots',
                icon: 'fas fa-robot'
            },
            {
                name: 'RSX System',
                description: 'Jogos Steam, gift cards e métodos Steam',
                features: ['jogos steam', 'gift cards', 'métodos steam', 'contas steam', 'gaming'],
                url: '/rsx-system',
                icon: 'fas fa-gamepad'
            }
        ];

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length === 0) {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
                searchClear.style.display = 'none';
                return;
            }

            searchClear.style.display = 'block';

            // Buscar nas lojas
            const results = storesData.filter(store => {
                return store.name.toLowerCase().includes(query) ||
                       store.description.toLowerCase().includes(query) ||
                       store.features.some(feature => feature.toLowerCase().includes(query));
            });

            this.displaySearchResults(results, query);
        });

        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            searchClear.style.display = 'none';
        });

        // Fechar resultados ao clicar fora
        document.addEventListener('click', (e) => {
            const searchContainer = document.querySelector('.search-container');
            if (searchContainer && !searchContainer.contains(e.target)) {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
                searchClear.style.display = 'none';
                searchInput.blur();
            }
        });

        // Fechar resultados ao pressionar Escape
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
                searchClear.style.display = 'none';
                searchInput.blur();
            }
        });
        }, 100);
    }

    displaySearchResults(results, query) {
        const searchResults = document.querySelector('.search-results');
        
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    <i class="fas fa-search"></i>
                    <p>Nenhum resultado encontrado para "${query}"</p>
                </div>
            `;
            searchResults.style.display = 'block';
            return;
        }

        const resultsHTML = results.map(store => `
            <div class="search-result-item" onclick="window.location.href='${store.url}'">
                <div class="search-result-icon">
                    <i class="${store.icon}"></i>
                </div>
                <div class="search-result-content">
                    <h4>${store.name}</h4>
                </div>
                <div class="search-result-arrow">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        `).join('');

        searchResults.innerHTML = resultsHTML;
        searchResults.style.display = 'block';
    }


    // Animações de Scroll Melhoradas
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observar elementos para animação
        document.addEventListener('DOMContentLoaded', () => {
            const animatedElements = document.querySelectorAll('.product-card, .support-section, .enhanced-card');
            animatedElements.forEach(element => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(element);
            });
        });
    }

    // Otimizações de Performance
    initPerformanceOptimizations() {
        // Lazy loading para imagens
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }

        // Debounce para eventos de scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                // Executar apenas uma vez por scroll
            }, 100);
        });
    }
}

// Inicializar quando o DOM estiver pronto (será chamado pelo components.js)
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar componentes serem carregados
});

// Exportar para uso global
window.showToast = (message, type, duration) => {
    if (window.enhancedFeatures) {
        window.enhancedFeatures.showToast(message, type, duration);
    }
};
