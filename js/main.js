window.onload = start;
/*
Global variables
*/
var canvas;
var ctx;
var canvasX = 800;
var canvasY = 800;
var cols = 40;
var rows = 40;
var board = [];
var backgroundColor = "#010101";
var cellColors = ["#c50f0f", "#0fc50f", "#0f5cf0", "#ffc500"];
var survivalRule1;
var survivalRule2;
var birthRule1;
var birthRule2;
var cellBorderColor = "#ffffff";

class Cell {
    constructor(x, y, status) {
        const randomIndex = Math.floor(Math.random() * cellColors.length);
        this.x = x;
        this.y = y;
        this.color = cellColors[randomIndex];
        this.status = status;
        this.nextStatus = status;
        this.neighbours = [];
        this.addNeighbours = function () {
            var xNeighbour, yNeighbour;
            for (var i = -1; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    xNeighbour = (this.x + j + cols) % cols;
                    yNeighbour = (this.y + i + rows) % rows;
                    if (i != 0 || j != 0)
                        this.neighbours.push(board[yNeighbour][xNeighbour]);
                }
            }
        };
        this.draw = function () {
            var color;
            if (this.status == 0)
                color = backgroundColor;
            else
                color = this.color;
            ctx.fillStyle = color;
            ctx.fillRect(this.x * tileX, this.y * tileY, tileX, tileY);
            ctx.lineWidth = 1;
            ctx.strokeStyle = cellBorderColor;
            ctx.strokeRect(this.x * tileX, this.y * tileY, tileX, tileY);
        };
        this.update = function () {
            var aliveNeighbours = 0;
            for (var i = 0; i < this.neighbours.length; i++) {
                aliveNeighbours += this.neighbours[i].status;
            }
            this.nextStatus = this.status;
            if (aliveNeighbours < survivalRule1 || aliveNeighbours > survivalRule2)
                this.nextStatus = 0;
            else if (aliveNeighbours > birthRule1 || aliveNeighbours > birthRule2)
                this.nextStatus = 1;
        };
        this.evolve = function () {
            this.status = this.nextStatus;
        };
    }
}

function    create_board(rows, cols) {
    var board = new Array(rows);
    for (var i = 0; i < cols; i++) {
        board[i] = new Array(cols);
    }
    return (board);
}

function    init_board(board) {
    var currentStatus;
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++){
            currentStatus = Math.floor(Math.random() * 2);
            board[i][j] = new Cell(i, j, currentStatus);
        }
    }
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++){
            board[i][j].addNeighbours();
        }
    }
}

function    drawCanvas(board) {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++){
            board[i][j].draw();
            board[i][j].update();
            board[i][j].evolve();
        }
    }
}

function    main_loop() {
    drawCanvas(board);
}

function    start_game(inputs) {
    canvas = document.getElementById("game");
    ctx = canvas.getContext("2d");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    canvasX = canvas.clientWidth;
    canvasY = canvas.clientHeight;
    tileX = Math.floor(canvasX / rows);
    tileY = Math.floor(canvasY / cols);
    survivalRule1 = parseInt(inputs[0].value);
    survivalRule2 = parseInt(inputs[1].value);
    birthRule1 = parseInt(inputs[2].value);
    birthRule2 = parseInt(inputs[3].value);
    board = create_board(rows, cols);
    init_board(board);
    setInterval(main_loop, 1000 / 30);
}

function    start() {
    const submitBtn = document.querySelector('#submitBtn');
    submitBtn.addEventListener('click', handleSubmit);
}

function handleSubmit(event) {
    event.preventDefault();
    const form = document.querySelector('#form');
    const inputs = form.querySelectorAll('input');
    start_game(inputs);
}
