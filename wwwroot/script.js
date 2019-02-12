const docObjects = {
    bbtnStartStop: document.getElementById('btnStartStop'),
    linkOnOff:  '/onOff',
    linkGetState : '/getState',
    inputForFolder : document.getElementById('inputForFolder'),
    containerUpdateUrl : document.getElementById('containerUpdateUrl')
};

let state;

const updateControlUI = () => {
    if (state) {
        docObjects.inputForFolder.value = state.folder;
        if (state.isRunning){
            docObjects.bbtnStartStop.innerText = 'Stop';
            docObjects.inputForFolder.disabled = true;
            docObjects.containerUpdateUrl.classList.add('update-btn');
        } else {    
            docObjects.bbtnStartStop.innerText = 'Start';
            docObjects.inputForFolder.disabled = false;
            docObjects.containerUpdateUrl.classList.remove('update-btn');
        }
    }    
};
const getState = () => {
    fetch(docObjects.linkGetState).then((response) => {
        return response.json();
    }).then((json) =>{
        state = json;
        updateControlUI();
    }).catch();
};





const init = () => {
    docObjects.bbtnStartStop.addEventListener('click', () => {
        fetch(docObjects.linkOnOff).then((response) => {
            return response.json();
        }).then((json) => {
           state = json;
           updateControlUI();
        });
    });
    getState();   
};

init();