import Swal from 'sweetalert2'

console.clear();

const btnEscaner= document.querySelector('.btn__escanear');
let qrDataMap = {};
const imageUrlsArray = [];
let documentosNoProcesados = [];
let qrDataLista = []; 
const fileSelectorInput = document.querySelector('.dashboard__input-file');
let linksProcesados;

function addAlphaChannelToUnit8ClampedArray(unit8Array, imageWidth, imageHeight) {
  const newImageData = new Uint8ClampedArray(imageWidth * imageHeight * 4);
  
  for (let j = 0, k = 0, jj = imageWidth * imageHeight * 4; j < jj; ) { 
   newImageData[j++] = unit8Array[k++];
   newImageData[j++] = unit8Array[k++];
   newImageData[j++] = unit8Array[k++];
   newImageData[j++] = 255;
 }

  return newImageData;
}

const getPageImages = async (pageNum, pdfDocumentInstance) => {
  try {
    const pdfPage = await pdfDocumentInstance.getPage(pageNum);
    const operatorList = await pdfPage.getOperatorList();

    const validObjectTypes = [
      pdfjsLib.OPS.paintImageXObject, // 85
      pdfjsLib.OPS.paintImageXObjectRepeat, // 88
      pdfjsLib.OPS.paintJpegXObject // 82
    ];

    const canvasList = [];
    const qrDataList = [];

    await Promise.all(
      operatorList.fnArray.map(async (element, idx) => {
        if (validObjectTypes.includes(element)) {
          const imageName = operatorList.argsArray[idx][0];

          const image = await pdfPage.objs.get(imageName);
          // Uint8ClampedArray
          const imageUnit8Array = image.data;
          const imageWidth = image.width;
          const imageHeight = image.height;

          // imageUnit8Array contiene sólo RGB se le añade alphaChanel
          const imageUint8ArrayWithAlphaChanel = addAlphaChannelToUnit8ClampedArray(imageUnit8Array, imageWidth, imageHeight);

          const imageData = new ImageData(imageUint8ArrayWithAlphaChanel, imageWidth, imageHeight);

          const canvas = document.createElement('canvas');
          canvas.width = imageWidth;
          canvas.height = imageHeight;
          const ctx = canvas.getContext('2d');
          ctx.putImageData(imageData, 0, 0);
          canvasList.push(canvas);

          const decodedData = jsQR(imageUint8ArrayWithAlphaChanel, imageWidth, imageHeight);
          if (decodedData) {
            qrDataList.push(decodedData.data);
          }
        }
      })
    );

    return { canvasList, qrDataList };
  } catch (error) {
    throw error;
    return [];
  }
};


const processFirstPageOfPDFFiles = async (files) => {
  qrDataMap = {};
  let pdfCount = 0;
  const promises = [];

  for (const file of files) {
    if (file.type !== 'application/pdf') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No es un archivo PDF',
      })
      continue;
    }

    const fileReader = new FileReader();
    const promise = new Promise((resolve) => {
    fileReader.onload = async (event) => {
      try {
        const typedArray = new Uint8Array(event.target.result);

        const loadingPdfDocument = pdfjsLib.getDocument(typedArray);
        const pdfDocumentInstance = await loadingPdfDocument.promise;

        const { canvasList, qrDataList } = await getPageImages(1, pdfDocumentInstance); // Procesamos la primera página
        qrDataMap[pdfCount] = JSON.stringify(qrDataList);
        pdfCount++;
        if (qrDataList.length > 0) {
          for (let i = 0; i < canvasList.length; i++) {
            const canvas = canvasList[i];
            imageUrlsArray.push(canvas.toDataURL());
          }
        }else{
          documentosNoProcesados.push(file.name);
        }
        resolve();
        
      } catch (error) {
        resolve();
      }
    };    });
    promises.push(promise);
    fileReader.readAsArrayBuffer(file);
  };
  await Promise.all(promises);
};

function parseUrls(urls) {
  const parsedUrls = urls.map(url => {
    const regex = /\/digital\?data=([^\.]+)\.([^\.]+)\.(.+)/i;
    const matches = url.match(regex);

    if (matches && matches.length === 4) {
      const folio = matches[1];
      const empresa = matches[2].replace(/\+|%20/g, " ");
      const rut = matches[3];

      return {
        folio,
        empresa,
        rut,
      };
    } else {
      return {};
    }
  });

  return parsedUrls;
}




async function escanearPdf() {
  try {
    const files = fileSelectorInput.files;
    await processFirstPageOfPDFFiles(files);

    // Obtener qrDataList de qrDataMap, analizar cada cadena JSON a un objeto
    const qrDataValues = Object.values(qrDataMap);
    qrDataLista = qrDataValues.flatMap(JSON.parse);
    if (qrDataLista.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error al Escanear',
        text: 'No se encontraron datos en los códigos QR.',
      })
      return;
    }else{
      //Filtrar contenido de los códigos QR
     linksProcesados= parseUrls(qrDataLista);
    }

  } catch (error) {
    throw error;
  }
}

