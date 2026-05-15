<?php
include 'connect.php';

$sql = "SELECT id, full_name, title, email FROM users_cv ORDER BY id DESC";
$result = $conn->query($sql);
?>

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>CVs control panel</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8f9fa; padding: 30px; }
        .container { max-width: 1000px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; border: 1px solid #ddd; text-align: center; }
        th { background-color: #343a40; color: white; }
        .btn { padding: 5px 10px; text-decoration: none; border-radius: 4px; color: white; font-size: 14px; }
        .btn-view { background: #007bff; }
        .btn-delete { background: #dc3545; }
        h2 { color: #333; text-align: center; }
    </style>
</head>
<body>

<div class="container">
    <h2>Saved CVs List 📑</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th> full name</th>
                <th> Job title</th>
                <th> e-mail</th>
                <th> procedures</th>
            </tr>
        </thead>
        <tbody>
            <?php while($row = $result->fetch_assoc()): ?>
            <tr>
                <td><?php echo $row['id']; ?></td>
                <td><?php echo $row['full_name']; ?></td>
                <td><?php echo $row['title']; ?></td>
                <td><?php echo $row['email']; ?></td>
                <td>
                    <a href="view_cv.php?id=<?php echo $row['id']; ?>" class="btn btn-view"> show</a>
                    <a href="delete_cv.php?id=<?php echo $row['id']; ?>" class="btn btn-delete" onclick="return confirm('Are you sure about deleting it?')">delete</a>
                </td>
                <td>
                    <a href="view_cv.php?id=<?php echo $row['id']; ?>" style="background: #007bff; color: white; padding: 5px 10px; text-decoration: none; border-radius: 3px;"> View CV</a>
    
                    <a href="delete_cv.php?id=<?php echo $row['id']; ?>" style="background: #dc3545; color: white; padding: 5px 10px; text-decoration: none; border-radius: 3px;" onclick="return confirm('Are you sure?')">delete</a>
                </td>
            </tr>
            <?php endwhile; ?>
        </tbody>
    </table>
</div>

</body>
</html>