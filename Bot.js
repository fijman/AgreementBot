const canvas = document.getElementById('canvas');
const canvas2 = document.getElementById('canvas2');
const ctx = canvas.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const CSS_SCALE_FACTOR = 0.25;

let scale = 3;
let scale2 = 3;
let currentMouseX = 0;
let currentMouseY = 0;
let draggedImage = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let selectedImage = null;
let isResizing = false;
let isRotating = false;
let resizeHandleSize = 20;

const image = new Image();
const image2 = new Image();
image.src = 'ДОГОВОР_21.jpg';
image2.src = 'ДОГОВОР_2.jpg';

const images = [
    { img: null, x: 500, y: 1950, scale: 3, angle: 0 },
    { img: null, x: 1300, y: 2050, scale: 3, angle: 0 }
];

// Функции для работы с датой, текстом и изображениями
function getFormattedDate(daysOffset) {
    const date = new Date(Date.now() + daysOffset * 86400000);
    return date.toLocaleDateString('ru-RU', { timeZone: 'Europe/Moscow' }).replace(/(\d+).(\d+).(\d+)/, (_, d, m, y) => 
        `${d.padStart(2, '0')}.${m.padStart(2, '0')}.${y}`);
}

const currentDate = getFormattedDate(0);
const currentDate3 = getFormattedDate(3);

function drawTextElements() {
    // Сбрасываем стили перед отрисовкой текста
    ctx.fillStyle = 'rgb(50, 50, 50)'; // Цвет текста
    ctx.strokeStyle = 'transparent'; // Убираем обводку текста
    ctx.lineWidth = 1;

    // Текст первого канваса
    ctx.font = 'bold 35px Courier New';
    ctx.fillText(`${document.getElementById('textInput').value}, именуем(ый/ая) в дальнейшем "Доверитель", заключили`, 450, 703);
    ctx.fillText(`${document.getElementById('textInput1').value}, действующего на основании`, 1200, 613);
    ctx.fillText(currentDate3, 960, 2700);
    ctx.font = 'bolder 60px Courier New';
    ctx.fillText(currentDate, 900, 500);

    // Сбрасываем стили для второго канваса
    ctx2.fillStyle = 'rgb(50, 50, 50)'; // Цвет текста
    ctx2.strokeStyle = 'transparent'; // Убираем обводку текста
    ctx2.lineWidth = 1;

    // Текст второго канваса
    ctx2.font = 'bolder 35px Courier New';
    ctx2.fillText(`${document.getElementById('textInput3').value}@dis.com`, 480, 1520);
    ctx2.fillText(`${document.getElementById('textInput4').value}@dis.com`, 420, 1570);

}

function processText(elementId, x, y) {
    ctx2.fillStyle = 'rgb(50, 50, 50)'; // Цвет текста
    ctx2.strokeStyle = 'transparent'; // Убираем обводку текста
    ctx2.lineWidth = 1;
    const words = document.getElementById(elementId).value.trim().split(' ');
    if (words.length >= 2) {
        ctx2.fillText(`${words[0].charAt(0)}.${words[1]}`, x, y);
    }
}

function processSignatureText() {
    processText('textInput', 970, 2047);
    processText('textInput1', 1780, 2180);
}

function checkHover(imageObj, imgWidth, imgHeight) {
    return (
        currentMouseX >= imageObj.x &&
        currentMouseX <= imageObj.x + imgWidth &&
        currentMouseY >= imageObj.y &&
        currentMouseY <= imageObj.y + imgHeight
    );
}

function getResizeHandles(imageObj, imgWidth, imgHeight) {
    return [
        { x: imageObj.x - resizeHandleSize / 2, y: imageObj.y - resizeHandleSize / 2 }, // Левый верхний (поворот)
        { x: imageObj.x + imgWidth - resizeHandleSize / 2, y: imageObj.y - resizeHandleSize / 2 }, // Правый верхний
        { x: imageObj.x - resizeHandleSize / 2, y: imageObj.y + imgHeight - resizeHandleSize / 2 }, // Левый нижний
        { x: imageObj.x + imgWidth - resizeHandleSize / 2, y: imageObj.y + imgHeight - resizeHandleSize / 2 } // Правый нижний
    ];
}

