(() => {

    document.title="Singles • Syntra";
    const songList=document.getElementById("song-list");

    songList.innerHTML="";

    getSongs()
    .then(songs=>{

        songs.forEach(song=>{

            const item=document.createElement("div");

            item.className="single-item";

            item.innerHTML=`
                <div class="single-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
                <button>▶</button>
            `;

            item.querySelector("button").onclick=()=>{
                playSong(song);
            };

            songList.appendChild(item);

        });

    })
    .catch(error=>console.error("Songs loading error:",error));

})();