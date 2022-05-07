<!DOCTYPE html>
<html>
    <head>
        <title>Page de traitement</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1> Voici les informations :</h1>
        <?php
            $serveur = "localhost";
            $dbname = "sauveteurdunkerque";
            $user = "root";
            $pass="";
            
            $prenom = $_POST["prenom"];
            $nom = $_POST["nom"];
            $sauveteur = $_POST["sauveteur"];


            $conn = new PDO("mysql:host=$serveur;dbname=$dbname",$user,$pass);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            if(! $conn ) {
               die('Could not connect: ' . mysql_error());
            }
            
            echo '<h2>' .$sauveteur .':' . "\t" .$nom . "\t" .$prenom .'<br>' .'</h2>';
            // RECUPERER LES PERSONNES SAUVEES D'UN SAUVETEUR : NOM - PRENOM - DATE
            if(strcmp($sauveteur,'sauveteur') == 0){
                $sql = 
                sprintf("SELECT nomsauvee,perssauvee.prenomsauvee, sauvetage.datesauv FROM perssauvee 
                            JOIN groupeperssauvee ON perssauvee.idsauvee = groupeperssauvee.idsauvee
                            JOIN sauvetage ON groupeperssauvee.idsauvetage = sauvetage.idsauvetage
                            JOIN groupeSauveteur ON groupeSauveteur.idsauvetage = sauvetage.idsauvetage
                            JOIN sauveteur ON sauveteur.idSauveteur = groupeSauveteur.idSauveteur
                        WHERE sauveteur.nomSauveteur = '%s' AND sauveteur.prenomSauveteur = '%s'",$nom,$prenom);
            }

            // RECUPERER LES SAUVETAGES D'UNE PERSONNE : DATE - SAUVETEUR
            elseif(strcmp($sauveteur,'sauvee') == 0){
                $sql = 
                sprintf("SELECT sauvetage.dateSauv, sauveteur.nomsauveteur FROM perssauvee 
                            JOIN groupeperssauvee ON perssauvee.idsauvee = groupeperssauvee.idsauvee
                            JOIN sauvetage ON groupeperssauvee.idsauvetage = sauvetage.idsauvetage
                            JOIN groupeSauveteur ON groupeSauveteur.idsauvetage = sauvetage.idsauvetage
                            JOIN sauveteur ON sauveteur.idSauveteur = groupeSauveteur.idSauveteur
                        WHERE perssauvee.nomsauvee = '%s' AND perssauvee.prenomsauvee = '%s'",$nom,$prenom);
            }

            $result = $conn->query($sql);
            
            if (!$result) {
                $message  = 'Requête invalide : ' . mysql_error() . "\n";
                $message .= 'Requête complète : ' . $query;
                die($message);
            }

            
            else{
                $nbsauvetage = 0;
                $dateTemp;
                foreach  ($result as $row) {
                    echo $row[0] . "\t";
                    echo $row[1] . "\t";
                    if(strcmp($sauveteur,'sauveteur') == 0){
                        echo $row[2] . "\t";
                    }
                    echo '<br>';
                    $nbsauvetage++;
                }
                echo '<br>';
                echo $nbsauvetage . "\t";
                if(strcmp($sauveteur,'sauveteur') == 0){
                    echo "\t personne(s) sauvée(s)";
                }
                elseif(strcmp($sauveteur,'sauvee') == 0){
                    echo "\t sauvetage(s).";
                }
            }
        ?>
    </body>
</html>