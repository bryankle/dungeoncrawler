export default function(state = 0, action) {
    switch(action.type) {
        case "ATTACK_CRITTER":
            return {
                ...state
            }
        default:
            return state;
    }
}