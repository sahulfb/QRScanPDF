<main>
    <div class="contenedor__home">
        <div class="contenedor__hero">
            <div class="left">
                <div class="titulo">
                    <h1>Escaneo Inteligente de Códigos QR para Organizar y Guardar Documentos PDF</h1>
                </div>

                <p class="texto">Esta aplicación web te permite escanear los códigos QR de tus archivos PDF para extraer la información que necesitas, y almacenarla en nuestra base de datos de forma segura. Simplifica tu flujo de trabajo y ten siempre tus documentos organizados y a tu alcance.</p>
            </div>

            <div class="right">
                <div class="login">
                    <h2 class="titulo__login">Iniciar Sesión</h2>


                    <?php
                    require_once __DIR__ . '/../templates/alertas.php';
                    ?>

                    <form method="POST" action="/" class="formulario">
                        <div class="formulario__campo">
                            <label for="usuario" class="formulario__label">Usuario</label>
                            <input type="text" class="formulario__input" placeholder="Tu usuario" id="usuario" name="usuario">
                        </div>

                        <div class="formulario__campo">
                            <label for="password" class="formulario__label">Contraseña</label>
                            <input type="password" class="formulario__input" placeholder="Tu Contraseña" id="password" name="password">
                        </div>

                        <button type="submit" class="formulario__submit">Ingresar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</main>

<div class="servicios">
    <h2 class="servicios__titulo">Características</h2>
    <div class="servicios__contenedor">
        <ul class="servicios__izq">
            <li>
                <i class="fas fa-check-circle"></i>
                <p><span>Escaneo QR Automático: </span> Escanea códigos QR en documentos PDF en automático, sin mucha esperas.</p>
            </li>

            <li>
                <i class="fas fa-check-circle"></i>
                <p><span>Extracción de Datos Precisa: </span> Le brindamos opciones para asegurar que la información se capture sin errores.</p>
            </li>

            <li>
                <i class="fas fa-check-circle"></i>
                <p><span>Almacenamiento Seguro: </span> Mantén tus documentos y datos importantes protegidos en nuestra base de datos confiable.</p>
            </li>

            <li>
                <i class="fas fa-check-circle"></i>
                <p><span>Interfaz Amigable: </span> Una experiencia de usuario intuitiva y agradable para una gestión sin complicaciones.</p>
            </li>
        </ul>
        <div class="servicios__der">
            <img class="servicios__imagen" loading="lazy" src="build/img/QR-Code-bro2.png" alt="Imagen Scan">
        </div>
    </div>
</div>