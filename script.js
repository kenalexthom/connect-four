
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

function getInitialState() {
    return {
        board: zeroesArray(7,6),
        current_player: Math.floor(Math.random() * 2) + 1,
        color: ""
    }
}

function zeroesArray(columns, rows) {
    var array = [], row = [];
    for (var x = 0; x < columns; x++) row.push(0);
    for (var y = 0; y < rows; y++) array.push(row.slice());
    return array;
}

function chooseColor(state, color) {
    return {
        board: state.board,
        current_player: state.current_player,
        color: color
    };
}

function insertCoin(state, column) {

}

function saveGame(state) {

}

function render() {
    var state = store.getState();

    if(state.color) {
        $(".c4-board .c4-space").addClass("active");
        $(".c4-color .c4-coin").removeClass("active");
        $(".c4-color .mdl-color--" + state.color + ":not('selected')").addClass("selected");
    } else {
        $(".c4-color .c4-coin").addClass("active");
    }

    if(state.current_player === 1) {
        $('.c4-player .c4-current-player').text("Human")
    } else {
        $('.c4-player .c4-current-player').text("Computer")
    }

}

var store = Redux.createStore(connectFourApp);

store.subscribe(render);
render();

$(".c4-color .c4-coin.active").click(function() {
    var color = $(this).hasClass("mdl-color--red") ? "red" : "yellow";
    store.dispatch({type: "CHOOSE_COLOR", color: color});
});