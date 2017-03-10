var store = Redux.createStore(connectFourApp);
store.subscribe(render);
render();

function connectFourApp(state, action) {
    if (typeof state === "undefined") {
        state = getInitialState();
    }
    switch(action.type) {
        case "CHOOSE_COLOR":
            return chooseColor(state, action.color);
        case "INSERT_COIN":
            return insertCoin(state, action.column);
        case "RESTART_GAME":
            return getInitialState();
        case "SAVE_GAME":
            return saveGame(state);
        default:
            return state;
    }
}


// Reducer functions
function chooseColor(state, color) {
    var next_state = cloneObject(state);
    
    next_state.color = color;

    return next_state;
}

function insertCoin(state, column) {
    var next_state = cloneObject(state);

    for (var row = 5; row >= 0; row--) {
        if(!state.board.spaces[row][column]) {
            next_state.board.spaces[row][column] = state.current_player;
            next_state.current_player = (state.current_player === 1 ? 2 : 1);

            if (row === 0) {
                next_state.board.available_columns = next_state.board.available_columns.filter(function(c) {
                    return c !== column;
                });

            }
            row = -1;
        }
    }

    return next_state;
}

function saveGame(state) {

}

// Helper functions
function getInitialState() {
    return {
        board: {
            spaces: zeroesArray(7,6),
            available_columns: [0, 1, 2, 3, 4, 5, 6]
        },
        current_player: Math.floor(Math.random() * 2) + 1,
        color: {
            player: "",
            computer: ""
        }
    }
}

function zeroesArray(columns, rows) {
    var array = [], row = [];
    for (var x = 0; x < columns; x++) row.push(0);
    for (var y = 0; y < rows; y++) array.push(row.slice());
    return array;
}

function cloneObject(obj) {
    var newObj = {};

    for (var key in obj) {
        newObj[key] = obj[key];
    }

    return newObj;
}


// UI functions
function render() {
    var state = store.getState();
    var color, cell;

    if(state.color.player) {
        $(".c4-board .c4-space").addClass("active");
        $(".c4-color .c4-coin").removeClass("active");
        $(".c4-color .mdl-color--" + state.color.player + ":not('selected')").addClass("selected");
    } else {
        $(".c4-color .c4-coin").addClass("active");
    }

    $('.c4-player .c4-current-player').text(state.current_player === 1 ? "Human" : "Computer");

    for (var row = 5; row >= 0; row--) {
        for (var column = 6; column >= 0 ; column--) {
            if(state.board.spaces[row][column]) {
                cell = $(".c4-board .c4-row:nth-child("+(row + 1)+") .c4-space:nth-child("+(column + 1)+")");
                color = state.board.spaces[row][column] === 1 ? state.color.player : state.color.computer;
                cell.addClass("c4-coin mdl-color--" + color);
                cell.removeClass("c4-space mdl-color--grey-100 active");
            } else {
                cell = $(".c4-board .c4-row:nth-child("+(row + 1)+") .c4-coin:nth-child("+(column + 1)+")");
                cell.addClass("c4-space mdl-color--grey-100");
                cell.removeClass("c4-coin mdl-color--red mdl-color--yellow");

            }
        }
    }

    if(state.board.available_columns.length === 0) {
        alert("There are no more spaces available!");
        setTimeout(function(){
            store.dispatch({type: "RESTART_GAME"});
        }, 500);
    }
}

$(".c4-color .c4-coin.active").click(function() {
    var player = $(this).hasClass("mdl-color--red") ? "red" : "yellow";
    var computer = $(this).hasClass("mdl-color--red") ? "yellow" : "red";
    store.dispatch({type: "CHOOSE_COLOR", color: {player: player, computer: computer}});

    var state = store.getState();
    if(state.current_player === 2) {
        setTimeout(function(){
            store.dispatch({type: "INSERT_COIN", column: state.board.available_columns[Math.floor(Math.random() * state.board.available_columns.length)]});
        }, 500);
    }
});

$(".c4-board .c4-space").click(function() {
    var state = store.getState();
    var column = $(".c4-row .c4-space, .c4-row .c4-coin").index(this) % 7;

    if($(this).hasClass("active") && state.current_player === 1) {
        store.dispatch({type: "INSERT_COIN", column: column});
        setTimeout(function(){
            store.dispatch({type: "INSERT_COIN", column: state.board.available_columns[Math.floor(Math.random() * state.board.available_columns.length)]});
        }, 500);
    }
});