<?php
require_once "./lib/File.php";
//header("Content-Type: application/json; charset=UTF-8");
require_once File::build_path(array('model','Model.php'));

$sql ="SELECT json_build_object(
    'type', 'FeatureCollection',
    'crs',  json_build_object(
        'type',      'name',
        'properties', json_build_object(
        'name', 'EPSG:4326')),
    'features', json_agg(
        json_build_object(
            'type',       'Feature',
            'geometry',   ST_AsGeoJSON(geom)::json,
            'properties', json_build_object('id', id, 'nom', nom, 'color', color)
        )
    )
) AS objet_geojson FROM zones;";
$sth = Model::$pdo->prepare($sql);
$sth->execute();
$result = $sth->fetch();
print_r($result['objet_geojson']);

?>