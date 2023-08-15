<?php

namespace Model;

class Documentos_info extends ActiveRecord
{
    protected static $tabla = 'documentos_info';
    protected static $columnasDB = ['id', 'folio', 'empresa', 'rut', 'fecha', 'documento'];

    public $id;
    public $folio;
    public $empresa;
    public $rut;
    public $fecha;
    public $documento;


    public function __construct($args = [])
    {
        $this->id = $args['id'] ?? null;
        $this->folio = $args['folio'] ?? '';
        $this->empresa = $args['empresa'] ?? '';
        $this->rut = $args['rut'] ?? '';
        $this->fecha = date('Y/m/d');
        $this->documento = $args['documento'] ?? '';
    }
}
