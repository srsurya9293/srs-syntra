(() => {

    window.API_BASE =
        window.location.hostname === "localhost"
            ? "http://localhost:3000"
            : "https://srs-syntra.onrender.com";


    async function apiFetch(endpoint){

        let response;

        try{

            response = await fetch(`${API_BASE}${endpoint}`);

        }catch(error){

            // Server unreachable / offline
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

            // Server responded, but something went wrong
            window.dispatchEvent(
                new CustomEvent("syntra:server-error",{
                    detail:{
                        type:"unexpected"
                    }
                })
            );

            throw new Error(
                `API request failed: ${response.status}`
            );
        }


        return response;
    }


    window.getSongs = async () => {

        const r = await apiFetch("/api/songs");

        return await r.json();

    };


    window.getSong = async (id) => {

        const r = await apiFetch(`/api/songs/${id}`);

        return await r.json();

    };


    window.getAlbums = async () => {

        const r = await apiFetch("/api/albums");

        return await r.json();

    };


    window.getAlbum = async (id) => {

        const r = await apiFetch(`/api/albums/${id}`);

        return await r.json();

    };


    async function getHome(){

        const res = await apiFetch("/api/home");

        return await res.json();

    }

    window.getHome = getHome;


    async function getStories(){

        const res = await apiFetch("/api/stories");

        return await res.json();

    }

    window.getStories = getStories;


    async function getAlbumLinks(){

        const res = await apiFetch("/api/album-links");

        return await res.json();

    }

    window.getAlbumLinks = getAlbumLinks;
})();