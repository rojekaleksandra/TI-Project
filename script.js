const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const ACTIONS = {
  SORT: "SORT",
  COMPARE: "COMPARE",
  SWAP: "SWAP",
};

const map = {
  [ACTIONS.SORT]: (action, members) => members[action.data].sorted(),
  [ACTIONS.SWAP]: (action, members) => {
    const [i, j] = action.data;
    let tmp = members[i].getValue();
    members[i].setValue(members[j].getValue(), "blue");
    members[j].setValue(tmp, "blue");
  },
  [ACTIONS.COMPARE]: (action, members) => {
    const [i, j] = action.data;
    members[i].setColor("blue");
    members[j].setColor("blue");
  },
};

const randArray = (bottom = 1, top = 20) => {
  const arr = [];
  for (let i = bottom; i < top; i++) arr.push(i);
  return arr.sort((a, b) => (Math.random() > 0.5 ? 1 : -1));
};


const bubbleSort = (array, onAction) => {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      onAction({ type: ACTIONS.COMPARE, data: [j, j + 1] });
      if (array[j] > array[j + 1]) {
        let tmp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = tmp;
        onAction({ type: ACTIONS.SWAP, data: [j, j + 1] });
      }
    }
    onAction({ type: ACTIONS.SORT, data: array.length - i - 1 });
  }
  return array;
};

function Rec(x, y, width, height, color = "Moccasin") {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;

  this.draw = () => {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
	
  };

  this.resetColor = () => this.setColor("Moccasin");

  this.setColor = (color) => {
    if (!this.isSorted()) {
      this.color = color;
    }
  };

  this.isSorted = () => this.color === "SeaGreen";

  this.sorted = () => (this.color = "SeaGreen");

  this.setValue = (v, color) => {
    if (!this.isSorted()) {
      this.height = v;
      this.setColor(color);
    }
  };
  this.getValue = (v) => this.height;
}


const randomArray = randArray();
rectangles = randomArray.map((v, i) => {
	return new Rec(10 * i + i, 0, 10, v * 5);
  });
let ticks = 0;
const speed = 600;
const drawAll = () => rectangles.forEach((m) => m.draw());

drawAll();

function start()
{
	bubbleSort(randomArray, (action) => {
		ticks++;
		setTimeout(() => {
		  map[action.type](action, rectangles);
		  ctx.clearRect(0, 0, innerWidth, innerHeight);
		  drawAll(rectangles);
		  rectangles.forEach((m) => m.resetColor());
		}, ticks * speed);
	  });
	  
}