const docObjects = {
    bbtnStartStop: document.getElementById('btnStartStop'),
    linkOnOff: '/onOff',
    linkGetState: '/getState',
    linkUpdateUrl: '/updateUrl',
    inputForFolder: document.getElementById('inputForFolder'),
    containerUpdateUrl: document.getElementById('containerUpdateUrl'),
    btnUpdateUrl: document.getElementById('btnUpdateUrl')
};

let state;

const updateControlUI = () => {
    if (state) {
        docObjects.inputForFolder.value = state.folder;
        if (state.isRunning) {
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
    }).then((json) => {
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

    docObjects.btnUpdateUrl.addEventListener('click', () => {
        const path = docObjects.inputForFolder.value.trim();
        const data = JSON.stringify({ path });
        console.log(data);
        fetch(docObjects.linkUpdateUrl, {
                method: "POST",
                body: data,
                headers: {
                    "Content-Type": "application/json"
                }   
            }).then((response) => {
                return response.json();
            }).then((json) => {
                
            })
            .catch()
    });

    getState();
};

init();