function drawResizeHandles(imageObj) {
    const imgWidth = imageObj.img.width * imageObj.scale;
    const imgHeight = imageObj.img.height * imageObj.scale;

    if (imageObj === selectedImage) {
        ctx2.strokeStyle = 'rgba(0, 0, 255, 0.8)'; // Синяя рамка
        ctx2.lineWidth = 2;
        ctx2.strokeRect(imageObj.x, imageObj.y, imgWidth, imgHeight);

        const handleSize = resizeHandleSize;

        // Левый верхний угол (поворот)
        ctx2.fillStyle = 'rgba(255, 0, 0, 0.8)'; // Красный маркер для поворота
        ctx2.fillRect(imageObj.x - handleSize / 2, imageObj.y - handleSize / 2, handleSize, handleSize);

        // Остальные маркеры (изменение размера)
        ctx2.fillStyle = 'rgba(0, 0, 255, 0.8)'; // Синие маркеры
        ctx2.fillRect(imageObj.x + imgWidth - handleSize / 2, imageObj.y - handleSize / 2, handleSize, handleSize);
        ctx2.fillRect(imageObj.x - handleSize / 2, imageObj.y + imgHeight - handleSize / 2, handleSize, handleSize);
        ctx2.fillRect(imageObj.x + imgWidth - handleSize / 2, imageObj.y + imgHeight - handleSize / 2, handleSize, handleSize);
    }
}

function drawBaseImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    if (image.complete && image.naturalWidth !== 0) {
        ctx.drawImage(image, 0, 0);
    }
    if (image2.complete && image2.naturalWidth !== 0) {
        ctx2.drawImage(image2, 0, 0);
    }

    // Отрисовка текста (сбрасываем стили)
    drawTextElements();

    images.forEach(imageObj => {
        if (!imageObj.img) return;

        const imgWidth = imageObj.img.width * imageObj.scale;
        const imgHeight = imageObj.img.height * imageObj.scale;

        // Сохраняем текущее состояние контекста
        ctx2.save();

        // Перемещаем начало координат в центр изображения
        ctx2.translate(imageObj.x + imgWidth / 2, imageObj.y + imgHeight / 2);

        // Поворачиваем контекст
        ctx2.rotate((imageObj.angle * Math.PI) / 180);

        // Отрисовываем изображение
        if (imageObj === draggedImage) {
            ctx2.globalAlpha = 0.5;
            ctx2.drawImage(imageObj.img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
            ctx2.globalAlpha = 1.0;
        } else {
            ctx2.drawImage(imageObj.img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
        }

        // Восстанавливаем состояние контекста
        ctx2.restore();

        if (imageObj === selectedImage) {
            drawResizeHandles(imageObj);
        }
    });

    processSignatureText();
}

function handleMouseDown(event) {
    const rect = canvas2.getBoundingClientRect();
    currentMouseX = (event.clientX - rect.left) / CSS_SCALE_FACTOR;
    currentMouseY = (event.clientY - rect.top) / CSS_SCALE_FACTOR;

    images.forEach(imageObj => {
        if (!imageObj.img) return;

        const imgWidth = imageObj.img.width * imageObj.scale;
        const imgHeight = imageObj.img.height * imageObj.scale;

        const handles = getResizeHandles(imageObj, imgWidth, imgHeight);
        const handleIndex = handles.findIndex(handle => 
            currentMouseX >= handle.x && currentMouseX <= handle.x + resizeHandleSize &&
            currentMouseY >= handle.y && currentMouseY <= handle.y + resizeHandleSize
        );

        if (handleIndex !== -1) {
            isResizing = true;
            selectedImage = imageObj;
            if (handleIndex === 0) {
                isRotating = true;
            } else {
                isRotating = false;
            }
            return;
        }

        if (currentMouseX >= imageObj.x && currentMouseX <= imageObj.x + imgWidth &&
            currentMouseY >= imageObj.y && currentMouseY <= imageObj.y + imgHeight) {
            draggedImage = imageObj;
            dragOffsetX = currentMouseX - imageObj.x;
            dragOffsetY = currentMouseY - imageObj.y;
            selectedImage = imageObj;
        }
    });
}

function handleMouseMove(event) {
    const rect = canvas2.getBoundingClientRect();
    currentMouseX = (event.clientX - rect.left) / CSS_SCALE_FACTOR;
    currentMouseY = (event.clientY - rect.top) / CSS_SCALE_FACTOR;

    if (isResizing && selectedImage) {
        if (isRotating) {
            const centerX = selectedImage.x + (selectedImage.img.width * selectedImage.scale) / 2;
            const centerY = selectedImage.y + (selectedImage.img.height * selectedImage.scale) / 2;
            const deltaX = currentMouseX - centerX;
            const deltaY = currentMouseY - centerY;
            selectedImage.angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            canvas2.style.cursor = 'grabbing';
        } else {
            const newWidth = currentMouseX - selectedImage.x;
            const newHeight = (newWidth / selectedImage.img.width) * selectedImage.img.height;

            if (newWidth > 0 && newHeight > 0) {
                selectedImage.scale = newWidth / selectedImage.img.width;
            }
            canvas2.style.cursor = 'grabbing';
        }
        drawBaseImage();
    } else if (draggedImage) {
        draggedImage.x = currentMouseX - dragOffsetX;
        draggedImage.y = currentMouseY - dragOffsetY;
        canvas2.style.cursor = 'grabbing';
        drawBaseImage();
    } else {
        let cursor = 'default';

        images.forEach(imageObj => {
            if (!imageObj.img) return;

            const imgWidth = imageObj.img.width * imageObj.scale;
            const imgHeight = imageObj.img.height * imageObj.scale;

            if (checkHover(imageObj, imgWidth, imgHeight)) {
                cursor = 'grab';
            }

            const handles = getResizeHandles(imageObj, imgWidth, imgHeight);
            const handleIndex = handles.findIndex(handle => 
                currentMouseX >= handle.x && currentMouseX <= handle.x + resizeHandleSize &&
                currentMouseY >= handle.y && currentMouseY <= handle.y + resizeHandleSize
            );

            if (handleIndex !== -1) {
                if (handleIndex === 0) {
                    cursor = 'pointer';
                } else if (handleIndex === 1 || handleIndex === 3) {
                    cursor = 'ew-resize';
                } else if (handleIndex === 2 || handleIndex === 4) {
                    cursor = 'ns-resize';
                }
            }
        });

        canvas2.style.cursor = cursor;
    }
}

function handleMouseUp() {
    draggedImage = null;
    isResizing = false;
    isRotating = false;
    ctx2.globalAlpha = 1.0;
    drawBaseImage();
}

function handleDownload() {
    const prevSelectedImage = selectedImage;
    selectedImage = null;

    drawBaseImage();

    [canvas, canvas2].forEach((c, i) => {
        const link = document.createElement('a');
        link.download = `document_${i+1}.jpeg`;
        link.href = c.toDataURL();
        link.click();
    });

    selectedImage = prevSelectedImage;
    drawBaseImage();
}

// Инициализация
Promise.all([
    new Promise((resolve) => { image.onload = resolve; }),
    new Promise((resolve) => { image2.onload = resolve; })
]).then(() => {
    drawBaseImage();
});

document.getElementById('scaleInput').addEventListener('input', (e) => updateScale(e, images[0]));
document.getElementById('scaleInput2').addEventListener('input', (e) => updateScale(e, images[1]));
document.querySelectorAll('input[type="text"]').forEach(input => input.addEventListener('input', drawBaseImage));
document.getElementById('imageLoader').addEventListener('change', (e) => handleImageUpload(e, images[0]));
document.getElementById('imageLoader2').addEventListener('change', (e) => handleImageUpload(e, images[1]));
document.getElementById('downloadButton').addEventListener('click', handleDownload);

canvas2.addEventListener('mousedown', handleMouseDown);
canvas2.addEventListener('mousemove', handleMouseMove);
canvas2.addEventListener('mouseleave', () => {
    draggedImage = null;
    isResizing = false;
    isRotating = false;
});
window.addEventListener('mouseup', handleMouseUp);

function updateScale(event, imageObj) {
    imageObj.scale = parseFloat(event.target.value);
    drawBaseImage();
}

function handleImageUpload(event, imageObj) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            imageObj.img = img;
            drawBaseImage();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}