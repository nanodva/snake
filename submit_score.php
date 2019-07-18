<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
	<title>Snake</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<style>
		* {
			box-sizing: border-box;
			background-color: none;
			color: white;
			padding: 0;
			margin: 0;
			border: none;
		}
		body {
			color: white;
		}
	</style>
</head>

<body>
<?php
	$servername = "localhost";
	$username = "root";
	$password = "";
	$database = "score_db";
	$table = "score";

	$fmt="%s: %s</br>";
	$name=$_POST["name"];
	$score=$_POST["score"];
	// printf($fmt, "name", $_POST["name"]);
	printf($fmt, "name", "$name");
	printf($fmt, "score", "$score");

	echo "</br><b>opening database..</b></br>";
	$conn = new mysqli($servername, $username, $password, $database);
	if (mysqli_connect_error($conn)) {
		die ("Failed to connect to mysql. " . mysqli_connect_error($conn));
	} else {
		echo "mysql connected.</br>";
	}

	$query="INSERT INTO $table (name,score) VALUES ('$name',$score)";
	echo "query: $query<br>";
	if (mysqli_query($conn,$query)) {
		echo "add score: $name $score<br>";
	} else {
		$err=mysqli_error($conn);
		echo "error: $err<br>";
	}
	mysqli_close($conn);
?>

</body>
</html>