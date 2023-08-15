<?php

namespace Controllers;

use Model\Documentos_info;
use MVC\Router;

class GuardarDatosController
{
    public static function guardar()
    {
        $resultadoError = [];
        $cont = 0; // Inicializar el contador
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $jsonData = json_decode($_POST['json']);
            $nombresExcluidos = json_decode($_POST['nombresExcluidos']);
            $uploadedFiles = $_FILES['files'];

            // Validar que la cantidad de datos y archivos sea la misma
            if (count($jsonData) !== count($_FILES['files']['name'])) {
                // Filtrar los archivos y omitir los que están en nombresExcluidos
                $archivosFiltrados = [
                    'name' => [],
                    'type' => [],
                    'tmp_name' => [],
                    'error' => [],
                    'size' => []
                ];
                for ($i = 0; $i < count($uploadedFiles['name']); $i++) {
                    $nombreArchivo = $uploadedFiles['name'][$i];
                    if (!in_array($nombreArchivo, $nombresExcluidos)) {
                        $archivosFiltrados['name'][] = $uploadedFiles['name'][$i];
                        $archivosFiltrados['type'][] = $uploadedFiles['type'][$i];
                        $archivosFiltrados['tmp_name'][] = $uploadedFiles['tmp_name'][$i];
                        $archivosFiltrados['error'][] = $uploadedFiles['error'][$i];
                        $archivosFiltrados['size'][] = $uploadedFiles['size'][$i];
                    }
                }
                $uploadedFiles = $archivosFiltrados;
            }

            // Guardar los archivos y los datos
            foreach ($jsonData as $i => $value) {
                //Validar que no exista el mismo folio
                $folio = s($jsonData[$i]->folio);
                $validacionFolio = Documentos_info::where('folio', $folio);
                if ($validacionFolio) {
                    $resultadoError[$cont] = [$uploadedFiles['name'][$i] . ' - El folio ya existe'];
                    $cont++;
                    continue;
                }

                if ($uploadedFiles['type'][$i] != 'application/pdf') {
                    $resultadoError[$cont] = [$uploadedFiles['name'][$i] . ' - El archivo no es un PDF'];
                    $cont++;
                    continue;
                }

                if ($uploadedFiles['size'][$i] > 8388608) {
                    $resultadoError[$cont] = [$uploadedFiles['name'][$i] . ' - El documento no debe pesar más de 8MB'];
                    $cont++;
                    continue;
                }

                if (empty($folio)) {
                    $resultadoError[$cont] = [$uploadedFiles[$i]['name'] . ' - El folio está vacío'];
                    $cont++;
                    continue;
                }

                // Obtener los datos JSON y los archivos enviados
                $doc_info = new Documentos_info();
                $doc_info->folio = $folio;
                $doc_info->empresa = s($jsonData[$i]->empresa);
                $doc_info->rut = s($jsonData[$i]->rut);

                $nombrePdf = md5(uniqid(rand(), true)) . ".pdf";
                $doc_info->documento = $nombrePdf;
                $directorio = $_SERVER['DOCUMENT_ROOT'] . '/documentos/' . $nombrePdf;

                move_uploaded_file($uploadedFiles['tmp_name'][$i], $directorio);

                $doc_info->guardar();
                $cont++;
            }
            echo json_encode($resultadoError);
        }
    }

    public static function buscar()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $texto = s($_POST['texto']);
            $categoria = s($_POST['categoria']);
            $output = [];
            $campos = Documentos_info::whereLike($categoria, trim($texto));
            if ($campos) {
                // Contar y almacenar la cantidad de elementos
                $cantidadCampos = count($campos);
                $output['cant'] = $cantidadCampos;
                foreach ($campos as $campo) {
                    $output['data'] .= '<tr class="table__tr">';
                    $output['data'] .= '<td class="table__td">' . $campo->fecha . '</td>';
                    $output['data'] .= '<td class="table__td">' . $campo->folio . '</td>';
                    $output['data'] .= '<td class="table__td">' . $campo->empresa . '</td>';
                    $output['data'] .= '<td class="table__td">' . $campo->rut . '</td>';
                    $output['data'] .= '<td class="table__td--acciones">';
                    $output['data'] .= '<form action="/admin/panel/documento" method="POST" target="_blank"><button type="submit" name="documento" value="' . $campo->documento . '" class="table__accion table__accion--editar">PDF</button></form>';
                    $output['data'] .= '<td>';
                    $output['data'] .= '<button class="table__accion table__accion--eliminar" type="submit" data-id="' . $campo->id . '">Eliminar</button></td>';
                    $output['data'] .= '</tr>';
                }
            } else {
                $output['data'] .= '<tr class="table__tr table__tr--empty">';
                $output['data'] .= '<td colspan="7">Sin resultados</td>';
                $output['data'] .= '</tr>';
            }
            echo json_encode($output, JSON_UNESCAPED_UNICODE);
        }
    }
}
