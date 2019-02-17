const UiController = (() => {
    const domObjects = {
        bbtnStartStop: document.getElementById('btnStartStop'),
        inputForFolder: document.getElementById('inputForFolder'),
        containerUpdateUrl: document.getElementById('containerUpdateUrl'),
        btnUpdateUrl: document.getElementById('btnUpdateUrl'),
        btnGetState: document.getElementById('btnGetState'),
        orders: document.getElementById('orders')
    };
    const template = `<li class="order">
                        <div>
                            <button data-order="{%btnOpen%}" data-type="open" class="btn btn-primary">Open</button>
                            <button data-order="{%btnDelete%}" data-type="delete" class="btn btn-danger">Delete</button>
                            <p class="originOrder"> {%orFile%} </p>
                            <p class="resultOrder"> {%completedFile%} </p>
                        </div>
                    </li>`;
    const updateFolderUI = (state) => {
        if (state) {
            domObjects.inputForFolder.value = state.folder;
            if (state.isRunning) {
                domObjects.bbtnStartStop.innerText = 'Stop';
                domObjects.inputForFolder.disabled = true;
                domObjects.containerUpdateUrl.classList.add('update-btn');
            } else {
                domObjects.bbtnStartStop.innerText = 'Start';
                domObjects.inputForFolder.disabled = false;
                domObjects.containerUpdateUrl.classList.remove('update-btn');
            }
        }
    };
    const updateUiforOrders = (state) => {
        if (state.files && state.isRunning) {
            orders.innerHTML = '';
            if (state.files.length > 0) {
                let markup = '';
                state.files.forEach(file => {
                    // let view = template.replace('{%originalFile%}', file.originalFile);
                    // view = view.replace('{%orFile%}', file.originalFile);
                    // view = view.replace('{%completedFile%}', file.completedFile);
                    
                    let view = template.replace('{%btnOpen%}', file.originalFile);
                    view = view.replace('{%btnDelete%}', file.originalFile);
                    view = view.replace('{%orFile%}', file.originalFile);
                    view = view.replace('{%completedFile%}', file.completedFile);
                    markup += view;
                });
                orders.insertAdjacentHTML('afterbegin', markup);

            }
        }
    };
    const hideEl = (element) => {
        element.parentNode.style.display = 'none';
    };
    return {
        domObjects,
        updateControlUI: (state) => {
            updateFolderUI(state);
        },
        updateOrderUi: (state) => {
            updateUiforOrders(state);
        },
        hideElement : (element)=>{
            hideEl(element);
        }
    }
})();

const controller = ((UIController) => {
    const docLinks = {
        linkOnOff: '/onOff',
        linkGetState: '/getState',
        linkUpdateUrl: '/updateUrl'
    }

    let state;
    let MySuperTimer;

    const getState = () => {
        fetch(docLinks.linkGetState).then((response) => {
            return response.json();
        }).then((json) => {
            state = json;
            UIController.updateControlUI(state);
            UIController.updateOrderUi(state);
        }).catch();
    };
    const turnOnTimer = (MySuperTimer) => {
        MySuperTimer = setInterval(() => {
            getState();
        }, 3000);
    };
    const init = () => {
        UIController.domObjects.bbtnStartStop.addEventListener('click', () => {
            fetch(docLinks.linkOnOff).then((response) => {
                return response.json();
            }).then((json) => {
                state = json;
                UIController.updateControlUI(state);
            });
        });
        UIController.domObjects.orders.addEventListener('click', (e) => {
            const element = e.target;
            const type = element.dataset.type;
            if (type){
                const order = element.dataset.order;
                console.log(type, order);
            }
            
        });
        UIController.domObjects.btnUpdateUrl.addEventListener('click', () => {
            const path = UIController.domObjects.inputForFolder.value.trim();
            const data = JSON.stringify({
                path
            });
            console.log(data);
            fetch(docLinks.linkUpdateUrl, {
                    method: "POST",
                    body: data,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then((response) => {
                    return response.json();
                }).then((json) => {
                    console.log(json);
                })
                .catch()
        });
        getState();
        turnOnTimer(MySuperTimer);

    }

    return {
        init
    }
})(UiController);


controller.init();