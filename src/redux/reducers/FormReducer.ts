import { AnyAction } from 'redux'

const initialState = {
    showForm: 'login',
    showTimeModal: false
}

const FormsReducer = (state = initialState, action: AnyAction) => {
    switch (action.type) {
        case 'SET_FORM':
            return {
                ...state,
                showForm: action.payload
            }
        case 'SET_SHOW_TIMER_MODAL':
            return {
                ...state,
                showTimeModal: action.payload
            }
        default: 
            return state
    }
}

export default FormsReducer