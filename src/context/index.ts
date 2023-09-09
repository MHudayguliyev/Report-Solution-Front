import { UsualType } from '@app/redux/types/TopnavbarTypes';
import { createContext } from 'react'
export const ReceiverRefContext = createContext({
    current: {
        label: '', value: '', connected: false
    }
});
