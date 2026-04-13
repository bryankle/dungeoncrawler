export default function(state = 0, action) {
    switch(action.type) {
        case "STORE_DAMAGE":
            return action.damage
        default:
            return state;
    }
}