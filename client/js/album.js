console.count("album.js loaded");
(() => {
    console.log("ALBUM SCRIPT LOADED", Date.now());
    const albumId=window.location.hash.replace("#","").split("/")[1];

    const trackList=document.getElementById("track-list");

    if(trackList)
        trackList.innerHTML="";


    if(trackList)
        trackList.innerHTML="";

    if(albumId){

    getAlbum(albumId)
    .then(album=>{

        console.log("ALBUM DATA:",album);

        document.title=`${album.title} • Syntra`;

        const cover=album.cover
        ? album.coverUrl
        :"assets/default-cover.png";

        document.querySelector("#album-bg").style.backgroundImage=`url(${cover})`;

        document.getElementById("album-details").innerHTML=`

        <img src="${cover}">

        <div class="album-details-info">

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

        if(
            window.routeParams?.get("autoplay")==="true"
        ){

            setQueue(album.songs);

            playSong(album.songs[0]);

        }


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

            <span class="track-number">
                ${String(song.track||1).padStart(2,"0")}
            </span>

            <div class="track-info">

            <h3>${song.title||"No title"}</h3>

            <p>${song.artist||"No artist"}</p>

            </div>

            <button class="play-button play-track">
                ▶
            </button>

            `;


            track.querySelector(".play-track").onclick=()=>{

                console.log("PLAY CLICK:",song);

                setQueue(album.songs);

                setQueue(album.songs);
                playSong(song);

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