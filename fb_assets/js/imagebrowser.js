'use strict';
const imageContainer = document.querySelector('.imagebrowser-imagecontainer');
const imageInfo = document.querySelector('.imagebrowser-imageinfo');
let imageList = {};


// Modal
const popModal = (frame, content) => {
    document.querySelector('.pop-modal').remove;
    const modal = document.createElement('div');
    modal.classList.add('pop-modal', 'show-modal', frame);
    modal.innerHTML = content;
    document.querySelector('.imagebrowser').appendChild(modal);
    
}


// GET Image info by Index
const getImageInfo = (index) => {
    let imageInfos = '';
    imageInfos += '<label>fájlnév:</label>';
    imageInfos += '<h3>'+imageList[index].name+'</h3>';
    imageInfos += '<div>&bull; kiterjesztés: <b>'+imageList[index].extension+'</b></div>';
    if (imageList[index].extension != 'svg') {
        imageInfos += '<div>&bull; szélesség: <b>'+imageList[index].width+' px</b></div>';
        imageInfos += '<div>&bull; magasság: <b>'+imageList[index].height+' px</b></div>';
    } else {
        imageInfos += '<div>&bull; Vektorgrafikus képfájl.</div>';
        imageInfos += '<div> </div>';
    }
    imageInfos += `<div style=" width: calc(100% - 2rem); 
                                margin: 2rem 1rem; 
                                padding-bottom: 50%; 
                                background-repeat: no-repeat; 
                                background-size: cover; 
                                background-position: center 20%; 
                                background-image: url('${imageList[index].url}')">
                    </div>`;
    imageInfos += `<div> </div>`;
    imageInfos += `<div style="display: flex; justify-content: center;">
                        <button  class="btn btn-sec" 
                            onclick="deleteImage('${imageList[index].abs_url}')">
                            Törlés
                        </button>
                    </div>`;

    imageInfo.innerHTML = imageInfos;   
}


// GET ALL Images
const getImages = () => {
    imageContainer.innerHTML = '';
    fetch("fb_getimages.php")
    .then(response => response.json())
    .then(data => {
        imageList = data;
        let containerContent = '';
        imageContainer.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        containerContent += `<div   class="imagebrowser-imagebox addimage" 
                                    onclick="showUpload()" 
                                    title="Feltöltés" 
                                    alt="Feltöltés">
                                        +
                            </div>`;
        data.forEach( (item, index) => {
            containerContent += `<div   class="imagebrowser-imagebox" 
                                        rel="${index}" 
                                        style="background-image: url('${item.url}');" 
                                        onclick="getImageInfo('${index}')" 
                                        title="${item.name}" 
                                        alt="${item.extension}"></div>`;
        })
        imageContainer.innerHTML = containerContent;
    })
    .catch(error => {
        console.error("Hiba történt:", error);
    });
}


// DELETE Image by URL
const deleteImage = (url) => {
    const confirmDelete = confirm("Biztosan törölni szeretné ezt a fájlt?");

    if (confirmDelete) {
        fetch("fb_deleteimage.php", {
            method: "POST",
            body: JSON.stringify(url),
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                popModal('modal-frame_pri', data.success);
                imageInfo.innerHTML = 'Fájl törölve.';  
                getImages();
            } else {
                popModal('modal-frame_sec', data.error);
                imageInfo.innerHTML = 'Hiba történt.';  
            }
        })
        .catch(error => {
            popModal('modal-frame_sec', error);
        });
    } else {
        popModal('modal-frame_sec', 'A törlés visszavonva.');
    }
}


// SHOW Upload Form
const showUpload = () => {
    imageInfo.innerHTML = ` <form id="upload-form" enctype="multipart/form-data">
                                <input type="file" id="file-input" name="file" accept=".jpg, .jpeg, .png, .svg">
                                <button class="btn btn-pri" type="button" onclick="tryToUpload()">Feltöltés</button>
                            </form>`;
}


// Try to UPLOAD Image
const tryToUpload = () => {
    const fileInput = document.querySelector('#file-input');
    const file = fileInput.files[0];

    if (file) {
        uploadImage(file);
    } else {
        popModal('modal-frame_sec', 'A feltöltendő fájl kiválasztása nem történt meg.');
    }
}


// UPLOAD Image
function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    fetch('fb_uploadimage.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        popModal('modal-frame_pri', data.message);
        imageInfo.innerHTML = 'Fájl feltöltve.';  
        getImages();
    })
    .catch(error => {
        popModal('modal-frame_sec', error);
    });
}



getImages();