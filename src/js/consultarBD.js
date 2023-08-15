import Swal from 'sweetalert2'

const searchInput= document.querySelector('.search-input'),
selectCategoria = document.querySelector('.select-categoria');
let btnEliminarAll= document.querySelectorAll('.table__accion--eliminar'),
searchBtn= document.querySelector('.search__button');


if(searchInput){
    searchBtn.addEventListener('click',async ()=>{
        if(searchInput.value!==''){
          let satinizado=searchInput.value.replace(/[&<>"'`=\/]/g, '');
            const formDataBuscar = new FormData();
            formDataBuscar.append('texto', satinizado);
            formDataBuscar.append('categoria', selectCategoria.value);
            try {
                const url = '/api/buscar';
                const respuesta = await fetch(url, {
                    method: 'POST',
                    body: formDataBuscar
                });
        
                const resultado = await respuesta.json();
                    if(resultado.cant > 10){
                        Swal.fire({
                            title: 'Error',
                            text: 'Debe ser mas especifico en su busqueda',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        })
                    }else{
                      let tbody = document.querySelector(".table__tbody");
                      tbody.innerHTML = await resultado.data;
                      document.querySelectorAll('.table__accion--eliminar').forEach((e) => {
                          e.addEventListener('click', () => {
                            manejarClicEliminar(e);
                          });
                        });
                        document.querySelector(".paginacion__contenedor").innerHTML = "";
                    }
            } catch (error) {
                throw error;
            }
        }else{
            Swal.fire({
                title: 'Error',
                text: 'debe ingresar lo que desea buscar',
                icon: 'error',
                confirmButtonText: 'OK'
            })
        }
    });


    // Llamar a la función al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    btnEliminarAll.forEach((e) => {
      e.addEventListener('click', () => {
        manejarClicEliminar(e);
      });
    });
  });
    }

    async function manejarClicEliminar(btnEliminar) {
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: "Esta acción no se puede deshacer",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, eliminar!'
        });
      
        if (result.isConfirmed) {
          const dataId = btnEliminar.dataset.id;
          const datos = new FormData();
          datos.append('id', dataId);
      
          const url = '/admin/panel/eliminar';
          const respuesta = await fetch(url, {
            method: 'POST',
            body: datos
          });
          const resultado = await respuesta.json();
          if (resultado.resultado) {
            Swal.fire(
              'Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            ).then(() => location.reload());
          } else {
            Swal.fire(
              'Error!',
              'Hubo un problema al eliminar el registro.',
              'error'
            );
          }
        }
      }

