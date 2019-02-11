const docObjects = {
    btnStart : document.getElementById('btnStart'),
    btnStop : document.getElementById('btnStop')
}



const init = ()=>{
    btnStart.addEventListener('click',()=>{
        fetch('/start').then((response)=>{
            return response.json();
        }).then((json)=>{
            console.log(json.result);
        });

    });
    btnStop.addEventListener('click',()=>{
        fetch('/stop').then((response)=>{
            return response.json();
        }).then((json)=>{
            console.log(json.result);
        });

    });
};

init();





