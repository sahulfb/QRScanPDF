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
                    <input type="file" name="file_selector" class="dashboard__input-file" accept=".pdf" multiple>
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
    </div>
</main>