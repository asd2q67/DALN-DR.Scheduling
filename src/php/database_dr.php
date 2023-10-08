<?php
$dbserver = "localhost";
$dbuser = "root";
$dbpass = "";
$dbname = "daln_dr.scheduling";

if (isset($_POST['submit'])) {
	$name = $_POST['name'];
	$skill = $_POST['skill'];
	$note = $_POST['note'];

	$conn = mysqli_connect($dbserver, $dbuser, $dbpass, $dbname)
		or die("Kết nối Database không thành công");

	if ($name != "" && $skill != "" && $note != "") {

		$sql = "insert into dr_detail (name, skill, note) 
				values ('$name','$skill','$note')";
	}
	if (mysqli_query($conn, $sql))
		echo "Đã thêm chi tiết bác sĩ thành công";
	else
		echo "Thêm thất bại";
	mysqli_close($conn);
}
?>