if(btnEscaner){
btnEscaner.addEventListener('click', async() => {
    const contenidoSVG = `
    <svg width="30" height="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="12" r="0" fill="#ffffff">
                        <animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
                    </circle>
                    <circle cx="12" cy="12" r="0" fill="#ffffff">
                        <animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
                    </circle>
                    <circle cx="6" cy="12" r="0" fill="#ffffff">
                        <animate attributeName="r" begin="0" calcMode="spline" dur="1.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" repeatCount="indefinite" values="0;2;0;0" />
                    </circle>
                </svg>
    `;
    btnEscaner.textContent = '';
    btnEscaner.insertAdjacentHTML('beforeend', contenidoSVG);

    //limpiar dom
    qrDataMap = {};
    imageUrlsArray.length = 0;
    const container = document.querySelector('.resultados');
    container.innerHTML = '';
    //espezar a escanear
  await  escanearPdf();
  const nombresFinales= obtenerNombresExcluyendo(documentosNoProcesados); 
  if (linksProcesados) {
    let encontradoError = false;
  
    linksProcesados.forEach((objeto) => {
      if (isArrayObjetoVacio(objeto)) {
        encontradoError = true;
      }
    });

    if (encontradoError) {
      Swal.fire({
        icon: 'error',
        title: 'Error al Escanear',
        text: 'Se encontraron documentos con datos no válidos en los códigos QR.',
      });
      btnEscaner.textContent = 'Escanear';
    }else{
      crearDivs(linksProcesados,nombresFinales);
      btnEscaner.textContent = '¡Completado!';
      btnEscaner.disabled = true;
      btnEscaner.style.backgroundColor = '#dee1e5';
      btnEscaner.style.color = 'black';
      btnGuardarBD.classList.remove('btn__guardarBD-desactivado');
    }
}
})
}

function isArrayObjetoVacio(obj) {
  return Object.keys(obj).length === 0;
}

const generateQRDataURL = (value, size, color) => {
  const qr = new QRious({
    value: value,
    size: size,
    backgroundAlpha: 1,
    foreground: color,
    level: "H"
  });

  return qr.toDataURL();
};

function crearDivs(data,name) {
  const container = document.querySelector('.resultados');
  document.querySelector('.resultados-escaner').style.display = 'block';
  container.innerHTML = '';
  const newArray = unirArrays(data, imageUrlsArray);
  newArray.forEach((objeto, i) => {
      const div = document.createElement('div');
      div.classList.add("resultados__contenedor");
      // Generar el enlace base64 del QR
    const qrDataURL = generateQRDataURL(qrDataLista[i], 200, "#000");
      div.innerHTML = `
      <div class="resultados__items">
      <div class="resultados__qr">
          <img src="${qrDataURL}" alt="qr" id="codigo">
      </div>
      <div class="resultados__descripcion">
          <h3 class="resultados__titulo">${name[i]}</h3>
          <div class="resultado__item">
              <label>Código:</label>
              <input type="text" class="codigo" value="${objeto.folio}">
          </div>

          <div class="resultado__item">
              <label>Empresa:</label>
              <input type="text" class="empresa" value="${objeto.empresa}">
          </div>

          <div class="resultado__item">
              <label>RUT:</label>
              <input type="text" class="rut" value="${objeto.rut}">
          </div>
      </div>
  </div>
      `;
      container.appendChild(div);
  });
}

function obtenerNombresExcluyendo(nombresExcluidos) {
  const todosLosNombres = Array.from(fileSelectorInput.files, file => file.name);
  const nombresFiltrados = todosLosNombres.filter(nombre => !nombresExcluidos.includes(nombre));
  return nombresFiltrados;
}

function unirArrays(datos, imagenes) {
  const newArray = datos.map((item, index) => {
    return {
      ...item,
      Imagen: imagenes[index]
    };
  });

  return newArray;
}

if(fileSelectorInput){
  fileSelectorInput.addEventListener('change', () => {
    regresarBtnEstadoInicial();
})

document.querySelector('.dashboard__drag-area').addEventListener('drop', (e) => {
    regresarBtnEstadoInicial();
});
}

function regresarBtnEstadoInicial(){
    btnEscaner.textContent = 'Escanear';
    btnEscaner.disabled = false;
    btnEscaner.style.backgroundColor = '';
    btnEscaner.style.color = '';
    btnEscaner.style.backgroundColor = '#122432;';
    btnEscaner.style.color = '#fff';
}

//Guardar en la base de datos
let btnGuardarBD;
btnGuardarBD= document.querySelector('.btn__guardarBD');

if(btnGuardarBD){
    btnGuardarBD.addEventListener('click', async function(){
        await guardarDatos(linksProcesados);
        btnGuardarBD.classList.add('btn__guardarBD-desactivado');
    });
}

async function guardarDatos(datos) {
    const jsonData = JSON.stringify(datos);
    const fileInput = document.querySelector('input[type="file"]');
    // Crea un objeto FormData y agrega el archivo y los datos JSON
const formData = new FormData();
[...fileInput.files].forEach((file, index) => {
    formData.append('files[' + index + ']', file);
});
formData.append('json', jsonData);
formData.append('nombresExcluidos', JSON.stringify(documentosNoProcesados));
    try {
        const url = '/api/guardar';
        const respuesta = await fetch(url, {
            method: 'POST',
            body: formData
        });

        const resultado = await respuesta.json();
        if (Object.keys(resultado).length > 0) {
        const erroresList = resultado.map(error => `<li>${error}</li>`).join('');
        Swal.fire({
            title: 'Errores',
            icon: 'error',
            html: `<ul>${erroresList}</ul>`
          });
        } else {

        Swal.fire({
            title: 'Datos guardados',
            icon: 'success'
          });
        }

    } catch (error) {
        throw error;
    }
}