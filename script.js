
var connectFourApp = function(state, action) {
    if (typeof state === "undefined") {
        state = {board: zeroesArray(7,6)};
    }
    switch(action.type) {
        case "CHOOSE_COLOR":
            return {
                board: state.board,
                color: "red"
            };
        case "INSERT_COIN":
        case "RESTART_GAME":
        case "SAVE_GAME":
        default:
            return state;
    }
};

function createStore(reducer) {
    var state;
    var listeners = [];

    var getState = function() {
        return state;
    };

    var dispatch = function(action) {
        state = reducer(state, action);
        listeners.forEach(function(listener) {
            console.log(listener);
            return listener;
        })
    };

    var subscribe = function(listener) {
        listeners.push(listener);
        return function () {
            listeners = listeners.filter(function(l) {
                return l !== listener;
            })
        }
    };

    dispatch({});

    return {
        getState: getState,
        dispatch: dispatch,
        subscribe: subscribe
    }
}

function zeroesArray(columns, rows) {
    var array = [], row = [];
    for (var x = 0; x < columns; x++) row.push(0);
    for (var y = 0; y < rows; y++) array.push(row.slice());
    return array;
}

function render() {

}

var store = createStore(connectFourApp);

store.subscribe(render());
render();
console.log(store.dispatch({type: "CHOOSE_COLOR"}));