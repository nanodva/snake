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
		$username = "root";
		$password = "";
		$database = "score_db";
		$table = "score";

		// connecting to my sql
		$conn = new mysqli($servername, $username, $password, $database);
		if (mysqli_connect_error($conn)) {
			die ("Failed to connect to mysql. " . mysqli_connect_error($conn));
		} else {
			// echo in html code
			echo "<!-- mysql connected -->";
		}

		// query for scores
		$query="SELECT name,score FROM score ORDER BY score DESC LIMIT 10";
		$result=mysqli_query($conn,$query);

		// display scores list
		$fmt="<tr><td class='name'>%s</td><td class='score'>%s</td></tr>\n";

	 	while ($obj=mysqli_fetch_object($result)) {
	 		// printf("<tr>");
			printf($fmt, "$obj->name", "$obj->score");
	 		// echo "</tr>";
		}
	  	mysqli_free_result($result);
    ?>
	</table>
	<div class="footer">
		press enter to start
	</div>
</div>
</body>
</html>