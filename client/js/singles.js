(() => {

    document.title="Singles • Syntra";
    const songList=document.getElementById("song-list");

    songList.innerHTML="";

    getSongs()
    .then(songs=>{

        songs.forEach(song=>{
            
            const item=document.createElement("div");

            item.className="single-item";
            item.dataset.id=song.id;

            item.innerHTML=`
                <img 
                    class="single-cover"
                    src="${song.coverUrl}"
                    alt="${song.title}"
                >

                <div class="single-info">
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>

                <button class="play-button"><img src="assets/icons/play.svg" alt="Play"></button>
            `;

            item.querySelector("button").onclick=()=>{
                playSong(song);
            };

            songList.appendChild(item);

        });

        updatePlayingUI();

    })
    .catch(error=>console.error("Songs loading error:",error));

})();