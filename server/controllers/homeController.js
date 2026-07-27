const storage=require("../services/storage");


function addCoverUrl(release){

    if(release?.cover){

        release.coverUrl=
            storage.getCoverUrl(release.cover);

    }

    return release;

}


exports.getHome=async(req,res)=>{

    try{

        const home=await storage.getMetadata("home.json");

        const albums=await storage.getMetadata("albums.json");


        const latestRelease=albums.find(
            album=>album.id==home.latestRelease.id
        );


        addCoverUrl(latestRelease);


        const featuredAlbums=
            home.featured.albums.map(id=>{

                const album=albums.find(
                    a=>a.id==id
                );

                return addCoverUrl(album);

            });


        const featuredSingles=
            home.featured.singles.map(id=>{

                const single=albums.find(
                    a=>a.id==id
                );

                return addCoverUrl(single);

            });


        res.json({

            ...home,

            latestRelease,

            featured:{

                albums:featuredAlbums,

                singles:featuredSingles

            }

        });


    }catch(error){

        console.error("Failed to fetch home:",error);

        res.status(500).json({
            message:"Failed to fetch home"
        });

    }

};