import { FormName, SetForm } from '../types/FormTypes'


const setForm = (showForm: FormName): SetForm => {
    return {
        type: 'SET_FORM',
        payload: showForm
    };
};

const setShowTimeModal = (showTimeModal: boolean)  => {
    return {
        type: 'SET_SHOW_TIMER_MODAL',
        payload: showTimeModal
    }
}

const exportDefault = {
    setForm,
    setShowTimeModal
}

export default exportDefault