(() => {

const albumList=document.getElementById("album-list");

albumList.innerHTML="";

getAlbums()
.then(albums=>{

    albums.forEach(album=>{

        const card=document.createElement("div");

        card.className="album-card";

        card.innerHTML=`
            <div class="album-content" onclick="navigate('album?id=${album.id}')">

                <div class="album-cover">
                    <img src="${album.cover ? album.coverUrl : 'assets/default-cover.png'}">
                </div>

                <div class="album-info">
                    <h3>${album.title}</h3>
                    <p>${album.artist}</p>
                </div>

            </div>
        `;

        albumList.appendChild(card);

    });

})
.catch(error=>console.error("Album loading error:",error));

})();