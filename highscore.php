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

			background-color: hsla(20, 20%, 20%, 20% );
			width: 400px;
			/*border: 1px solid white;*/

		}
		h1 {
			color: white;
			text-align: center;
			font-size: 22px;
			padding: 20px;

		}
		div.highscore {
			/*border: 2px solid pink;*/
			/*padding: 20px;*/
		}
		table {
			width: 250px;
			margin: auto;
			/*background-color: white;*/
			background-color: none;
			color: white;
			border: none;
			border-collapse: collapse;
			font-size: 20px;
		}
		.name {
			/*color: pink;*/
			text-align: left;
		}
		.score {
			/*color: cyan;*/
			text-align: right;
		}
		.footer {
			font-size: 24px;
			width: 400px;
			position: absolute;
			text-align: center;
			bottom: 32px;
			/*border: 1px solid yellow;*/
		}

	</style>
</head>
<body>
<div class="highscore">
	<h1>HIGHSCORES</h1>
	<table>
    <?php
		$servername = "localhost";
		$username = "snake";
		$password = "password";
		$database = "snakeDB";
		$table = "score";

		// connecting to my sql
		$conn = new mysqli($servername, $username, $password, $database);

		
		if ($conn->connect_error) {
			die ("Failed to connect to mysql: " . $conn->connect_error);
		} else {
			// echo in html code
			echo "<!-- mysql connected -->";
		}
		

		// store new score if new score in POST
		if ( isset($_POST["score"]) and isset($_POST["name"])) {
			$name=$_POST["name"];
			$score=$_POST["score"];
			if ( $score > 0 and strlen("$name") > 0) {
				// skip empty name
				// echo "registering new score<br>";
				$query="INSERT INTO $table (name,score) VALUES ('$name',$score)";
				if ( ! mysqli_query($conn,$query)) {
					echo "  $name -- $score<br>";
					echo "query: $query<br>";
					$err=mysqli_error($conn);
					echo "error: $err<br>";
				}
			}
		}

		// query for scores
		//mysqli_refresh($conn,MYSQLI_REFRESH_TABLES);
		$query="SELECT name,score FROM score ORDER BY score DESC LIMIT 10";
		//$result=mysqli_query($conn,$query);
		$result = $conn->query($query);
		

		// display scores list
		$fmt="<tr><td class='name'>%s</td><td class='score'>%s</td></tr>\n";

	 	while ($obj=mysqli_fetch_object($result)) {
	 		// printf("<tr>");
			printf($fmt, "$obj->name", "$obj->score");
	 		// echo "</tr>";
		}
	  	mysqli_free_result($result);
	  	mysqli_close($conn);
    ?>
	</table>
	<div class="footer">
		press enter to start
	</div>
</div>
</body>
</html>