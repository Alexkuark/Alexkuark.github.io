<?php
class Conf {
    // la variable debug est un boolean
    static private $debug = True;

    static public function getDebug() {
        return self::$debug;
    }

    static private $databases = array(
        // Le nom d'hote
        // ou localhost sur votre machine
        'hostname' => 'localhost',
        // base de données
        'database' => 'webmapping',
        // login
        'login' => 'postgres',
        // mdp
        'password' => 'postgres'
    );

    static public function getLogin() {
        //en PHP l'indice d'un tableau n'est pas forcement un chiffre.
        return self::$databases['login'];
    }

    static public function getHostname(){
        return self :: $databases['hostname'];
    }

    static public function getDatabase(){
        return self::$databases['database'];
    }

    static public function getPassword() {
        return self::$databases['password'];
    }
}
