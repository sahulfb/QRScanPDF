console.clear();
const btnEscaner= document.querySelector('.btn__escanear');
let qrDataMap = {};
const imageUrlsArray = [];
const fileSelectorInput = document.querySelector('.dashboard__input-file');

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
         // console.log('page', pageNum, 'imageName', imageName);

          const image = await pdfPage.objs.get(imageName);
          // Uint8ClampedArray
          const imageUnit8Array = image.data;
          const imageWidth = image.width;
          const imageHeight = image.height;

          // imageUnit8Array contains only RGB need add alphaChanel
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
    console.log(error);
    return [];
  }
};


const processFirstPageOfPDFFiles = async (files) => {
  qrDataMap = {};
  let pdfCount = 0;
  const promises = [];

  for (const file of files) {
    if (file.type !== 'application/pdf') {
      alert(`File ${file.name} is not a PDF file type`);
      continue;
    }

    const fileReader = new FileReader();
    const promise = new Promise((resolve) => {
    fileReader.onload = async (event) => {
      try {
        const typedArray = new Uint8Array(event.target.result);

        const loadingPdfDocument = pdfjsLib.getDocument(typedArray);
        const pdfDocumentInstance = await loadingPdfDocument.promise;

        const { canvasList, qrDataList } = await getPageImages(1, pdfDocumentInstance); // Process only the first page
        qrDataMap[pdfCount] = JSON.stringify(qrDataList);
        pdfCount++;
        for (let i = 0; i < canvasList.length; i++) {
          const canvas = canvasList[i];
          imageUrlsArray.push(canvas.toDataURL());
        }
        resolve();
        
      } catch (error) {
        console.log(error);
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
    const regex = /\/digital\/([^.]+)\.([^.]+)\.([^\/]+)/;
    const matches = url.match(regex);

    if (matches && matches.length === 4) {
      const codigo = matches[1];
      const empresa = matches[2];
      const rut = matches[3];

      return {
        Codigo: codigo,
        Empresa: empresa,
        Rut: rut
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
    const qrDataList = qrDataValues.flatMap(JSON.parse);

    if (qrDataList.length === 0) {
      console.error("No se encontraron datos en los códigos QR.");
      return;
    }

    linksProcesados= parseUrls(qrDataList);
  } catch (error) {
    console.error("Error al obtener o procesar el JSON:", error);
  }
}

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
     crearDivs(linksProcesados);
  btnEscaner.textContent = '¡Completado!';
  btnEscaner.disabled = true;
  btnEscaner.style.backgroundColor = '#dee1e5';
  btnEscaner.style.color = 'black';
})

function crearDivs(data) {
  const container = document.querySelector('.resultados');
  document.querySelector('.resultados-escaner').style.display = 'block';
  container.innerHTML = '';
  const newArray = unirArrays(data, imageUrlsArray);

  newArray.forEach((objeto, i) => {
      const div = document.createElement('div');
      div.classList.add("resultados__contenedor");
      div.innerHTML = `
      <div class="resultados__items">
      <div class="resultados__qr">
          <img src="${objeto.Imagen}" alt="qr">
      </div>
      <div class="resultados__descripcion">
          <h3 class="resultados__titulo">${fileSelectorInput.files[i].name}</h3>
          <div class="resultado__item">
              <label>Código:</label>
              <input type="text" class="codigo" value="${objeto.Codigo}">
          </div>

          <div class="resultado__item">
              <label>Empresa:</label>
              <input type="text" class="empresa" value="${objeto.Empresa}">
          </div>

          <div class="resultado__item">
              <label>RUT:</label>
              <input type="text" class="rut" value="${objeto.Rut}">
          </div>
      </div>
  </div>
      `;
      container.appendChild(div);
  });
}

function unirArrays(datos, imagenes) {
  if (datos.length !== imagenes.length) {
    throw new Error('Los arrays deben tener la misma longitud');
  }

  const newArray = datos.map((item, index) => {
    return {
      ...item,
      Imagen: imagenes[index]
    };
  });

  return newArray;
}

fileSelectorInput.addEventListener('change', () => {
    regresarBtnEstadoInicial();
})

document.querySelector('.dashboard__drag-area').addEventListener('drop', (e) => {
    regresarBtnEstadoInicial();
});

function regresarBtnEstadoInicial(){
    btnEscaner.textContent = 'Escanear';
    btnEscaner.disabled = false;
    btnEscaner.style.backgroundColor = '';
    btnEscaner.style.color = '';
    btnEscaner.style.backgroundColor = '#122432;';
    btnEscaner.style.color = '#fff';
}