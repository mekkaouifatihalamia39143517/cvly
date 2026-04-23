//  Multi-Language System
const translations = {
    en: {
        title: 'CVLY - Create Professional Resumes',
        heroTitle: 'Create Your Professional CV in Minutes',
        heroSubtitle: 'No Word or Canva needed - Everything in one place!',
        heroStatsUsers: '50K+ Users',
        heroStatsCVs: '100K+ CVs',
        startBuilding: 'Start Building Now',
        seeFeatures: 'See Features',
        whyChoose: 'Why Choose CV Builder?',
        whySubtitle: 'Everything you need to create a perfect resume',
        livePreview: 'Live Preview',
        pdfExport: 'PDF Export',
        templates: '10+ Templates',
        aiAnalysis: 'AI Analysis',
        cloudSave: 'Cloud Save',
        multiLanguage: 'Multi-Language',
        professionalTemplates: 'Professional Templates',
        professionalSubtitle: 'Choose your perfect style',
        simple: 'Simple',
        simpleDesc: 'Clean and minimal design',
        modern: 'Modern',
        modernDesc: 'Trendy and stylish',
        professional: 'Professional',
        professionalDesc: 'Corporate ready design',
        readyToCreate: 'Ready to Create Your Dream CV?',
        startFree: 'Start Free - No Credit Card',
        footer: '© 2024 CV Builder. All rights reserved.',
        login: 'Login',
        signup: 'Sign Up',
        english: 'English',
        arabic: 'العربية',
        french: 'Français'
    },
    ar: {
        title: 'CVLY - إنشاء سير ذاتية احترافية',
        heroTitle: 'أنشئ سيرتك الذاتية الاحترافية في دقائق',
        heroSubtitle: 'لا حاجة لـ Word أو Canva - كل شيء في مكان واحد!',
        heroStatsUsers: '50 ألف+ مستخدم',
        heroStatsCVs: '100 ألف+ سيرة ذاتية',
        startBuilding: 'ابدأ الآن',
        seeFeatures: 'عرض المميزات',
        whyChoose: 'لماذا CV Builder؟',
        whySubtitle: 'كل ما تحتاجه لإنشاء سيرة ذاتية مثالية',
        livePreview: 'معاينة مباشرة',
        pdfExport: 'تصدير PDF',
        templates: '10+ قالب',
        aiAnalysis: 'تحليل ذكي',
        cloudSave: 'حفظ سحابي',
        multiLanguage: 'متعدد اللغات',
        professionalTemplates: 'قوالب احترافية',
        professionalSubtitle: 'اختر الأنسب لك',
        simple: 'بسيط',
        simpleDesc: 'تصميم نظيف وبسيط',
        modern: 'عصري',
        modernDesc: 'مواكب للموضة',
        professional: 'احترافي',
        professionalDesc: 'جاهز للشركات',
        readyToCreate: 'هل أنت جاهز لإنشاء سيرتك المثالية؟',
        startFree: 'ابدأ مجاناً - بدون بطاقة ائتمان',
        footer: '© 2024 CV Builder. جميع الحقوق محفوظة.',
        login: 'تسجيل الدخول',
        signup: 'إنشاء حساب',
        english: 'English',
        arabic: 'العربية',
        french: 'Français'
    }
};

let currentLang = 'en';

//  Main Language Switcher Function
function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    
    // Update all text content
    const texts = translations[lang];
    
    document.title = texts.title;
    document.querySelector('.hero-content h1').textContent = texts.heroTitle;
    document.querySelector('.hero-subtitle').textContent = texts.heroSubtitle;
    document.querySelector('.hero-stats span:nth-child(1)').innerHTML = `<i class="fas fa-users"></i> ${texts.heroStatsUsers}`;
    document.querySelector('.hero-stats span:nth-child(2)').innerHTML = `<i class="fas fa-file-pdf"></i> ${texts.heroStatsCVs}`;
    document.querySelector('.btn-primary').innerHTML = `<i class="fas fa-rocket"></i> ${texts.startBuilding}`;
    document.querySelector('.btn-secondary').innerHTML = `<i class="fas fa-star"></i> ${texts.seeFeatures}`;
    document.querySelector('.section-header h2').textContent = texts.whyChoose;
    document.querySelector('.section-header p').textContent = texts.whySubtitle;
    
    // Features
    const featureTitles = ['livePreview', 'pdfExport', 'templates', 'aiAnalysis', 'cloudSave', 'multiLanguage'];
    const featureCards = document.querySelectorAll('.feature-card h3');
    featureCards.forEach((card, index) => {
        card.textContent = texts[featureTitles[index]];
    });
    
    // Templates
    document.querySelector('.templates-preview .section-header h2').textContent = texts.professionalTemplates;
    document.querySelector('.templates-preview .section-header p').textContent = texts.professionalSubtitle;
    document.querySelector('.simple h3').textContent = texts.simple;
    document.querySelector('.simple p').textContent = texts.simpleDesc;
    document.querySelector('.modern h3').textContent = texts.modern;
    document.querySelector('.modern p').textContent = texts.modernDesc;
    document.querySelector('.professional h3').textContent = texts.professional;
    document.querySelector('.professional p').textContent = texts.professionalDesc;
    
    document.querySelector('.cta h2').textContent = texts.readyToCreate;
    document.querySelector('.btn-large').innerHTML = texts.startFree;
    document.querySelector('.footer-bottom p').textContent = texts.footer;
    document.querySelector('.btn-login').innerHTML = `<i class="fas fa-sign-in-alt"></i> ${texts.login}`;
    document.querySelector('.btn-signup').innerHTML = `<i class="fas fa-user-plus"></i> ${texts.signup}`;
    
    // Update language selector
    const select = document.getElementById('languageSelect');
    Array.from(select.options).forEach(option => {
        if (option.value === 'en') option.textContent = texts.english;
        if (option.value === 'ar') option.textContent = texts.arabic;
        if (option.value === 'fr') option.textContent = texts.french;
    });
    select.value = lang;
}

//  Initialize App
document.addEventListener('DOMContentLoaded', function() {
    // Language setup
    const langSelect = document.getElementById('languageSelect');
    langSelect.addEventListener('change', function() {
        setLanguage(this.value);
    });
    setLanguage('en');
    
    //  Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe all feature cards and template cards
    document.querySelectorAll('.feature-card, .template-card').forEach(card => {
        observer.observe(card);
    });
    
    //  Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    //  Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });
    
    //  Parallax effect for hero image
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroImage = document.querySelector('.cv-mockup');
        if (heroImage) {
            heroImage.style.transform = `perspective(1000px) rotateX(5deg) translateY(${scrolled * 0.3}px)`;
        }
    });
    
    //  Loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

//  Add some interactive hover effects
document.addEventListener('DOMContentLoaded', () => {
    // Template cards hover
    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-16px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Stats counter animation (fake for demo)
    const stats = document.querySelectorAll('.hero-stats span');
    const animateStats = () => {
        stats.forEach(stat => {
            const count = stat.textContent.match(/\d+/g);
            if (count) {
                // Simple animation effect
                stat.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    stat.style.transform = 'scale(1)';
                }, 200);
            }
        });
    };
    
    document.querySelector('.hero').addEventListener('mouseenter', animateStats);
});