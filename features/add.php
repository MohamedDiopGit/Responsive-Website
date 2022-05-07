<!DOCTYPE html>
<html>
    <head>
        <title>Page de traitement</title>
        <meta charset="utf-8">
    </head>
    <body>
        <?php
            $serveur = "localhost";
            $dbname = "sauveteurdunkerque";
            $user = "root";
            
            
            $prenom = $_POST["prenom"];
            $nom = $_POST["nom"];
            $sauveteur = $_POST["sauveteur"];
            
            
            try{
                //On se connecte à la BDD
                $dbco = new PDO("mysql:host=$serveur;dbname=$dbname",$user,$pass);
                $dbco->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
                //On insère les données reçues
                $sth = $dbco->prepare("
                    INSERT INTO sauveteur(idsauveteur, nomsauveteur, prenomsauveteur)
                    VALUES(default, :nom, :prenom)");
                $sth->bindParam(':prenom',$prenom);
                $sth->bindParam(':nom',$nom);
                $sth->execute();
                
                //On renvoie l'utilisateur vers la page de remerciement
                header("Location:../remerciement.html");
            }
            catch(PDOException $e){
                echo 'Impossible de traiter les données. Erreur : '.$e->getMessage();
            }
            mysql_close($dbco);
        ?>
    </body>
</html>