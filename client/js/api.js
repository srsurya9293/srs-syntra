(() => {

    window.API_BASE =
        window.location.hostname === "localhost"
            ? "http://localhost:3000"
            : "https://srs-syntra.onrender.com";


    // ========================================
    // API Request Helper
    // ========================================

    async function apiFetch(endpoint){

        let response;

        try{

            response = await fetch(`${API_BASE}${endpoint}`);

        }catch(error){

            window.dispatchEvent(
                new CustomEvent("syntra:server-error",{
                    detail:{
                        type:"offline"
                    }
                })
            );

            throw error;
        }


        if(!response.ok){
            if(response.status !== 404){

                window.dispatchEvent(
                    new CustomEvent("syntra:server-error",{
                        detail:{
                            type:"unexpected"
                        }
                    })
                );
            }

            const error=new Error(
                `API request failed: ${response.status}`
            );

            error.status=response.status;

            throw error;
        }


        return response;
    }


    // ========================================
    // Data Cache
    // ========================================

    const cache={};


    async function getCached(key,endpoint){

        if(cache[key])
            return cache[key];


        cache[key]=apiFetch(endpoint)
            .then(response=>response.json());


        return cache[key];

    }


    // ========================================
    // Songs
    // ========================================

    window.getSongs=()=>{

        return getCached(
            "songs",
            "/api/songs"
        );

    };


    window.getSong=async(id)=>{

        const r=await apiFetch(
            `/api/songs/${id}`
        );

        return await r.json();

    };


    // ========================================
    // Albums
    // ========================================

    window.getAlbums=()=>{

        return getCached(
            "albums",
            "/api/albums"
        );

    };


    window.getAlbum=async(id)=>{

        const r=await apiFetch(
            `/api/albums/${id}`
        );

        return await r.json();

    };


    // ========================================
    // Home
    // ========================================

    window.getHome=()=>{

        return getCached(
            "home",
            "/api/home"
        );

    };


    // ========================================
    // Stories
    // ========================================

    window.getStories=()=>{

        return getCached(
            "stories",
            "/api/stories"
        );

    };


    // ========================================
    // Album Links
    // ========================================

    window.getAlbumLinks=()=>{

        return getCached(
            "albumLinks",
            "/api/album-links"
        );

    };

})();