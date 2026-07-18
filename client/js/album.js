console.count("album.js loaded");
(() => {
    console.log("ALBUM SCRIPT LOADED", Date.now());
    const hash=window.location.hash;
    const params=new URLSearchParams(hash.split("?")[1]);
    const albumId=params.get("id");

    const trackList=document.getElementById("track-list");

    if(trackList)
        trackList.innerHTML="";


    if(trackList)
        trackList.innerHTML="";

    if(albumId){

    getAlbum(albumId)
    .then(album=>{

        console.log("ALBUM DATA:",album);

        const cover=album.cover
        ?`http://localhost:3000/covers/${album.cover}`
        :"assets/default-cover.png";

        document.querySelector("#album-bg").style.backgroundImage=`url(${cover})`;

        document.getElementById("album-details").innerHTML=`

        <img src="${cover}">

        <div class="album-info">

        <h1>${album.title}</h1>

        <p>${album.artist} • ${album.year||"Unknown Year"}</p>

        <button id="play-album">
        ▶ Play Album
        </button>

        </div>

        `;


        document.getElementById("play-album").onclick=()=>{

            setQueue(album.songs);
            playSong(album.songs[0]);

        };


        const trackList=document.getElementById("track-list");


        if(!album.songs){

            console.error("No songs array found");
            return;

        }

        console.log(album.songs);

        album.songs.forEach(song=>{

            const track=document.createElement("div");

            track.className="track";
            track.dataset.id=song.id;

            console.log("CREATING TRACK:", song.id, song.title);
            track.dataset.id=song.id;

            track.innerHTML=`

            <span>${String(song.track||1).padStart(2,"0")}</span>

            <div>

            <h3>${song.title||"No title"}</h3>

            <p>${song.artist||"No artist"}</p>

            </div>

            <button class="play-track">
            ▶
            </button>

            `;


            track.querySelector(".play-track").onclick=()=>{

                console.log("PLAY CLICK:",song);

                playFromQueue(song);

            };


            trackList.appendChild(track);
            
            console.log(
                "TRACK COUNT:",
                trackList.children.length
            );

        });

        updatePlayingUI();


    })
    .catch(err=>{

        console.error("Album error:",err);

    });

    }
    else{

    console.error("No album ID found");

    }
})();