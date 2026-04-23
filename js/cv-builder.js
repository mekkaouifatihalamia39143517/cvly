// 🔥 CVLY Builder - Complete Enhanced Version
class CVLY {
    constructor() {
        this.cvData = {
            personal: {}, experiences: [], educations: [], skills: []
        };
        this.currentTemplate = 'simple';
        this.cvStorage = new CVStorage();
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSavedCV();
        this.loadTemplate('simple');
        this.updatePreview();
        this.animateElements();
        this.checkAuth();
    }

    checkAuth() {
        const user = localStorage.getItem('cvly_user');
        if (!user) {
            window.location.href = 'login.html';
        }
    }

    bindEvents() {
        // Real-time inputs
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, textarea')) {
                this.debounce(this.updatePreview, 300)();
            }
        });

        // Template switch
        document.getElementById('templateSelect').addEventListener('change', (e) => {
            this.currentTemplate = e.target.value;
            this.loadTemplate(this.currentTemplate);
            this.autoSave();
        });

        // Action buttons
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadPDF());
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzeCV());
        document.getElementById('printBtn').addEventListener('click', () => this.printCV());

        // Dynamic add/remove
        document.getElementById('addExperience').addEventListener('click', () => this.addExperience());
        document.getElementById('addEducation').addEventListener('click', () => this.addEducation());
        document.getElementById('addSkill').addEventListener('click', () => this.addSkill());

        // Enter key for skills
        document.getElementById('skillsInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addSkill();
            }
        });

        // Remove handlers
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-experience')) {
                e.target.closest('.experience-item').remove();
                this.updatePreview();
            }
            if (e.target.classList.contains('remove-education')) {
                e.target.closest('.education-item').remove();
                this.updatePreview();
            }
            if (e.target.classList.contains('remove-skill')) {
                e.target.closest('.skill-tag').remove();
                this.updateSkills();
            }
        });

        // Auto-save every 5 seconds
        setInterval(() => this.autoSave(), 5000);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    loadSavedCV() {
        const savedCVs = this.cvStorage.getCVs();
        if (savedCVs.length > 0) {
            const latestCV = savedCVs[0];
            this.loadCVData(latestCV.data);
        }
    }

    loadCVData(data) {
        // Load personal info
        Object.keys(data.personal || {}).forEach(key => {
            const input = document.getElementById(key);
            if (input) input.value = data.personal[key];
        });

        // Load experiences
        const expContainer = document.getElementById('experiences');
        expContainer.innerHTML = '';
        (data.experiences || []).forEach(exp => this.addExperience(exp));

        // Load educations
        const eduContainer = document.getElementById('educations');
        eduContainer.innerHTML = '';
        (data.educations || []).forEach(edu => this.addEducation(edu));

        // Load skills
        const skillsList = document.getElementById('skillsList');
        skillsList.innerHTML = '';
        (data.skills || []).forEach(skill => {
            const skillTag = document.createElement('div');
            skillTag.className = 'skill-tag';
            skillTag.innerHTML = `${skill} <span class="remove-skill">&times;</span>`;
            skillsList.appendChild(skillTag);
        });
    }

    collectData() {
        this.cvData.personal = {
            fullName: document.getElementById('fullName')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            location: document.getElementById('location')?.value || '',
            linkedin: document.getElementById('linkedin')?.value || '',
            portfolio: document.getElementById('portfolio')?.value || '',
            summary: document.getElementById('summary')?.value || ''
        };

        this.cvData.experiences = Array.from(document.querySelectorAll('.experience-item')).map(item => ({
            title: item.querySelector('.jobTitle').value,
            company: item.querySelector('.company').value,
            duration: item.querySelector('.jobDuration').value,
            location: item.querySelector('.jobLocation').value,
            description: item.querySelector('.jobDescription').value
        })).filter(exp => exp.title.trim());

        this.cvData.educations = Array.from(document.querySelectorAll('.education-item')).map(item => ({
            degree: item.querySelector('.degree').value,
            school: item.querySelector('.school').value,
            duration: item.querySelector('.educationDuration').value,
            gpa: item.querySelector('.gpa').value
        })).filter(edu => edu.degree.trim());

        this.cvData.skills = Array.from(document.querySelectorAll('.skill-tag')).map(tag => 
            tag.childNodes[0].textContent.trim()
        );
    }

    updatePreview() {
        this.collectData();
        document.getElementById('cvPreview').innerHTML = this.generateCVHTML();
        this.animatePreview();
    }

    generateCVHTML() {
        const { personal, experiences, educations, skills } = this.cvData;
        return `
            <div class="cv-${this.currentTemplate}">
                <div class="cv-header">
                    <div class="cv-name">${personal.fullName || 'John Doe'}</div>
                    <div class="cv-contact">
                        ${personal.email ? `<a href="mailto:${personal.email}"><i class="fas fa-envelope"></i></a>` : ''}
                        ${personal.phone ? `<a href="tel:${personal.phone}"><i class="fas fa-phone"></i></a>` : ''}
                        ${personal.location ? `<span><i class="fas fa-map-marker-alt"></i> ${personal.location}</span>` : ''}
                        ${personal.linkedin ? `<a href="${personal.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${personal.portfolio ? `<a href="${personal.portfolio}" target="_blank"><i class="fas fa-globe"></i></a>` : ''}
                    </div>
                </div>

                ${personal.summary ? `
                    <div class="cv-section summary">
                        <h3><i class="fas fa-quote-left"></i> Summary</h3>
                        <p>${personal.summary}</p>
                    </div>
                ` : ''}

                ${experiences.length ? `
                    <div class="cv-section experience">
                        <h3><i class="fas fa-briefcase"></i> Experience</h3>
                        ${experiences.map((exp, index) => `
                            <div class="cv-item" style="animation-delay: ${index * 0.1}s">
                                <div class="cv-item-header">
                                    <h4>${exp.title}</h4>
                                    <div class="cv-meta">
                                        ${exp.company ? `<span class="cv-company">${exp.company}</span>` : ''}
                                        <span class="cv-date">${exp.duration}</span>
                                        ${exp.location ? `<span class="cv-location">${exp.location}</span>` : ''}
                                    </div>
                                </div>
                                ${exp.description ? `<p>${exp.description.replace(/\n/g, '<br>')}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                ${educations.length ? `
                    <div class="cv-section education">
                        <h3><i class="fas fa-graduation-cap"></i> Education</h3>
                        ${educations.map((edu, index) => `
                            <div class="cv-item" style="animation-delay: ${index * 0.1}s">
                                <div class="cv-item-header">
                                    <h4>${edu.degree}</h4>
                                    <div class="cv-meta">
                                        ${edu.school ? `<span class="cv-school">${edu.school}</span>` : ''}
                                        <span class="cv-date">${edu.duration}</span>
                                        ${edu.gpa ? `<span class="cv-gpa">${edu.gpa}</span>` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                ${skills.length ? `
                    <div class="cv-section skills">
                        <h3><i class="fas fa-cogs"></i> Skills</h3>
                        <div class="skills-grid">
                            ${skills.slice(0, 12).map((skill, index) => `
                                <span class="skill-pill" style="animation-delay: ${index * 0.05}s">
                                    ${skill}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    animatePreview() {
        const sections = document.querySelectorAll('#cvPreview .cv-section');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            setTimeout(() => {
                section.style.transition = 'all 0.5s ease';
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    addExperience(data = {}) {
        const container = document.getElementById('experiences');
        const div = document.createElement('div');
        div.className = 'experience-item';
        div.innerHTML = `
            <div class="form-grid">
                <input type="text" class="jobTitle" placeholder="Job Title *" value="${data.title || ''}">
                <input type="text" class="company" placeholder="Company" value="${data.company || ''}">
            </div>
            <div class="form-grid">
                <input type="text" class="jobDuration" placeholder="2020 - Present" value="${data.duration || ''}">
                <input type="text" class="jobLocation" placeholder="Location" value="${data.location || ''}">
            </div>
            <textarea class="jobDescription" placeholder="Describe your responsibilities and achievements..." rows="3">${data.description || ''}</textarea>
            <button type="button" class="remove-experience"><i class="fas fa-trash"></i> Remove</button>
        `;
        container.appendChild(div);
        this.updatePreview();
    }

    addEducation(data = {}) {
        const container = document.getElementById('educations');
        const div = document.createElement('div');
        div.className = 'education-item';
        div.innerHTML = `
            <div class="form-grid">
                <input type="text" class="degree" placeholder="Degree (BSc Computer Science)" value="${data.degree || ''}">
                <input type="text" class="school" placeholder="University/School" value="${data.school || ''}">
            </div>
            <div class="form-grid">
                <input type="text" class="educationDuration" placeholder="2016 - 2020" value="${data.duration || ''}">
                <input type="text" class="gpa" placeholder="GPA 3.8/4.0" value="${data.gpa || ''}">
            </div>
            <button type="button" class="remove-education"><i class="fas fa-trash"></i> Remove</button>
        `;
        container.appendChild(div);
        this.updatePreview();
    }

    addSkill() {
        const input = document.getElementById('skillsInput');
        const skill = input.value.trim();
        if (!skill || document.querySelectorAll('.skill-tag').length >= 20) return;

        const skillsList = document.getElementById('skillsList');
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `${skill} <span class="remove-skill">&times;</span>`;
        skillsList.appendChild(skillTag);
        input.value = '';
        this.updatePreview();
    }

    updateSkills() {
        this.collectData();
        this.updatePreview();
    }

    autoSave() {
        this.collectData();
        this.cvStorage.saveCV(this.cvData, 'Auto Save');
        console.log('💾 CV Auto-saved');
    }

    analyzeCV() {
        this.collectData();
        const modal = document.getElementById('analysisModal');
        const results = document.getElementById('analysisResults');
        
        const analysis = this.generateAnalysis();
        results.innerHTML = analysis;
        modal.style.display = 'block';
    }

    generateAnalysis() {
        const score = this.calculateScore();
        let html = `
            <div class="analysis-score">
                <div class="score-circle" style="--score: ${score}">
                    <span>${score}%</span>
                </div>
                <h3>CV Quality Score</h3>
                <p>${this.getScoreMessage(score)}</p>
            </div>
        `;

        const checks = [
            { check: !!this.cvData.personal.fullName, title: 'Full Name', type: 'good' },
            { check: this.cvData.experiences.length >= 1, title: 'Work Experience', type: 'warning' },
            { check: this.cvData.skills.length >= 5, title: '5+ Skills', type: 'warning' },
            { check: !!this.cvData.personal.summary, title: 'Summary', type: 'warning' },
            { check: this.cvData.educations.length >= 1, title: 'Education', type: 'warning' }
        ];

        checks.forEach(item => {
            const icon = item.check ? 'fa-check-circle' : 'fa-exclamation-triangle';
            const color = item.check ? '#10b981' : '#f59e0b';
            html += `
                <div class="analysis-item">
                    <i class="fas ${icon}" style="color: ${color}"></i>
                    <span>${item.title} ${item.check ? '✅' : '⚠️'}</span>
                </div>
            `;
        });

        if (score < 70) {
            html += `
                <div class="analysis-tips">
                    <h4>💡 Quick Tips:</h4>
                    <ul>
                        <li>Add your full name and contact info</li>
                        <li>Include 3-5 bullet points per job</li>
                        <li>List 8-12 relevant skills</li>
                        <li>Add a 3-sentence summary</li>
                    </ul>
                </div>
            `;
        }

        return html;
    }

    calculateScore() {
        let score = 0;
        score += !!this.cvData.personal.fullName ? 20 : 0;
        score += !!this.cvData.personal.email || !!this.cvData.personal.phone ? 10 : 0;
        score += Math.min(this.cvData.experiences.length * 15, 45);
        score += Math.min(this.cvData.educations.length * 10, 20);
        score += Math.min(this.cvData.skills.length * 3, 15);
        score += !!this.cvData.personal.summary ? 10 : 0;
        return Math.min(Math.round(score), 100);
    }

    getScoreMessage(score) {
        if (score >= 90) return "Excellent! Ready to apply!";
        if (score >= 75) return "Great job! Minor improvements needed";
        if (score >= 50) return "Good start! Add more details";
        return "Basic info added. Complete all sections";
    }

    downloadPDF() {
        this.collectData();
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Title
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text(this.cvData.personal.fullName || 'Resume', 20, 30);
        
        // Contact
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        let y = 45;
        if (this.cvData.personal.email) doc.text(`Email: ${this.cvData.personal.email}`, 20, y), y += 8;
        if (this.cvData.personal.phone) doc.text(`Phone: ${this.cvData.personal.phone}`, 20, y), y += 8;
        if (this.cvData.personal.location) doc.text(`Location: ${this.cvData.personal.location}`, 20, y), y += 8;
        
        // Experiences
        y += 10;
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('EXPERIENCE', 20, y);
        y += 10;
        
        this.cvData.experiences.forEach(exp => {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`${exp.title} - ${exp.company}`, 20, y);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            doc.text(`${exp.duration} | ${exp.location}`, 20, y + 5);
            if (exp.description) {
                const lines = doc.splitTextToSize(exp.description, 170);
                doc.text(lines, 20, y + 12);
            }
            y += 25;
        });
        
        doc.save(`${this.cvData.personal.fullName || 'resume'}.pdf`);
    }

    printCV() {
        window.print();
    }

    loadTemplate(template) {
        const preview = document.getElementById('cvPreview');
        preview.className = `cv-preview-container cv-${template}`;
    }

    animateElements() {
        document.querySelectorAll('.form-group').forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateX(-50px)';
            setTimeout(() => {
                el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateX(0)';
            }, i * 100);
        });
    }
}

// 💾 Local Storage Manager
class CVStorage {
        static saveCV(cvData, title = 'My CV') {
        const cvs = JSON.parse(localStorage.getItem('cvly_cvs') || '[]');
        const cv = {
            id: Date.now().toString(),
            title: title.substring(0, 30),
            data: cvData,
            template: cvly ? cvly.currentTemplate : 'simple',
            updatedAt: new Date().toISOString()
        };
        
        // Replace if exists or add new
        const index = cvs.findIndex(c => c.id === cv.id);
        if (index > -1) {
            cvs[index] = cv;
        } else {
            cvs.unshift(cv);
        }
        
        // Keep only last 10 CVs
        localStorage.setItem('cvly_cvs', JSON.stringify(cvs.slice(0, 10)));
        return cv;
    }

    static getCVs() {
        return JSON.parse(localStorage.getItem('cvly_cvs') || '[]')
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    static getCV(id) {
        return this.getCVs().find(cv => cv.id === id);
    }

    static deleteCV(id) {
        const cvs = this.getCVs().filter(cv => cv.id !== id);
        localStorage.setItem('cvly_cvs', JSON.stringify(cvs));
    }
}

// 🚀 Initialize
let cvly;
document.addEventListener('DOMContentLoaded', () => {
    cvly = new CVLY();
    
    // Modal handlers
    document.getElementById('analysisModal').addEventListener('click', (e) => {
        if (e.target.id === 'analysisModal') e.target.style.display = 'none';
    });
    
    // Print styles
    const style = document.createElement('style');
    style.textContent = `
        @media print {
            body * { visibility: hidden; }
            #cvPreview, #cvPreview * { visibility: visible; }
            #cvPreview { position: absolute; left: 0; top: 0; width: 100%; }
            .builder-header, .form-section { display: none !important; }
        }
        .analysis-score { text-align: center; margin-bottom: 30px; }
        .score-circle {
            width: 120px; height: 120px; border-radius: 50%;
            background: conic-gradient(#10b981 var(--score, 0), #e5e7eb var(--score, 0) 360deg);
            margin: 0 auto 20px; display: flex; align-items: center;
            justify-content: center; font-size: 2rem; font-weight: bold;
            color: #10b981; position: relative;
        }
        .score-circle::before {
            content: ''; position: absolute; width: 90px; height: 90px;
            background: white; border-radius: 50%;
        }
        .analysis-item { display: flex; align-items: center; gap: 16px; padding: 16px; margin: 8px 0; border-radius: 12px; background: #f8fafc; }
        .analysis-tips ul { margin-top: 12px; padding-right: 20px; }
        .analysis-tips li { margin: 6px 0; color: #64748b; }
    `;
    document.head.appendChild(style);
});