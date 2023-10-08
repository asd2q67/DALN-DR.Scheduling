<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Thêm bác sĩ</title>
</head>

<body>
	<?php require("database_dr.php") ?>
	<?php require("condb.php") ?>
	<h1>Thêm chi tiết bác sĩ</h1>
	<?php
	if (isset($_POST["add"])) {
		$name = $_POST['name'];
		$skill = $_POST['skill'];
		$note = $_POST['note'];

		if ($name == "") {
			echo "Vui lòng nhập tên bác sĩ <br/>";
		}
		if ($skill == "") {
			echo "Vui lòng miêu tả năng lực của bác sĩ <br/>";
		}
	}

	?>
	<form method="POST" action="">
		<label for="name">Tên bác sĩ: </label>
		<input type="varchar" id="name" <?php ?> name="name"><br><br>

		<label for="skill">Năng lực:</label>
		<input type="text" id="skill" name="skill"><br><br>

		<label for="note">Ghi chú:</label>
		<input type="text" id="note" name="note"><br><br>


		<input type="submit" name="submit" value="Thêm mới">
	</form>
</body>

</html>