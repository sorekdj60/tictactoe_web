let currentPlayer = 'X';
let pcPlayer = 'O';
let gameOver = false;
const cells = document.querySelectorAll('.cell');
const message = document.querySelector('.message');

function restartPage() {
    location.reload();
}
function countOccurrences(arr, valueToCount) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === valueToCount) {
            count++;
        }
    }
    return count;
}
function get_index(arr){
    for (var i =0; i < arr.length; i++) {
        if (arr[i] != currentPlayer && arr[i] != pcPlayer) {
            return i;
        }
    }
}
function check_draw() {
    var board = get_board_values();
    for (var i = 0; i < 3; i++) {
        for (var ii=0; ii<3; ii++) {
            if (board[i][ii]==='-'){
                return false;
            }
        }
    }
    return true;
}
function checkWin(value) {
    var board = get_board_values();

    // Check rows and columns
    for (var i = 0; i < 3; i++) {
        if (board[i][0] === value && board[i][1] === value && board[i][2] === value ) {// Horizontal
            return [true,[[i,0], [i,1], [i,2]] ];
        }
        if (board[0][i] === value && board[1][i] === value && board[2][i] === value) {   // Vertical
            return [true,[[0,i], [1,i], [2,i]] ];
        }
    }

    // Check diagonals
    if (board[0][0] === value && board[1][1] === value && board[2][2] === value) { // Main diagonal
        return [true,[[0,0], [1,1], [2,2]]];
    }
    if ( board[0][2] === value && board[1][1] === value && board[2][0] === value ){   // Anti-diagonal
        return [true,[[0,2], [1,1], [2,0]]];
    }

    return [false,[]];
}


function pc_play(value_to_check, opponent){
    var board = get_board_values();
    // first defensive
    for (var index=0; index<board.length; index++){
        // x check
        if (countOccurrences(board[index], value_to_check)===2 && countOccurrences(board[index], opponent)==0){
            return [true,index, get_index(board[index])]; // return row, column
        }
        // y check
        else if(countOccurrences([board[0][index],board[1][index],board[2][index]], value_to_check)===2 && countOccurrences([board[0][index],board[1][index],board[2][index]], opponent)==0){
            return [true,get_index([board[0][index],board[1][index],board[2][index]]), index];
        }
    }
    // check on diagonal
    var diagonal = [board[0][0], board[1][1], board[2][2]]; 
    if (countOccurrences(diagonal, value_to_check)==2 && countOccurrences(diagonal, opponent)==0){
        var val = get_index(diagonal);
        if (val===0){
            return [true,0, 0];
        }
        else if (val===2){
            return [true,2, 2];
        }
        else if (val===1){
            return [true,1, 1];
        }
    }
    var diagonal = [board[0][2], board[1][1], board[2][0]]; 
    if (countOccurrences(diagonal, value_to_check)==2 && countOccurrences(diagonal, opponent)==0){
        var val = get_index(diagonal);
        if (val===0){
            return [true,0, 2];
        }
        else if (val===2){
            return [true,2, 0];
        }
        else if (val===1){
            return [true, 1, 1];
        }
    }
    return [false, false, false];

}

function manage_pc_play(){
    var check_result = pc_play(pcPlayer, currentPlayer)
    
    if (check_result[0]===true){
        return check_result;
    }
    var check_result = pc_play(currentPlayer, pcPlayer)
    if (check_result[0]===true){
        return check_result;
    }
    var board = get_board_values();
    var diagonale = [[1,1],[0,0],[2,2],[0,2],[2,0],[1,2],[2,1],[0,1]];
    for ( var i =0; i<diagonale.length; i++){
        var row = diagonale[i][0];
        var col = diagonale[i][1];
        if (board[row][col]=='-'){
            return [true, row, col]
        }
    }
}

function convertTo1D(row, column) {
    return row * 3 + column;
}
function makeMove(cell) {
    if (!cell.classList.contains('x') && !cell.classList.contains('o') && !gameOver && !check_draw()) {
        cell.classList.add(currentPlayer);
        cell.textContent = currentPlayer;
        if (checkWin(currentPlayer)[0]){
            gameOver = true;
            message.textContent = `${currentPlayer} wins!`;
            cell_values =checkWin(currentPlayer)[1];
            for (i=0; i<cell_values.length; i++){
                row = cell_values[i][0];
                col = cell_values[i][1];
                cells[convertTo1D(row, col)].id = 'win';
            }
        }
        else{
            message.textContent = `It's ${currentPlayer}'s turn`;
        }
        if (!gameOver){
            var val = manage_pc_play();
            if (val[0]==true){
                var index = convertTo1D(val[1], val[2]);
                cells[index].textContent =pcPlayer;
            }

            if (checkWin(pcPlayer)[0]){
                gameOver = true;
                message.textContent = `${pcPlayer} wins!`;
                cell_values =checkWin(pcPlayer)[1];
                for (i=0; i<cell_values.length; i++){
                    row = cell_values[i][0];
                    col = cell_values[i][1];
                    cells[convertTo1D(row, col)].id = 'win';
                }
            }
            else{
                message.textContent = `It's ${pcPlayer}'s turn`;
            }
        }
        
    }
    if (check_draw()){
        gameOver = true;
        message.textContent = 'Draw!';
    }
}

function get_board_values(){
    var values = [];
    for (var i =0; i<9; i++){
        if (cells[i].textContent==='X'){
            values.push('X');
        }
        else if (cells[i].textContent==='O'){
            values.push('O');
        }
        else{
            values.push('-');
        }
    }
    return [[values[0],values[1],values[2]],[values[3],values[4],values[5]],[values[6],values[7],values[8]]];
}
