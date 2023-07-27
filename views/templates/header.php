<header>
    <nav class="nav">
      <ul class="nav__ul">
        <li>  
          <?php if (isset($_SESSION['admin'])){ ?>
        <ul class="ul-header">
          <li><a>Admin</a>
          <ul class="dropdown">
              <li><a href="panel">Panel</a></li>
                <li>
                  <a> <form method="POST" action="/logout" class="dashboard__form">
                    <input type="submit" value="Cerrar Sesión" class="dashboard__submit--logout">
                    </form></a>
              </li>
            </ul>
          </li>
        </ul>
              <?php };?>
        </li>
      </ul>
      <a href="/" class="nav__logo">
        QRScanPDF
    </a>
    </nav>
  </header>