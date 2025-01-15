const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Загрузка изображения
const image = new Image();
image.src = 'ДОГОВОР_Сайт.jpg'; // Замените URL на ваше изображение
image.onload = () => {
    ctx.drawImage(image, 0, 0);
};

document.getElementById('addTextButton').addEventListener('click', () => {
    const text = document.getElementById('textInput').value;
    const text1 = document.getElementById('textInput1').value;
    const text2 = document.getElementById('textInput2').value;
    
    // Очистка канваса и перерисовка изображения
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    
    // Настройка шрифта и цвета текста
    ctx.font = 'bold 30px Courier New';
    ctx.fillStyle = 'black';
    ctx.fillText(text, 120, 745); // Установите координаты (x, y) по вашему желанию

    ctx.font = 'bold 30px Courier New';
    ctx.fillStyle = 'black';
    ctx.fillText(text1, 930, 700); // Установите координаты (x, y) по вашему желанию

    ctx.font = 'bolder 50px Courier New';
    ctx.fillStyle = 'black';
    ctx.fillText(text2, 900, 500); // Установите координаты (x, y) по вашему желанию
});

document.getElementById('downloadButton').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'image_with_text.jpeg';
    link.href = canvas.toDataURL();
    link.click();
});