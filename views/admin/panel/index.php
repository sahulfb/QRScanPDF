<h1 class="dashboard__heading">Panel de Administración</h1>

<div class="bloques">
    <div class="bloques__grid">
        <a href="/">
            <div class="bloque bloque__plus">
                <i class="fas fa-plus"></i>
                <h3 class="bloque__heading">Escanear Nuevo <br> Documento</h3>
            </div>
        </a>
        <div class="bloque bloque__card">
            <div class="bloque__flex">
                <i class="fa-solid fa-file"></i>
                <h3 class="bloque__heading">Documentos Guardados</h3>
            </div>
            <p class="bloque__texto--cantidad"><?php echo $total; ?></p>
        </div>

        <div class="bloque bloque__card">
            <div class="bloque__flex">
                <i class="fa-solid fa-user-tie"></i>
                <h3 class="bloque__heading">Empresas Registradas</h3>
            </div>
            <p class="bloque__texto--cantidad"><?php echo $totalEmpresa; ?></p>
        </div>
    </div>
</div>

<div class="search">
    <div class="search__text">
        <input type="text" class="search-input" placeholder="Buscar...">
        <div class="search-button">
            <i class="fas fa-search"></i>
        </div>
    </div>

    <div class="search__select">
        <select class="select-categoria">
            <option value="folio">Folio</option>
            <option value="empresa">Empresa</option>
            <option value="rut">Rut</option>
            <!-- Agrega más opciones según tus necesidades -->
        </select>
    </div>

    <button class="search__button">Buscar</button>
</div>

<div class="tabla__contenedor">
    <?php if (!empty($docInfoAll)) { ?>
        <table class="table">
            <thead class="table__thead">
                <tr>
                    <th scope="col" class="table__th">Creado</th>
                    <th scope="col" class="table__th">Folio</th>
                    <th scope="col" class="table__th">Empresa</th>
                    <th scope="col" class="table__th">Rut</th>
                    <th scope="col" class="table__th">Documento</th>
                    <th scope="col" class="table__th"></th>
                </tr>
            </thead>

            <tbody class="table__tbody">
                <?php foreach ($docInfoAll as $docInfo) { ?>
                    <tr class="table__tr">
                        <td class="table__td">
                            <?php echo $docInfo->fecha; ?>
                        </td>
                        <td class="table__td">
                            <?php echo $docInfo->folio; ?>
                        </td>
                        <td class="table__td">
                            <?php echo $docInfo->empresa ?>
                        </td>
                        <td class="table__td">
                            <?php echo $docInfo->rut ?>
                        </td>
                        <td class="table__td--acciones">
                            <form action="/admin/panel/documento" method="POST" target="_blank">
                                <button type="submit" name="documento" value="<?php echo $docInfo->documento ?>" class="table__accion table__accion--editar">PDF</button>
                            </form>
                        </td>
                        <td>
                            <button class="table__accion table__accion--eliminar" type="submit" data-id="<?php echo $docInfo->id ?>">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                <?php } ?>
            </tbody>
        </table>
    <?php } else { ?>
        <p class="text-center">Aún no ha registrado ningun documento</p>
    <?php } ?>
</div>

<div class="paginacion__contenedor">
    <?php
    echo $paginacion;
    ?>
</div>