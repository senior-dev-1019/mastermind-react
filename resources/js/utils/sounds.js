import { APP_ROOT } from '../configs/appConfig';

const incomingAudio = new Audio(`${APP_ROOT}/assets/audio/incoming.mp3`);

export const playIncoming = () => {
    try {
        incomingAudio.currentTime = 0;
        incomingAudio.play();
    }catch(e){
        var element = document.getElementById('incommingSound');
        element.play();
    }
}

export const stopIncoming = () => {
    try{
        setTimeout(() => {
            incomingAudio.currentTime = 0;
            incomingAudio.pause();
        }, 300);
    }catch(e){
        var element = document.getElementById('incommingSound');
        element.currentTime = 0;
        element.pause();
    }

}
