/* ========================================
   COMPONENT LOADER - Sistema de Componentes
   ======================================== */

class ComponentLoader {
    constructor() {
        this.basePath = this.getBasePath();
        this.version = '1.1.0'; // Versão dos componentes (atualizada para incluir search bar no HTML)
    }

    getBasePath() {
        // Determina o caminho base baseado na estrutura de pastas
        const path = window.location.pathname;
        if (path.includes('/rsx-store/') || path.includes('/rsx-bots/') || path.includes('/rsx-system/') || 
            path.includes('/contato/') || path.includes('/termos/') || path.includes('/politica/')) {
            return '../../';
        }
        return './';
    }

    async loadComponent(componentName) {
        try {
            const response = await fetch(`${this.basePath}components/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`Erro ao carregar componente: ${componentName}`);
            }
            return await response.text();
        } catch (error) {
            console.error(`Erro ao carregar ${componentName}:`, error);
            return '';
        }
    }

    async loadHeader() {
        // Verificar se o header já foi carregado e está no localStorage
        const cachedVersion = localStorage.getItem('rsx_components_version');
        const cachedHeader = localStorage.getItem('rsx_header_html');
        const headerElement = document.getElementById('header-placeholder');
        
        if (headerElement) {
            // Se temos header em cache e a versão está atualizada, usar ele
            if (cachedHeader && cachedVersion === this.version) {
                headerElement.innerHTML = cachedHeader;
                this.initializeHeaderEvents();
                return;
            }
            
            // Senão, carregar do servidor e cachear
            const headerHtml = await this.loadComponent('header');
            if (headerHtml) {
                headerElement.innerHTML = headerHtml;
                localStorage.setItem('rsx_header_html', headerHtml);
                localStorage.setItem('rsx_components_version', this.version);
                this.initializeHeaderEvents();
            }
        }
    }

    async loadFooter() {
        // Verificar se o footer já foi carregado e está no localStorage
        const cachedVersion = localStorage.getItem('rsx_components_version');
        const cachedFooter = localStorage.getItem('rsx_footer_html');
        const footerElement = document.getElementById('footer-placeholder');
        
        if (footerElement) {
            // Se temos footer em cache e a versão está atualizada, usar ele
            if (cachedFooter && cachedVersion === this.version) {
                footerElement.innerHTML = cachedFooter;
                this.initializeFooterAnimations();
                return;
            }
            
            // Senão, carregar do servidor e cachear
            const footerHtml = await this.loadComponent('footer');
            if (footerHtml) {
                footerElement.innerHTML = footerHtml;
                localStorage.setItem('rsx_footer_html', footerHtml);
                localStorage.setItem('rsx_components_version', this.version);
                this.initializeFooterAnimations();
            }
        }
    }

    initializeFooterAnimations() {
        // Scroll reveal animation para o footer
        const footer = document.getElementById('footer');
        if (footer) {
            const footerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            footerObserver.observe(footer);
        }
    }

    initializeHeaderEvents() {
        // Reinicializar eventos do header após carregamento
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');
        
        if (mobileMenuToggle && mobileNav) {
            mobileMenuToggle.addEventListener('click', () => {
                mobileMenuToggle.classList.toggle('active');
                mobileNav.classList.toggle('active');
            });
            
            // Fechar menu ao clicar em um link
            const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenuToggle.classList.remove('active');
                    mobileNav.classList.remove('active');
                });
            });
            
            // Fechar menu ao clicar fora
            document.addEventListener('click', (e) => {
                if (!mobileMenuToggle.contains(e.target) && !mobileNav.contains(e.target)) {
                    mobileMenuToggle.classList.remove('active');
                    mobileNav.classList.remove('active');
                }
            });
        }
    }

    async loadAllComponents() {
        await Promise.all([
            this.loadHeader(),
            this.loadFooter()
        ]);
        
        // Inicializar Enhanced Features após carregar os componentes
        setTimeout(() => {
            if (!window.enhancedFeatures) {
                window.enhancedFeatures = new EnhancedFeatures();
            }
            // Sempre tentar reinicializar a busca para garantir que funcione
            if (window.enhancedFeatures && typeof window.enhancedFeatures.setupSearchFunctionality === 'function') {
                window.enhancedFeatures.setupSearchFunctionality();
            }
        }, 300);
    }

    // Função para limpar cache (útil para desenvolvimento)
    clearCache() {
        localStorage.removeItem('rsx_header_html');
        localStorage.removeItem('rsx_footer_html');
        console.log('Cache dos componentes limpo');
    }

    // Função para forçar reload dos componentes
    async forceReloadComponents() {
        this.clearCache();
        await this.loadAllComponents();
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    window.componentLoader = new ComponentLoader();
    window.componentLoader.loadAllComponents();
});

// Funções globais para gerenciamento de cache
window.clearComponentsCache = function() {
    if (window.componentLoader) {
        window.componentLoader.clearCache();
    }
};

window.reloadComponents = function() {
    if (window.componentLoader) {
        window.componentLoader.forceReloadComponents();
    }
};
