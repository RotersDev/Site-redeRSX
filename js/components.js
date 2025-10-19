/* ========================================
   COMPONENT LOADER - Sistema de Componentes
   ======================================== */

class ComponentLoader {
    constructor() {
        this.basePath = this.getBasePath();
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
        const headerHtml = await this.loadComponent('header');
        const headerElement = document.getElementById('header-placeholder');
        if (headerElement && headerHtml) {
            headerElement.innerHTML = headerHtml;
            this.initializeHeaderEvents();
        }
    }

    async loadFooter() {
        const footerHtml = await this.loadComponent('footer');
        const footerElement = document.getElementById('footer-placeholder');
        if (footerElement && footerHtml) {
            footerElement.innerHTML = footerHtml;
            this.initializeFooterAnimations();
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
        }, 300);
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    const loader = new ComponentLoader();
    loader.loadAllComponents();
});
