<?php
require_once "./lib/File.php";
header("Content-Type: application/json; charset=UTF-8");
require_once File::build_path(array('model','Model.php'));

if (isset($_GET["lat"]) && isset($_GET["lng"])) {

    $sql = "INSERT INTO enquetes (localisation, date)
        VALUES (ST_GeomFromText(?, 4326), NOW()+interval '2 hour')";
    // Préparation de la requête
    $result = Model::$pdo->prepare($sql);

    $values = array(
        "POINT(" . $_GET["lng"] . " " . $_GET["lat"] . ")"
        //nomdutag => valeur, ...
    );
    // On donne les valeurs et on exécute la requête
    $result->execute($values);
    return $result;
    
}
else {

    return false;
    
}

?>