<?php
include 'connect.php';

$id = isset($_GET['id']) ? $_GET['id'] : 0;

if ($id > 0) {
    $sql = "SELECT * FROM users_cv WHERE id = $id";
} else {
    $sql = "SELECT * FROM users_cv ORDER BY id DESC LIMIT 1";
}

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
} else {
    die("There is no data to display.");
}
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title> عرض السيرة الذاتية- <?php echo $user['full_name']; ?></title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f4f4; padding: 50px; }
        .cv-card { background: white; max-width: 800px; margin: auto; padding: 30px; border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.1); position: relative; }
        h1 { color: #2c3e50; border-bottom: 3px solid #28a745; padding-bottom: 10px; margin-top: 0; }
        .info { margin-bottom: 20px; line-height: 1.6; }
        .info label { font-weight: bold; color: #28a745; display: block; margin-bottom: 5px; }
        .img-profile { width: 140px; height: 140px; border-radius: 10px; object-fit: cover; float: left; border: 2px solid #ddd; }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f9f9f9; padding: 15px; border-radius: 5px; }
        .section-title { background: #28a745; color: white; padding: 5px 15px; display: inline-block; border-radius: 20px; margin-top: 20px; }
        @media print { .no-print { display: none; } }
    </style>
</head>
<body>
    
<div class="no-print" style="position: fixed; top: 20px; left: 20px; z-index: 999;">
    <button onclick="translateCV()" style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 30px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
        🌐 Translate to EN/AR
    </button>
</div>
<div class="cv-card">
    <?php if(!empty($user['image'])): ?>
        <img src="uploads/<?php echo $user['image']; ?>" class="img-profile">
    <?php else: ?>
        <div class="img-profile" style="background:#eee; display:flex; align-items:center; justify-content:center; color:#999"> No image</div>
    <?php endif; ?>

    <h1><?php echo $user['full_name']; ?></h1>
    <p style="font-size: 1.2em; color: #555;"><?php echo $user['title']; ?></p>

    <div class="contact-grid">
        <div><strong>📧 البريد الإلكتروني:</strong> <?php echo $user['email']; ?></div>
        <div><strong>📞 الهاتف:</strong> <?php echo $user['phone']; ?></div>
        <div><strong>📍 الموقع:</strong> <?php echo $user['location']; ?></div>
    </div>

    <h3 class="section-title">  الملخص المهني</h3>
    <p class="info"><?php echo $user['summary']; ?></p>

    <h3 class="section-title">المهارات</h3>
    <p class="info"><?php echo $user['skills']; ?></p>

    <h3 class="section-title"> الخبرة العملية</h3>
    <p class="info"><?php echo $user['experience']; ?></p>

    <div style="margin-top: 30px;" class="no-print">
        <button onclick="window.print()" style="background:#28a745; color:white; padding:10px 25px; border:none; border-radius:5px; cursor:pointer; font-weight:bold;">📄تحميل كـ PDF</button>
        <a href="dashboard.php" style="margin-right:10px; text-decoration:none; color:#666;">⬅ Return to Control Panel</a>
    </div>
</div>
<div style="margin-top: 30px; text-align: center;" class="no-print">
    <button onclick="window.print()" style="background:#28a745; color:white; padding:12px 30px; border:none; border-radius:5px; cursor:pointer; font-weight:bold; font-size:16px;">
        📄تحميل كـ PDF (open print window)
    </button>
    <a href="dashboard.php" style="margin-left:15px; text-decoration:none; color:#666; font-size:14px;">⬅ Return to Control Panel</a>
</div>

<style>
    @media print {
        .no-print {
            display: none !important;
        }
        body {
            background: white;
            padding: 0;
        }
        .cv-card {
            box-shadow: none;
            border: none;
            margin: 0;
            width: 100%;
        }
    }
</style>

<script>
function translateCV() {
    const btn = document.getElementById('btnTrans');
    
    const translations = {
        " الملخص المهني": "Professional Summary",
        "المهارات": "Skills",
        "الخبرة العملية": "Work Experience",
        " البريد الإلكتروني:": "Email Address:",
        "الهاتف:": "Phone Number:",
        "الموقع:": "Location:",
        " عرض السيرة الذاتية": "View Curriculum Vitae",
        " تحميل كـ PDF": "Download as PDF"
    };

    let content = document.body.innerHTML;

    if (document.body.dir === "rtl" || document.body.dir === "") {
        for (let [ar, en] of Object.entries(translations)) {
            content = content.split(ar).join(en); 
        }
        document.body.innerHTML = content;
        document.body.dir = "ltr";
        document.body.style.fontFamily = "Arial, sans-serif";
    } else {
        location.reload();
    }
}
</script>

</body>
</html>