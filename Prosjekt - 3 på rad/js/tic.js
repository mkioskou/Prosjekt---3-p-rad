//Empty board
var grid = ['', '', '',
            '', '', '',
            '', '', ''];
var grid_o_coords = [[125, 125], [375, 125], [625, 125],
                   [125, 375], [375, 375], [625, 375],
                   [125, 625], [375, 625], [625, 625]];

var grid_x_coords = [[0, 0], [250, 0], [500, 0],
                   [0, 250], [250, 250], [500, 250],
                   [0, 500], [250, 500], [500, 500]];

var elements = [];                   
var game_over = false;
//Starting player
var turn = 'x';

/**
 * Returns 'o' if current turn is 'x' and vice versa.
 **/
function switch_turn()
{
    return turn === 'x' ? 'o' : 'x';
}

function indexOfCoords(item) {
    for (var i = 0; i <grid_x_coords.length; i++) {
        // This if statement depends on the format of your array
        if (grid_x_coords[i][0] == item[0] && grid_x_coords[i][1] == item[1]) {
            return i;   // Found it
        }
    }
    return -1;   // Not found
}


/**
 * Returns, in an array, whether game is over or not and who won.
 * @returns {[boolean, string]} Array of [is game over, winner]
 */
function evaluate()
{
    var board = grid.slice();
    //var starting = board[0] === turn? 0 : (board[1]===turn ? 1 : board[2]===turn? 2 : -1);
    var starting = board.indexOf(turn);
    var won = false;
    
    if (starting != -1) //Make sure board contains turn
    {
        //win horizontally?
        if (starting % 3 == 0)
        {
            won = board[starting + 1] === turn &&
                board[starting + 2] === turn;
        }

        //win vertically?
        if (!won && (starting == 0 || starting == 1 || starting == 2))
        {
            won = board[starting + 3] === turn &&
                board[starting + 6] === turn;
        }

        //win diagonally?
        if (!won)
        {
            if (starting == 0)
            {
                won = board[starting + 4] === turn &&
                    board[starting + 8] === turn;
            }
            else if (starting == 2)
            {
                won = board[starting + 2] === turn &&
                    board[starting + 4] === turn;
            }
        }

        //tie?
        if (!won)
        {
            won = true;
            var copy = turn;
            turn = "No one";
            grid.forEach(function(value){
                if (value==='')
                {
                    won = false;
                    turn = copy;
                }
            });
        }
    }
    return [won, turn];
}

function start_over()
{
    var c = document.getElementById("tac-board");
    var ctx = c.getContext("2d");
    grid = ['', '', '',
            '', '', '',
            '', '', ''];
    elements = []
    game_over = false;
    turn = 'x';
    c.removeEventListener("click", clicker, false);
    ctx.clearRect(0, 0, c.width,c.height);
    ctx.beginPath();
    setupBoard();
}
function drawCircle(x, y)
{
    var c = document.getElementById("tac-board");
    var ctx = c.getContext("2d");

    ctx.beginPath();
    ctx.arc(x,y,100,0,2*Math.PI);
    ctx.stroke(); 
}
function drawX(x, y)
{
    var c = document.getElementById("tac-board");
    var ctx = c.getContext("2d");

    //first line
    ctx.moveTo(x,y);
    ctx.lineTo(x + 250, y + 250);
    ctx.stroke(); 

    //second line
    ctx.moveTo(x + 250, y);
    ctx.lineTo(x, y + 250);
    ctx.stroke();
}
function clicker(event)
{
    var c = document.getElementById("tac-board");
    var ctx = c.getContext("2d");
    var elemLeft = c.offsetLeft,
    elemTop = c.offsetTop;
        var x = event.pageX - elemLeft,
            y = event.pageY - elemTop;
        /*
        0 1 2
        3 4 5
        6 7 8
        */
        for (var i = 0; i < 9; i++)
        {
            var element = elements[i];
            if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
                console.log(element.left, element.top);
                var index = indexOfCoords([element.left, element.top]);
                if (grid[index]==='') grid[index] = turn;
                else return;
                console.log("Draw " + turn + " at box " + (i + 1));
                console.log("index: " + index);
                console.log(grid);
                render(turn, index);
                run();
            }
        }    
}
function setupBoard()
{
    var c = document.getElementById("tac-board");
    var ctx = c.getContext("2d");

    for (var i = 0; i < 3; i++) //y
    {
        for (var j=0; j < 3; j++) //x
        {//i = 0, j = 1
            elements.push({
                colour: "white",
                width: 250,
                height: 250,
                top: 0 + (250 * i), //top = 0
                left: 0 + (250 * j)//left = 250
            });
        }
  }
  elements.forEach(function(element) {
    ctx.fillStyle = element.colour;
    ctx.fillRect(element.left, element.top, element.width, element.height);
});

//Horizontal lines
ctx.moveTo(0,250);
ctx.lineTo(750,250);
ctx.stroke();

ctx.moveTo(0, 500);
ctx.lineTo(750, 500);
ctx.stroke();

//Vertical lines
ctx.moveTo(250,0);
ctx.lineTo(250,750);
ctx.stroke();

ctx.moveTo(500, 0);
ctx.lineTo(500, 750);
ctx.stroke();

c.addEventListener('click', clicker, false);

}
function run()
{
    var evaluation = evaluate();
    game_over = evaluation[0];
    var winner = game_over ? evaluation[1] : "none";
    if (game_over)
    {
        alert(winner + " won!");
        start_over();
    } else {
        turn = switch_turn();
    }
}
function render(board_element, i)
{
    var c = document.getElementById("tac-board");
    var ctx = c.getContext("2d");
    
    if (board_element==='x')
    {
        x = grid_x_coords[i][0];
        y = grid_x_coords[i][1];

        drawX(x, y);
    } else if (board_element==='o')
    {
        x = grid_o_coords[i][0];
        y = grid_o_coords[i][1];

        drawCircle(x, y);
    }
}

setupBoard();