import { firebase, auth } from '@app/firebase';

export const generateRecaptcha = () => {
    return new firebase.auth.RecaptchaVerifier('recaptcha-container', { 'size': 'invisible'});
}

export const SendOtp = async (phone: string, ref: any) => {
    let verify = generateRecaptcha()
    try {
        const result = await auth.signInWithPhoneNumber(phone, verify)
        return {success: true, result, verify}    
    } catch (error) {
        console.log('firebase send otp err: ', error)
        verify.clear()
        ref.current.innerHTML = `<div id="recaptcha-container"></div>`;
        return {success: false}
    }
} 

export const ValidateOtp = async (final: any, pins: string[]) => {
    let str = ''
    if(Array.isArray(pins))
        pins.forEach(item => {
            str += item
        })

    if(str.length < 6)
        return {success: false, message: 'Please fill in all the pins first.'}

    try {
        const confirmed = await final.confirm(str)
        if(confirmed.operationType==='signIn'){
            return {success: true}
        }

    } catch (error) {
        console.log("Firebase otp validation err: ", error)
        return {success: false}
    }
}

export const resetCaptcha = async (verifier: any, ref: any) => {
    verifier.clear();
    ref.current.innerHTML = `<div id="recaptcha-container"></div>`;
    return true
}
