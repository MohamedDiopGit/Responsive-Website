<!DOCTYPE html>
<html>
    <head>
        <title>Page de traitement</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1> Voici les personnes recherchées :</h1>
        <?php
            $serveur = "localhost";
            $dbname = "sauveteurdunkerque";
            $user = "root";
            $pass="";
            
            $sauveteur = $_POST["sauveteur"];


            $conn = new PDO("mysql:host=$serveur;dbname=$dbname",$user,$pass);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            if(! $conn ) {
               die('Could not connect: ' . mysql_error());
            }
            
           
            // RECUPERER LES PERSONNES SAUVEES D'UN SAUVETEUR : NOM - PRENOM - DATE
            if(strcmp($sauveteur,'sauveteur') == 0){
                $sql = 'SELECT nomsauveteur,prenomsauveteur from sauveteur';
            }

            // RECUPERER LES SAUVETAGES D'UNE PERSONNE : DATE - SAUVETEUR
            elseif(strcmp($sauveteur,'sauvee') == 0){
                $sql = 'SELECT nomsauvee,prenomsauvee from perssauvee';
            }

            $result = $conn->query($sql);
            
            if (!$result) {
                $message  = 'Requête invalide : ' . mysql_error() . "\n";
                $message .= 'Requête complète : ' . $query;
                die($message);
            }
            else{
                foreach  ($result as $row) {
                    echo $row[0] . "\t";
                    echo $row[1] . "\t";
                    echo '<br>';
                }
            }
        ?>
        <p>
    	Retour au menu des pages : <a href="../index.php">Menu principale</a>
        </p>
    </body>
</html>