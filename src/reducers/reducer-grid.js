export default function(state = {}, action) {
    switch(action.type) {
        case "UPDATE_GRID":
            return {
                ...state
            }
        default:
            return state;
    }
}