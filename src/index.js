const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
canvas.style.border = '1px solid';

document.getElementById('root').appendChild(canvas);

const digitalClock = {
  e1: 20, //размер клетки цифры (цифра имеет размер 1 на 2 клетки)
  d0: 10, //расстояние между цифрами в числе
          //также расстояние от верхнего и нижнего краёв до чисел
  d1: 20, //расстояние между числом секунд, минут и часов
  xd: 0, //x-координата текущей цифры
};
digitalClock.yd = digitalClock.d0; //y-координата текущей цифры (у всех цифр она одинакова)
digitalClock.colon = false; //флаг двоеточия между числами

//задаём ширину и высоту часов
digitalClock.w = 6*digitalClock.e1+3*digitalClock.d0+2*digitalClock.d1+2*digitalClock.d0;
digitalClock.h = 2*digitalClock.e1+2*digitalClock.d0;

canvas.width = digitalClock.w;
canvas.height = digitalClock.h;

// массив пар координат точек цифр
// начинается с нуля
digitalClock.cifers = [
  [[0, 0], [1, 0], [1, 2], [0, 2], [0, 0]],
  [[1, 0], [1, 2]],
  [[0, 0], [1, 0], [1, 1], [0, 1], [0, 2], [1, 2]],
  [[0, 0], [1, 0], [1, 1], [0, 1], [1, 1], [1, 2], [0, 2]],
  [[0, 0], [0, 1], [1, 1], [1, 0], [1, 2]],
  [[1, 0], [0, 0], [0, 1], [1, 1], [1, 2], [0, 2]],
  [[1, 0], [0, 0], [0, 2], [1, 2], [1, 1], [0, 1]],
  [[0, 0], [1, 0], [1, 2]],
  [[0, 0], [1, 0], [1, 2], [0, 2], [0, 0], [0, 1], [1, 1]],
  [[0, 2], [1, 2], [1, 0], [0, 0], [0, 1], [1, 1]],
];

/**
* рисование цифры
* @param { number } ind - индекс цфиры, то есть сама цифра
*/
digitalClock.drawCifer = function(ind) {
  context.moveTo(
    this.e1*this.cifers[ind][0][0]+this.xd,
    this.e1*this.cifers[ind][0][1]+this.yd
  );
  this.cifers[ind].forEach((crd) => {
    context.lineTo(
      this.e1*crd[0]+this.xd,
      this.e1*crd[1]+this.yd
    );
  });
};

/**
* рисование часов
* @param { date } now - значение текущей дата
*/
digitalClock.draw = function(now) {
  this.colon = !this.colon; //обновляем двоеточие
  now.toLocaleTimeString() //получаем строковое значение времени
    .split(':') //разделяем на массив по :
    .forEach((el, i) => {
    //получаем число: если длина строки числа === 1, добавляем перед '0'
    const n = (el.length === 1) ? '0'+el : el;
    n.split('')
      .forEach((el0, j) => {
      //вычисляем x-координату
	  this.xd = this.d0+(2*i+j)*this.e1+(i+j)*this.d0+i*this.d1;
	  this.drawCifer(el0); //рисуем текущую цифру
      if (this.colon && i !== 2) {
        //рисуем двоеточие
        context.fillRect(
          this.d0+2*(i+1)*this.e1+(i+1)*this.d0+i*this.d1+this.d1/2-2/2,
          this.h/2+(-1+j*2)*this.h/6-2/2,
          2, 2
        );
      };
	});
  });
};
		
setInterval(
  function() {
    context.clearRect(0, 0, digitalClock.w, digitalClock.h);
  	context.beginPath();
  	const now = new Date();
    digitalClock.draw(now);
  	context.stroke();
  },
  1000
);
