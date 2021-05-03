<?php

function obtenerServicios():array{
    try {
        //importar la conexion
        require('database.php');
        $db->set_charset("utf8");

        //escribir el codigo sql
        $sql = 'SELECT * FROM servicios';

        $consulta = mysqli_query($db, $sql);
        
        $i = 0;
        $servicios = [];

        //obtener los resultados
        while($row = mysqli_fetch_assoc($consulta)){

            $servicios[$i]['id'] = $row['id'];
            $servicios[$i]['nombre'] = $row['nombre'];
            $servicios[$i]['PRECIO'] = $row['PRECIO'];

            $i++;

        }
        // echo "<pre>";
        // var_dump( $servicios);
        // echo "</pre>";
        
        return $servicios;



    } catch (\Throwable $th) {
        //throw $th;
        var_dump($th);
    }
}

// obtenerServicios();