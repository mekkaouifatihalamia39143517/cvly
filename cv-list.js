// دالة التوجيه لإنشاء CV جديد (تمسح الـ index لضمان بداية صفحة بيضاء)
function startNew() {
    localStorage.removeItem('editingIndex');
    window.location.href = 'cv-builder.html';
}

document.addEventListener('DOMContentLoaded', () => {
    loadCVs();
});

// الدالة الأساسية لجلب وعرض الـ CVs
function loadCVs() {
    const cvListContainer = document.getElementById('cvList'); // تأكدي أن id الحاوية هو cvList
    const emptyState = document.getElementById('empty-state');
    
    // جلب البيانات الحقيقية من المتصفح
    const savedCVs = JSON.parse(localStorage.getItem('myCVs')) || [];

    // تنظيف الحاوية قبل الرسم
    cvListContainer.innerHTML = "";

    if (savedCVs.length === 0) {
        if (emptyState) emptyState.style.display = 'block';
        cvListContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #64748b;">
                <i class="fas fa-folder-open" style="font-size: 48px; margin-bottom: 15px; opacity: 0.3;"></i>
                <p>No CVs found. Start by creating one!</p>
            </div>`;
    } else {
        if (emptyState) emptyState.style.display = 'none';
        
        savedCVs.forEach((cv, index) => {
            cvListContainer.innerHTML += `
                <div class="cv-card" style="background: white; padding: 20px; border-radius: 15px; border: 1px solid #e2e8f0; position: relative; transition: 0.3s;">
                    <div style="font-size: 40px; color: #2563eb; margin-bottom: 15px;">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <h3 style="margin: 0 0 5px 0; font-size: 16px; color: #1e293b;">${cv.name || 'Untitled CV'}</h3>
                    <p style="font-size: 12px; color: #94a3b8; margin: 0;">${cv.job || 'No Position'}</p>
                    <p style="font-size: 11px; color: #cbd5e1; margin-top: 10px;">Last edited: ${cv.date || 'Recently'}</p>
                    
                    <div style="margin-top: 15px; display: flex; gap: 10px;">
                        <button onclick="editCV(${index})" style="flex:1; padding: 8px; cursor:pointer; background:#f1f5f9; border:none; border-radius:8px; font-weight:600; color:#2563eb;">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button onclick="deleteCV(${index})" style="color:#ef4444; background:#fef2f2; border:none; padding: 8px 12px; border-radius:8px; cursor:pointer;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    }
}

// دالة التعديل: تحفظ الـ index وتنتقل للمحرر
function editCV(index) {
    localStorage.setItem('editingIndex', index);
    window.location.href = 'cv-builder.html';
}

// دالة الحذف: تحذف من المصفوفة وتعيد الحفظ
function deleteCV(index) {
    if (confirm("Are you sure you want to delete this CV?")) {
        let list = JSON.parse(localStorage.getItem('myCVs')) || [];
        list.splice(index, 1); // حذف العنصر
        localStorage.setItem('myCVs', JSON.stringify(list)); // حفظ القائمة الجديدة
        loadCVs(); // إعادة رسم الصفحة
    }
}

// دالة تسجيل الخروج
function logout() {
    localStorage.removeItem('cvly_user');
    window.location.href = 'index.html';
}