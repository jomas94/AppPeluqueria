<?php

function obtenerServicios(){
    try {
        //importar la conexion
            require('database.php');
            $db->set_charset("utf8");
            //escribir el codigo sql
        $sql = "SELECT * FROM servicios;";

        $consulta = mysqli_query($db,$sql);

        $servicios = [];

        $i = 0;
        //obtener los resultados
        while($row = mysqli_fetch_assoc($consulta)){
            $servicios[$i]['id'] = $row['id'];
            $servicios[$i]['nombre'] = $row['nombre'];
            $servicios[$i]['PRECIO'] = $row['PRECIO'];

            $i++;

        }
        echo "<pre>";
        var_dump($servicios,JSON_UNESCAPED_UNICODE);
        echo "</pre>";



    } catch (\Throwable $th) {
        //throw $th;
        var_dump($th);
    }
}

obtenerServicios();