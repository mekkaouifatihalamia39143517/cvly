<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.html"); 
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="css/style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My CVs - CVLY</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --primary: #2563eb; --bg: #f8fafc; --text: #1e293b; }
        body { font-family: 'Inter', sans-serif; background: var(--bg); margin: 0; color: var(--text); }
        
        .navbar { background: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .logo { font-weight: 800; color: var(--primary); font-size: 1.5rem; display: flex; align-items: center; gap: 10px; text-decoration: none; }
        
        .btn { padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; border: none; transition: 0.3s; text-decoration: none; font-size: 14px; }
        .btn-logout { background: #fee2e2; color: #ef4444; }
        .btn-logout:hover { background: #ef4444; color: white; }
        .btn-create { background: var(--primary); color: white; }
        
        .container { max-width: 1000px; margin: 40px auto; padding: 0 20px; }
        .header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }

        /* Empty State */
        .empty-state { text-align: center; padding: 60px 20px; background: white; border-radius: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.02); }
        .empty-state i { font-size: 80px; color: #cbd5e1; margin-bottom: 20px; }
        .empty-state h2 { margin: 0 0 10px 0; color: #64748b; }

        /* CV Grid */
        .cv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .cv-card { background: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; transition: 0.3s; }
        .cv-card:hover { transform: translateY(-5px); box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
        .cv-info h3 { margin: 0; font-size: 18px; color: var(--text); }
        .cv-info p { margin: 5px 0; font-size: 13px; color: #64748b; }
        
        .card-actions { display: flex; gap: 10px; margin-top: 20px; border-top: 1px solid #f1f5f9; padding-top: 15px; }
        .btn-edit { background: #eff6ff; color: var(--primary); flex: 1; text-align: center; }
        .btn-delete { background: #fff1f2; color: #e11d48; width: 40px; display: flex; align-items: center; justify-content: center; }
    </style>
</head>
<body>

    <nav class="navbar">
        <a href="index.html" class="logo"><i class="fas fa-file-signature"></i> CVLY</a>
        <div style="display: flex; gap: 15px; align-items: center;">
            <button onclick="logout()" class="btn btn-logout"><i class="fas fa-sign-out-alt"></i> Logout</button>
        </div>
    </nav>

    <div class="container">
        <div class="header-flex">
            <h1>My Resumes</h1>
            <a href="cv-builder.html" class="btn btn-create" onclick="prepareNewCV()">
                <i class="fas fa-plus"></i> Create New CV
            </a>
        </div>

        <div id="cvDisplay">
            </div>
    </div>

    <script>

async function loadCVs() {
    const cvDisplay = document.getElementById('cvDisplay');
    try {
        const res = await fetch('get_cvs.php');
        const text = await res.text();
        console.log(text);
        const data = JSON.parse(text);
        if (!data.success) {
            cvDisplay.innerHTML = "<p>Error loading CVs</p>";
            return;
        }
        if (data.cvs && data.cvs.length > 0) {
            let html = '<div class="cv-grid">';
            data.cvs.forEach((cv) => {
                html += `
                    <div class="cv-card">
                        <div class="cv-info">
                            <h3>${cv.full_name || 'Unnamed'}</h3>
                            <p><i class="fas fa-briefcase"></i> ${cv.title || ''}</p>
                            <p><i class="fas fa-calendar-alt"></i> ${cv.created_at || ''}</p>
                        </div>

                        <div class="card-actions">
                            <a href="cv-builder.html?id=${cv.id}" class="btn btn-edit">
                                <i class="fas fa-edit"></i> Edit
                            </a>
                            <button onclick="deleteCV(${cv.id})" class="btn btn-delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            cvDisplay.innerHTML = html;
        } else {
            cvDisplay.innerHTML = `
               <div class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <h2>No saved CVs</h2>
                    <p>Create your first CV now!</p>
                    <a href="cv-builder.html" class="btn btn-create">Create a new CV</a>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error:", error);
        cvDisplay.innerHTML = "<p>Error loading data</p>";
    }
}

window.onload = loadCVs;

function editCV(id) {
    window.location.href = `cv-builder.html?id=${id}`;
}

function deleteCV(id) {
    if (confirm("Are you sure you want to delete this CV?")) {
        fetch(`delete_cv.php?id=${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.success) loadCVs();
                else alert("Deletion failed");
            });
    }
}

function logout() {
    if (confirm("Do you want to log out?")) {
        window.location.href = "logout.php";
    }
}

window.onload = function() {
    loadCVs();
};
    </script>
</body>
</html>