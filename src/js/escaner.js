const dropArea = document.querySelector('.dashboard__drag-area')
const listSection = document.querySelector('.list-section')
const listContainer = document.querySelector('.list')
const fileSelector = document.querySelector('.dashboard__btn-file')
const fileSelectorInput = document.querySelector('.dashboard__input-file')

// upload files with browse button
fileSelector.onclick = () => fileSelectorInput.click()
fileSelectorInput.onchange = () => {
    listContainer.innerHTML='';
    [...fileSelectorInput.files].forEach((file) => {
        if(typeValidation(file.type)){
            uploadFile(file)
        }
    })
}

dropArea.ondragover = (e) => {
    e.preventDefault();
    e.stopPropagation();
    [...e.dataTransfer.items].forEach((item) => {
        if(typeValidation(item.type)){
            dropArea.classList.add('drag-over-effect')
        }
    })
}
// Drag and drop
dropArea.ondragleave = () => {
    dropArea.classList.remove('drag-over-effect')
}

dropArea.ondrop = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    listContainer.innerHTML='';
    dropArea.classList.remove('drag-over-effect')
    if(e.dataTransfer.items){
        const files = [];
        [...e.dataTransfer.items].forEach((item) => {
            if(item.kind === 'file'){
                const file = item.getAsFile();
                if(typeValidation(file.type)){
                    uploadFile(file)
                    files.push(file);
                }
            }
        });
        addFilesToInput(files);
    }else{
        [...e.dataTransfer.files].forEach((file) => {
            if(typeValidation(file.type)){
                uploadFile(file)
            }
        })
        addFilesToInput(files);
    }
}

function addFilesToInput(files) {
    const newFileList = new DataTransfer();

    files.forEach((file) => {
        newFileList.items.add(file);
    });

    fileSelectorInput.files = newFileList.files;
};

function typeValidation(type){
    var splitType = type.split('/')[0]
    if(type == 'application/pdf' || splitType == 'image' || splitType == 'video'){
        return true
    }
}

//Subida de archivos
function uploadFile(file) {
    listSection.style.display = 'block';
    const li = document.createElement('li');
    li.classList.add('complete'); // Se marca como completo de inmediato sin esperar a la carga
    li.innerHTML = `
        <div class="col">
            <img src="../build/img/pdf.png" alt="icon pdf">
        </div>
        <div class="col">
            <div class="file-name">
                <div class="name">${file.name}</div>
                <span>Complete</span>
            </div>
            <div class="file-size">${(file.size / (1024 * 1024)).toFixed(2)} MB</div>
        </div>
        <div class="col">
            <svg xmlns="http://www.w3.org/2000/svg" class="cross" height="20" width="20"><path d="m5.979 14.917-.854-.896 4-4.021-4-4.062.854-.896 4.042 4.062 4-4.062.854.896-4 4.062 4 4.021-.854.896-4-4.063Z"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" class="tick" height="20" width="20"><path d="m8.229 14.438-3.896-3.917 1.438-1.438 2.458 2.459 6-6L15.667 7Z"/></svg>
        </div>
    `;
    listContainer.prepend(li);
    li.querySelector('.cross').onclick = () => li.remove(); // Eliminar el elemento de la lista al hacer clic en la cruz
}
// find icon for file
function iconSelector(type){
    var splitType = (type.split('/')[0] == 'application') ? type.split('/')[1] : type.split('/')[0];
    return splitType + '.png'
}