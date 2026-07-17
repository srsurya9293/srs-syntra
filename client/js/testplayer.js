console.log("PLAYER VERSION: EMOJI");
const play=document.getElementById("play");

const repeat=document.getElementById("repeat");
const repeatIcon=document.getElementById("repeat-icon");

const volume=document.getElementById("volume");
const volumeIcon=document.getElementById("volume-icon");

let playing=false;
let repeatMode=0;
let muted=false;


play.onclick=()=>{

    playing=!playing;

    playIcon.src=playing
    ?"assets/icons/pause.svg"
    :"assets/icons/play.svg";

};


repeat.onclick=()=>{

    repeatMode=(repeatMode+1)%3;

    switch(repeatMode){

        case 0:

            repeatIcon.src=
            "assets/icons/repeat-off.svg";

            break;


        case 1:

            repeatIcon.src=
            "assets/icons/repeat.svg";

            break;


        case 2:

            repeatIcon.src=
            "assets/icons/repeat-1.svg";

            break;

    }

};


volume.onclick=()=>{

    muted=!muted;

    volumeIcon.src=muted
    ?"assets/icons/volume-x.svg"
    :"assets/icons/volume-2.svg";

};