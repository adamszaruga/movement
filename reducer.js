
const initialState = {
    pin2: null,
    pin4: null,
    pin7: null,
    pin8: null,
    currentTask: null
}

module.exports = (state = initialState, action) => {
    const { type, pin, isClosed } = action;
    if (type === 'SWITCH') {
        let newState = {
            ...state,
            [`pin${pin}`]: isClosed
        }
        console.log(pin)
        if (pin < 6) {
            // This is the second switch
            let { pin2, pin4 } = newState;
            newState.currentTask =
                pin2 && pin4 ? "THANKS" : (pin2 ? "WATER" : "SNACK");
    
        } else {
            
            // This is the first switch
            let { pin7, pin8 } = newState;
            newState.currentTask =
                pin7 && pin8 ? "HIDE_WINDOWS" : (pin7 ? "BREAKOUT" : "GO_TO_LINK");
        }
        return newState;
    } else if (type === 'BOARD_INIT') {
        return {
            ...action.initialState,
            currentTask: null
        };
    }

    return state;
}