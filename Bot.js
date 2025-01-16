const canvas = document.getElementById('canvas');
const canvas2 = document.getElementById('canvas2');
const ctx = canvas.getContext('2d');
const ctx2 = canvas2.getContext('2d');
let scale = 1;
let scale2 = 1;

// Загрузка изображения
const image = new Image();
const image2 = new Image();
image.src = 'ДОГОВОР_Сайт.jpg'; // Замените URL на ваше изображение
image2.src = 'ДОГОВОР_Сайт2.jpg'; // Замените URL на ваше изображение
image.onload = () => {
    ctx.drawImage(image, 0, 0);
    ctx2.drawImage(image2, 0, 0);
};

let image3 = new Image();
let image4 = new Image();



// Получаем текущую дату
const currentDate = new Date();

// Получаем день, месяц и год
const day = String(currentDate.getDate()).padStart(2, '0'); // Делаем день двузначным
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
const year = currentDate.getFullYear(); // Получаем полный год

// Форматируем дату
const formattedDate = day+'.'+month+'.'+year;

    // Изменение масштаба изображения
    document.getElementById('scaleInput').addEventListener('input', (event) => {
        scale = event.target.value;
        drawBaseImage(); // Перерисовываем изображение с новым масштабом
    });

// Загрузка изображения с ПК
document.getElementById('imageLoader').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            image3.src = e.target.result;
            image3.onload = () => {

            };
        };
        reader.readAsDataURL(file);
    }
});

    // Изменение масштаба изображения
    document.getElementById('scaleInput2').addEventListener('input', (event) => {
        scale2 = event.target.value;
        drawBaseImage(); // Перерисовываем изображение с новым масштабом
    });

// Загрузка изображения с ПК
document.getElementById('imageLoader2').addEventListener('change', (event) => {
    const file2 = event.target.files[0];
    if (file2) {
        const reader2 = new FileReader();
        reader2.onload = function(e) {
            image4.src = e.target.result;
            image4.onload = () => {

            };
        };
        reader2.readAsDataURL(file2);
    }
});

document.getElementById('addTextButton').addEventListener('click', () => {
    const text = document.getElementById('textInput').value;
    const text1 = document.getElementById('textInput1').value;
   
    const text3 = document.getElementById('textInput3').value;
    const text4 = document.getElementById('textInput4').value;
    const text5 = document.getElementById('textInput5').value;

    // Очистка канваса и перерисовка изображения
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    
    // Настройка шрифта и цвета текста
    ctx.font = 'bold 35px Courier New';
    ctx.fillStyle = 'black';
    ctx.fillText(text +',', 120, 745); // Установите координаты (x, y) по вашему желанию

    ctx.font = 'bold 35px Courier New';
    ctx.fillStyle = 'black';
    ctx.fillText(text1 + ',', 940, 703); // Установите координаты (x, y) по вашему желанию

    ctx.font = 'bolder 50px Courier New';
    ctx.fillStyle = 'black';
    ctx.fillText(formattedDate, 900, 500); // Установите координаты (x, y) по вашему желанию
//
        // Очистка канваса и перерисовка изображения
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx2.drawImage(image2, 0, 0);

    ctx2.font = 'bolder 35px Courier New';
    ctx2.fillStyle = 'black';
    ctx2.fillText(text, 460, 1800); // Установите координаты (x, y) по вашему желанию

    ctx2.font = 'bolder 35px Courier New';
    ctx2.fillStyle = 'black';
    ctx2.fillText(text1, 400, 1850); // Установите координаты (x, y) по вашему желанию


    ctx2.font = 'bolder 35px Courier New';
    ctx2.fillStyle = 'black';
    ctx2.fillText(text3 +'@dis.com', 480, 1653); // Установите координаты (x, y) по вашему желани

    ctx2.font = 'bolder 35px Courier New';
    ctx2.fillStyle = 'black';
    ctx2.fillText(text4 +'@dis.com', 420, 1702); // Установите координаты (x, y) по вашему желани

    ctx2.font = 'bolder 35px Courier New';
    ctx2.fillStyle = 'black';
    ctx2.fillText(text5, 1130, 770); // Установите координаты (x, y) по вашему желани

    ctx2.drawImage(image3, 300, 2500, image3.width * scale, image3.height * scale); // Установите координаты (x, y) по вашему желанию   
    ctx2.drawImage(image4, 1600, 2500, image4.width * scale2, image4.height * scale2); // Установите координаты (x, y) по вашему желанию   
});

document.getElementById('downloadButton').addEventListener('click', () => {
    const link = document.createElement('a');
    const link2 = document.createElement('a');
    link.download = 'image_with_text.jpeg';
    link2.download = 'image_with_text.jpeg';
    link.href = canvas.toDataURL();
    link2.href = canvas2.toDataURL();
    link.click();
    link2.click();
});