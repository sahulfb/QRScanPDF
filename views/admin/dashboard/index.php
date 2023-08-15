<main class="dashboard">
    <h1 class="dashboard__titulo">Escanear Codigo QR</h1>
    <div class="dashboard__contenedor">
        <div class="dashboard__drag-area">
            <div>
                <div class="col">
                    <div class="dashboard__icon">
                        <i class="far fa-file-pdf"></i>
                    </div>

                    <span>Arrastra y suelta los archivos aquí</span>
                    <button class="dashboard__btn-file">Seleccionar Archivo</button>
                    <input type="file" name="files[]" class="dashboard__input-file" multiple>
                </div>

                <div class="col">
                    <div class="drop-here">Soltar Aquí</div>
                </div>
            </div>
        </div>

        <div class="list-section">
            <div class="list-title">Elementos por Escaneados

            </div>
            <div class="list"></div>
            <button class="btn__escanear">Escanear</button>
        </div>
</main>

<div class="resultados-escaner">
    <h2 class="titulo-resultado text-center">Resultados</h2>
    <div class="resultados">
    </div>
    <div class="btn__guardarBD-contenedor">
        <button class="btn__guardarBD">Guardar</button>
    </div>
</div>