<html>
<head>

    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding : 0;
            border: none;
            background-color: hsla(0, 0%, 0%, 0);
            color: ivory;
        }
        
        table {
            width : 280px;
            margin: auto;
            padding-left: 20px;
            padding-right: 20px;

            background-color: hsla(0, 0%, 0%, 0.2);
            /*
            margin-top: 10px;
            border: 1px solid blue;
            border : 1px solid yellow;
            /border-collapse: collapse;
            padding: 10px;
            */
        }
        tr {
            width: 100%;
            background-color: hsla(0, 0%, 0%, 0.2);
        }
        th {
            margin: auto;
            text-align: center;
            padding : 10px;
            font-size: 18px;
        }
        td {
            background-color: hsla(0, 0%, 0%, 0.2);
            padding : 4px;
            /*border : 1px solid red;
            border-collapse: collapse;*/
        }
        #rank {
            text-align: right;
            display: none;
            /*width: 10%;*/
            
            
        }
        #name {
            text-align: left;
            /*width: 30%;*/
           
        }
        #score {
            text-align: right;
            /*width: 20%;*/
            
        }
        
    </style>
    
</head>
<body>
    
    
    <?php
        //import score.php
        //ecrit (append) score dans score.txt
        $file = fopen("score.txt", "a+");
        fwrite($file, "#" . $_POST["nom"] . "$" . $_POST["score"]);
        fwrite($file, "\n");
        fclose($file);
        //fin import
    
    
    
        //echo filemtime("hof.php");
        //echo "Last modified: ".date("F d Y H:i:s.",filemtime("hof.php"));
        //echo date("H:i:s.",filemtime("hof.php"));
        //print "<br>";
    
        $file = fopen("score.txt", "r");
        //read the file line by line and store in an array(nom, score)
        $n = 0;
        while(! feof($file)) {
            
            //$line = ligne n
            $line = fgets($file);
            
            //division sur "$" dans tableau
            $array[$n] = explode("$", $line);
            
            //format du score >> integer
            $array[$n][1] = (int)$array[$n][1];
                        
            //format du nom
            $array[$n][0] = ltrim($array[$n][0],"#");
            $array[$n][0] = trim($array[$n][0]);
            //si pas de nom, jump
            if ($array[$n][0] == null) {
                array_pop($array);
                continue;
            }
            //si format ok, continue ligne suivante
            $n++;
            
        }
        fclose($file);
    
        //sort $array selon score 
        array_multisort(array_column($array, 1), SORT_DESC, SORT_NUMERIC, $array);
        
        
        
        //print $array sorted
        /*
        print "ordre : <br>";
        for ($i = 0; $i < count($array); $i++) {
            print "n°" .$i. " ";
            print $array[$i][0];
            print " avec un score de ";
            print $array[$i][1];
            print "<br>";
        }
        */
    
        print "<table>";
        print "<tr>";
        print "<th colspan='3'>Hall of Fame</th>";
        print "</tr>";
    //for ($i = 0; $i < count($array) || $i < 5; $i++) {
        for ($i = 0; $i < 10; $i++) {
            if ($array[$i] == null) {
                break;                
            }
            print "<tr class='rowdata'>";
           
            print "<td id='rank'>" .($i + 1). "</td>";
            print "<td id='name'>" .$array[$i][0]. "</td>";
            print "<td id='score'>" .$array[$i][1]. "</td>";
           
            print "</tr>";
        }
    
        print "<tr>";
        print "<th colspan='3'>press 'space' to start</th>";
        print "</tr>";
        
        print "</table>";
    
            
        $file = fopen("hof.txt", "w");
        for ($i = 0; $i < count($array); $i++) {
            fwrite($file, "#" . $array[$i][0] . "$" . $array[$i][1] . "\n");
        }
        fclose($file);
    
        
   
    
    ?> 
    
    
    
</body>
</html>