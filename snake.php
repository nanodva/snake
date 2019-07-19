<!DOCTYPE html> 
<html lang="fr"> 
<head>
	<meta charset="utf-8">
	<title>Snake</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<style>
		* {
			box-sizing: border-box;
			padding: 0;
			margin: 0;
			border: none;
		}
		body {
			background-color: grey;
			padding: 0;
			margin: 0;
		}
		.debug_box {
			display: inline-block;
			float: left;
			width: 20%;
			background : grey;
			border : 1px solid black;
			margin-top: 50px;
			padding : 5px;

		}
	}
	</style>
</head>
<body >


	<script>
		// direction for components
		var direction = ["right", "down", "left", "up"];
		// key event 
		var key;
		// var arena;
		var game_is_running = false;
		var game_is_over = false;
		var wait_for_submit = false;
		var division = 12;
		var width = 400;
		var height = width;
		var score = new component(20, 20, 40, "hsla(0, 100%, 100%, 0.5)", "text" );
		
		function init()
		{
			// start listening to keyboard
			parent.document.addEventListener("keydown", keyManager);
			document.addEventListener("keydown", keyManager);
			// game init
			arena.init();
			arena.draw();
			menu.init();
			menu.show();
		} 
		
		function keyManager(event)
		{
			document.getElementById("data5").innerHTML = event.key;
			key = event.key;

			// ingame key events
			if (game_is_running) {
				switch (event.key) {
					case " ":
						game_start();
						break;
					case "x":
						fluxdata();
						break;
					case "Enter":
						info("you pressed Enter");
						break;
				}
			}
			// wait for name submit after game is over
			else if (wait_for_submit) {
				switch (event.key) {
				case "Enter":
					document.getElementById("info1").innerHTML = "submit form";
					menu.submit_score();
					break;
				case "h":
					document.getElementById("info1").innerHTML = "can't help. Sorry";
					break;
				}
			}
			// wait for game menu
			else {
				switch (event.key) {
				case "Enter":
					document.getElementById("info1").innerHTML = "start game";
					game_start();
					break;
				}
			}
		}
				  
		function game_start() {
			menu.hide();
			score.value = 0;
			pomme.size = 0;
			worm.start();
			arena.start();
			pomme.new();
			game_is_running = true;
		}

		function game_over() {
			// when player lose
			menu.game_over();
		}
		
		function game_loop() {
			// clear arena
			arena.draw();
			
			if (game_is_running) {
				//GAME ON, DRAW COMPONENTS
				pomme.body.draw();
				worm.draw(); 
				score.value = (worm.body.length - 1);
				score.draw();

				//COMPTEUR FRAME//
				arena.frame++;
				if ((arena.frame / 10) % 1 == 0) {
					worm.move();
				}
			}
			else {
				//GAME END : redessine plateau sans score
				pomme.body.draw();
				//on repeint le premier anneau en yellow
				worm.body.shift();
				worm.body[0].color = "yellow";
				worm.draw();
				
				// stop game
				arena.stop();
				game_over();
			}
		}
		
		// use to pop apples randomly
		function rnd(mini, maxi) {
			var num = Math.trunc(Math.random() * (maxi-mini) + mini);
			return num;
		}
		
		function component(x, y, size, color, type) {
			this.x = x;
			this.y = y;
			this.color = color;
			this.type = type;
			this.value = 0;
			this.size = size;
			// square side lenght
			// this.len = width / division;
			this.draw = function() {
				if (this.type == "draw") {
					arena.context.fillStyle = this.color;
					// arena.context.fillRect(this.x * 40, this.y *40, size, size);
					arena.context.fillRect(this.x * size, this.y * size, size, size);
				}
				if (this.type == "text") {
					arena.context.font = this.size + "px Arial";
					arena.context.fillStyle = this.color;
					arena.context.fillText(this.value, 50, 50);
				}
			}
			this.move = function(direction) {
				if (direction == "right") {
					this.x++;
				}
				if (direction == "left") {
					this.x--;
				}
				if (direction == "up") {
					this.y--;
				}
				if (direction == "down") {
					this.y++;
				}
			}
		}	
		
		function on_submit() {
			//


		}

		function resizeIframe(obj) {
			obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
			// document.getElementById("agendaFrame").style.height = obj.style.height;
		}
		// Objects
		var arena = {
			canvas : document.createElement("canvas"),
			container : document.createElement("div"),
			form : document.createElement("form"),
			iframe : document.createElement("iframe"),
			input : document.createElement("input"),
			inputscore : document.createElement("input"),
			frame : "0",
			// arena dimensions
			height : 400,
			width : 400,
			// arena square division
			division: division,
			// ouput style
			font_size : 40,
			// millseconds beetween frame
			speed : 17,
			// insert arena object in page
			init : function() {
				//CONTAINER INIT
				this.container.style.height = this.height + "px";
				this.container.style.width = this.width + "px";
				this.container.style.position = "absolute";
				this.container.style.zIndex = "-1";
				
				//arena is the first object ref in this page
				document.body.insertBefore(this.container, document.body.childNodes[0]);
				
				// CANVAS INIT
				this.canvas.width = this.width;
				this.canvas.height = this.height;
				// this.canvas.style.backgroundColor = "black";
				this.canvas.style.backgroundColor = "black";
				// canvas context
				this.context = this.canvas.getContext("2d");
				this.context.font = this.font_size + "px Arial";
				this.context.textAlign = "center";
				//canvas insertion
				this.container.appendChild(this.canvas);
			},
			// draw the arena background
			draw : function() {
				ctx=this.context;
				// this.context.beginPath();
				ctx.clearRect(0, 0, this.width, this.height);
				ctx.beginPath();
				// calculate square dims 
				var square = this.canvas.width / this.division;
				// draw lines to delimit square sides
				for ( var i = 1; i<this.division; i++) {
					// draw verticals
					ctx.moveTo(i*square, 0);
					ctx.lineTo(i*square, this.canvas.height);    
					// draw horizontals
					ctx.moveTo(0, i*square);
					ctx.lineTo(this.canvas.width, i*square);    
				}
				// execute drawings
				this.context.strokeStyle = "#700";
				this.context.stroke();
			},
			start : function() {
				// this.iframe.style.visibility = "hidden";
				this.frame = 0;
				this.interval = setInterval(game_loop, this.speed);
			},
			stop : function() {
				// stop loop
				clearInterval(this.interval);
			},
			clear : function() {
				// draw a black rectangle
				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
			}
		}
		
		var pomme = {
			size : 0,
			len : width / division,

			new : function() {
				var test = false;
				while (!test) {
					// generate rnd coordinates
					var x = rnd(0, division - 1);
					var y = rnd(0, division - 1);
				 
					test = true;
					// test case is available
					for (var i = 0; i < worm.body.length; i++) {
						if (x != worm.body[i].x) { continue; }
						if (y != worm.body[i].y) { continue; }
						test = false;
					}
				}
				// this.body = new component(x, y, 40,"red", "draw");
				// generate apple
				this.body = new component(x, y, this.len,"red", "draw");
				document.getElementById("data6").innerHTML = "new pomme : " + x + " ," + y;
				this.size++;
			}
		}
		
		var worm = {
			len : width / division,
			color : "hsl(225, 35%, 85%",
			start : function() {
				this.direction = 0;
				this.grow = 0;
				//this.body = null;
				this.body = [new component( 4, 4, this.len, color, "draw")];
			},
			draw : function() {
				for (var i=0; i < this.body.length; i++) {
					this.body[i].draw();
				}
			},
			test_key : function() {
				//teste global.key et change .direction
				switch (key) {
				// if (key == "ArrowRight") {
					case "ArrowRight":
						this.direction++;
						if (this.direction > 3) this.direction = 0;
						break;
					case "ArrowLeft": 
						this.direction--;
						if (this.direction < 0) this.direction = 3;
						break;
				}
				key = null;
			},
			move : function() {
				//mofifie direction
				this.test_key();
				//cree et insere copie de la tete
				var x = worm.body[0].x;
				var y = worm.body[0].y;
				this.body.splice(1, 0, new component(x, y, this.len, "green", "draw"));
				//deplace tete
				this.body[0].move(direction[this.direction]);
				//si collision retour
				if (this.testCollision()) {
					return;
				}
				//si .grow=0 coupe la bout de la queue et retour
				if (this.grow == 0) {
					this.body.pop();
					return;
				}
				//sinon .grow-- et retour
				this.grow--;
				return;
			},
			testCollision : function(){
				//test sortie plateau
				if (worm.body[0].x < 0 || worm.body[0].x > division -1 || worm.body[0].y < 0 || worm.body[0].y > division -1 ) {
					game_is_running = false;
					return true;
				}
				//test auto-collision
				for (var i = 1; i < worm.body.length; i++) {
					if (worm.body[0].x == worm.body[i].x && worm.body[0].y == worm.body[i].y) {
						game_is_running = false;
						return true;
					}
				}
				//test collision pomme
				if (worm.body[0].x == pomme.body.x && worm.body[0].y == pomme.body.y) {
					this.grow += pomme.size;
					pomme.new();
				}
				return false;
			}
		}



		var menu = {
			container : document.createElement("div"),
			canvas : document.createElement("canvas"),
			form : document.createElement("form"),
			if_score : document.createElement("iframe"),
			// if_debug : document.createElement("iframe"),
			input : document.createElement("input"),
			inputscore : document.createElement("input"),
			textbox : document.createElement("div"),
			
			// arena dimensions
			height : 400,
			width : 400,
			// ouput style
			font_size : 40,

			init : function() {
				//CONTAINER INIT
				this.container.style.height = this.height + "px";
				this.container.style.width = this.width + "px";
				// document.body.insertBefore(this.container, document.body.childNodes[1]);
				document.body.appendChild(this.container);
				
				// if_score: iframe use to display highscore and info
				// position
				this.if_score.style.position = "absolute";
				this.if_score.style.height = this.height + "px";
				this.if_score.style.width = this.width + "px";
				// style
				this.if_score.border = "no";
				this.if_score.scrolling = "no";
				this.if_score.style.visibility = "hidden";
				// target and metadata
				this.if_score.src="./highscore.php";
				this.if_score.name = "if_score"
				// insertion
				this.container.appendChild(this.if_score);

				
				// CANVAS INIT
				this.canvas.style.position = "absolute";
				// this.canvas.d
				this.canvas.width = this.width;
				this.canvas.height = this.height;
				// canvas context
				this.context = this.canvas.getContext("2d");
				this.context.font = this.font_size + "px Arial";
				this.context.textAlign = "center";
				//canvas insertion
				this.container.appendChild(this.canvas);
				
				// TEXTBOX
				// position
				this.textbox.style.position = "absolute";
				this.textbox.style.width = this.width * 2/3 + "px";
				this.textbox.style.height = this.height * 16/18 + "px";
				this.textbox.style.top =  this.height * 1/18 + "px";
				this.textbox.style.left = ( this.canvas.width * 1/6 ) + "px";
				//textbox style
				this.textbox.style.backgroundColor = "hsla(0, 0%, 0%, 0)";
				// font
				this.textbox.style.color = "white";
				this.textbox.style.fontSize = this.canvas.height / 18 + "px";
				this.textbox.style.textTransform = "uppercase";
				this.textbox.style.textAlign = "center";
				// visibilitythis.textbox.style.visibility = "visible";
				this.textbox.style.visibility = "hidden";

									
				//input.score insertion
				this.container.appendChild(this.textbox);
				
				// FORM INIT
				// input position
				this.input.style.width = this.canvas.width / 2 + "px";
				this.input.style.height = this.font_size + "px";
				this.input.style.position = "absolute";
				this.input.style.top =  this.canvas.height * 0.75 + "px";
				this.input.style.left = ( this.canvas.width / 4 ) + "px";
				// input colors
				this.input.style.backgroundColor = "hsla(20, 40%, 0%, 60%)";
				// input font style
				this.input.style.fontSize = this.canvas.height / 18 + "px";
				this.input.style.color = "white";
				this.input.style.textTransform = "uppercase";
				this.input.style.textAlign = "center";
				this.input.maxLength = "8";
				this.input.style.visibility = "hidden";
				//input attribut
				this.input.setAttribute("type", "text");
				this.input.setAttribute("autocomplete", "off");
				this.input.name = "name";
				// input insertion
				this.form.appendChild(this.input);

                // inputscore attribut
                this.inputscore.setAttribute("type", "number");
				this.inputscore.setAttribute("autocomplete", "off");
				this.inputscore.style.visibility = "hidden";
                this.inputscore.name = "score";
				this.form.appendChild(this.inputscore);

				//form attribut
				// this.form.action = "submit_score.php";
				this.form.action = "highscore.php";
				this.form.onsubmit = on_submit()
				this.form.method = "post";
				// this.form.target = "if_debug";
				this.form.target = "if_score";
				
				//form insertion
				this.container.appendChild(this.form);
				this.container.style.zIndex = "2";
			},
			show : function() {
				// wait for mysqli update and reload highscores
				this.if_score.style.visibility = "visible";
				// this.if_score.src = this.if_score.src;
				// this.if_score.src="./highscore.php";
			},
			hide : function() {
				// hide menu
				this.if_score.style.visibility = "hidden";
			},
			clear : function() {
				// this.context.fillStyle = "hsla(20, 100%, 0%, 100%)";
				this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
			},
			game_over : function (){
				info("game over");
				this.context.fillStyle = "white";
				//affiche texte Game over
				xpos = this.canvas.width * 1/2;
				ypos = this.canvas.height * 1/3;
				msg = "Game over";
				this.context.fillText(msg, xpos, ypos);
				// disply score
				ypos += this.font_size * 2;
				msg = "score " + score.value;
				this.context.fillText(msg, xpos, ypos);
				// display frames				
				// ypos += this.font_size;
				// msg = "frames " + arena.frame;
				// this.context.fillText(msg, xpos, ypos);
				// this.canvas.style.visibility = "visible";
							
				// ask for player name
				this.input.style.visibility = "visible";
				this.input.focus();
				// press Enter to submit	
				wait_for_submit = true;
			},
			submit_score : function(){
				// retrieve playername entry
				this.form["name"].value = this.input.value;
				// retrieve current score
				this.inputscore.value = score.value;
				// send score
				this.form.submit();
				// this.if_score.style.visibility = "visible";

				// reset input
				this.input.style.visibility = "hidden";
				this.input.blur();
				this.input.value = null;
				//
				this.clear();
				wait_for_submit = false;
				this.show();
			},
		}

		init();
	</script>

	<div class="footer">
		<table class="debug_box" >
			<tr>
				<td>info:</td>
				<td id='info'></td>
			</tr>
			<tr>
				<td>info 1</td>
				<td id='info1'></td>
			</tr>
			<tr>
				<td>worm.body.length</td>
				<td id='data1'></td>
			</tr>
			<tr>
				<td>worm.direction</td>
				<td id='data2'></td>
			</tr>
			<tr>
				<td>frame</td>
				<td id='data3'></td>
			</tr>
			<tr>
				<td>worm.body[0]</td>
				<td id='data4'></td>
			</tr>
			<tr>
				<td>key</td>
				<td id='data5'></td>
			</tr>
			<tr>
				<td>pomme occur.</td>
				<td id='data6'></td>
			</tr>
		</table>
		<iframe display="block" name="if_debug" width="800px" height="400px"></iframe>
		
	</div>

	<script type="text/javascript">
			
		function info(data) {
			document.getElementById("info").innerHTML = data;
		}
		
		function fluxdata() {
				document.getElementById('data1').innerHTML = worm.body.length;
				document.getElementById('data2').innerHTML = worm.direction;
				document.getElementById('data3').innerHTML = arena.frame;
				document.getElementById('data4').innerHTML = worm.body[0];
				//document.getElementById('data4').innerHTML = pomme.body.x + ", " + pomme.body.y;
		}
	</script>


</body> 
</html>
