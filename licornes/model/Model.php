<?php
require_once File::build_path(array('config','Conf.php'));
class Model{

    public static $pdo;

    public static function Init(){

        $login = Conf::getLogin();
        $hostname = Conf::getHostname();
        $database_name = Conf::getDatabase();
        $password = Conf::getPassword();

        try{
            self::$pdo = new PDO("pgsql:host=$hostname;port=5432;dbname=$database_name", $login, $password);

            // On active le mode d'affichage des erreurs, et le lancement d'exception en cas d'erreur
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            if (Conf::getDebug()) {
                echo $e->getMessage(); // affiche un message d'erreur
            } else {
                echo 'Une erreur est survenue <a href=""> retour a la page d\'accueil </a>';
            }
            die();
        }
    }
}
Model::Init();
?>