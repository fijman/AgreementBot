const canvas = document.getElementById('canvas');
const canvas2 = document.getElementById('canvas2');
const ctx = canvas.getContext('2d');
const ctx2 = canvas2.getContext('2d');

console.log("Канвасы и контексты инициализированы.");

let scale = 3;
let scale2 = 3;

const image = new Image();
const image2 = new Image();
image.src = 'ДОГОВОР_21.jpg';
image2.src = 'ДОГОВОР_2.jpg';

console.log("Базовые изображения созданы, начата загрузка.");

image.onload = () => {
    console.log("Базовое изображение 1 загружено.");
    drawBaseImage();
};
image2.onload = () => {
    console.log("Базовое изображение 2 загружено.");
    drawBaseImage();
};

let images = [
    { img: null, x: 500, y: 1950, scale: 3, dragging: false },
    { img: null, x: 1300, y: 2050, scale: 3, dragging: false }
];

console.log("Массив изображений инициализирован.");

let dragOffsetX = 0;
let dragOffsetY = 0;
let draggedImage = null;

function getCurrentDateMoscow() {
    const date = new Date();
    const moscowDate = new Date(date.toLocaleString("en-US", { timeZone: "Europe/Moscow" }));
    return `${moscowDate.getDate().toString().padStart(2, '0')}.${(moscowDate.getMonth() + 1).toString().padStart(2, '0')}.${moscowDate.getFullYear()}`;
}

function getCurrentDate() {
    const date = new Date();
    const moscowDate = new Date(date.toLocaleString("en-US", { timeZone: "Europe/Moscow" }));
    return `${(moscowDate.getDate() + 3).toString().padStart(2, '0')}.${(moscowDate.getMonth() + 1).toString().padStart(2, '0')}.${moscowDate.getFullYear()}`;
}

const currentDate = getCurrentDateMoscow();
const currentDate3 = getCurrentDate();

function updateScale(event, target) {
    if (target === 'scale1') {
        scale = event.target.value;
        images[0].scale = scale;
    } else {
        scale2 = event.target.value;
        images[1].scale = scale2;
    }
    drawBaseImage();
}

document.getElementById('scaleInput').addEventListener('input', (event) => updateScale(event, 'scale1'));
document.getElementById('scaleInput2').addEventListener('input', (event) => updateScale(event, 'scale2'));

document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', drawBaseImage);
});

document.getElementById('imageLoader').addEventListener('change', (event) => loadImage(event, images[0]));
document.getElementById('imageLoader2').addEventListener('change', (event) => loadImage(event, images[1]));

function loadImage(event, imageObj) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function () {
                console.log("Изображение загружено и готово к отображению.");
                imageObj.img = img;
                drawBaseImage();
            };
            img.onerror = function () {
                console.error("Ошибка загрузки изображения.");
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function drawBaseImage() {
    console.log("Перерисовка канвасов.");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx2.drawImage(image2, 0, 0);
    
    ctx.font = 'bold 35px Courier New';
    ctx.fillStyle = 'rgb(50, 50, 50)';
    ctx.fillText(`${document.getElementById('textInput').value}, именуем(ый/ая) в дальнейшем "Доверитель", заключили`, 450, 703);
    ctx.fillText(`${document.getElementById('textInput1').value}, действующего на основании`, 1200, 613);
    ctx.fillText(currentDate3, 960, 2700);
    ctx.font = 'bolder 60px Courier New';
    ctx.fillText(currentDate, 900, 500);

    ctx2.font = 'bolder 35px Courier New';
    ctx2.fillStyle = 'rgb(50, 50, 50)';
    ctx2.fillText(`${document.getElementById('textInput3').value}@dis.com`, 480, 1520);
    ctx2.fillText(`${document.getElementById('textInput4').value}@dis.com`, 420, 1570);
    ctx2.fillText(document.getElementById('textInput5').value, 1130, 770);

    // Если изображения добавлены, рисуем их
    images.forEach((imageObj, index) => {
        if (imageObj.img) {
            console.log(`Рисуем изображение ${index + 1} на координатах X=${imageObj.x}, Y=${imageObj.y}.`);
            ctx2.drawImage(imageObj.img, imageObj.x, imageObj.y, imageObj.img.width * imageObj.scale, imageObj.img.height * imageObj.scale);
        }
    });

    processInput();
    processInput2();
}

function processInput() {
    const words = document.getElementById("textInput").value.trim().split(" ");
    if (words.length >= 2) {
        ctx2.fillText(`${words[0].charAt(0)}.${words[1]}`, 970, 2047);
    }
}

function processInput2() {
    const words = document.getElementById("textInput1").value.trim().split(" ");
    if (words.length >= 2) {
        ctx2.fillText(`${words[0].charAt(0)}.${words[1]}`, 1780, 2180);
    }
}

// Коэффициент масштабирования CSS (0.25)
const CSS_SCALE_FACTOR = 0.25;

// Логика перетаскивания изображений
canvas2.addEventListener('mousedown', (event) => {
    const rect = canvas2.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) / CSS_SCALE_FACTOR;
    const mouseY = (event.clientY - rect.top) / CSS_SCALE_FACTOR;

    images.forEach((imageObj, index) => {
        if (imageObj.img) {
            const imgWidth = imageObj.img.width * imageObj.scale;
            const imgHeight = imageObj.img.height * imageObj.scale;
            
            if (mouseX >= imageObj.x && mouseX <= imageObj.x + imgWidth &&
                mouseY >= imageObj.y && mouseY <= imageObj.y + imgHeight) {
                draggedImage = imageObj;
                dragOffsetX = mouseX - imageObj.x;
                dragOffsetY = mouseY - imageObj.y;
            }
        }
    });
});

canvas2.addEventListener('mousemove', (event) => {
    if (draggedImage) {
        const rect = canvas2.getBoundingClientRect();
        const mouseX = (event.clientX - rect.left) / CSS_SCALE_FACTOR;
        const mouseY = (event.clientY - rect.top) / CSS_SCALE_FACTOR;

        draggedImage.x = mouseX - dragOffsetX;
        draggedImage.y = mouseY - dragOffsetY;
        drawBaseImage();
    }
});

// Обработчики для отпускания изображения
window.addEventListener('mouseup', () => {
    draggedImage = null;
});

canvas2.addEventListener('mouseleave', () => {
    draggedImage = null;
});

document.getElementById('downloadButton').addEventListener('click', () => {
    console.log("Кнопка 'Скачать' нажата.");
    // Перетаскивание изображений разрешается только после нажатия кнопки
    if (images[0].img && images[1].img) {
        // Изображения уже добавлены, сохраняем их позиции
        drawBaseImage();
    } else {
        // Если изображения не добавлены, загружаем их с канваса
        images[0].img = image;
        images[1].img = image2;

        // Перерисовываем канвас
        drawBaseImage();
    }

    // Скачивание изображений с канваса
    const link = document.createElement('a');
    link.download = 'image_with_text.jpeg';
    link.href = canvas.toDataURL();
    link.click();

    const link2 = document.createElement('a');
    link2.download = 'image_with_text2.jpeg';
    link2.href = canvas2.toDataURL();
    link2.click();
});







