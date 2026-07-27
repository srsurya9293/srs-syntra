(() => {

window.API_BASE =
    window.location.hostname==="localhost"
    ? "http://localhost:3000"
    : "https://srs-syntra.onrender.com";

window.getSongs=async()=>{
    const r=await fetch(`${API_BASE}/api/songs`);
    return await r.json();
};

window.getSong=async(id)=>{
    const r=await fetch(`${API_BASE}/api/songs/${id}`);
    return await r.json();
};

window.getAlbums=async()=>{
    const r=await fetch(`${API_BASE}/api/albums`);
    return await r.json();
};

window.getAlbum=async(id)=>{
    const r=await fetch(`${API_BASE}/api/albums/${id}`);
    return await r.json();
};

async function getHome(){

    const res=await fetch(`${API_BASE}/api/home`);

    if(!res.ok)
        throw Error("Failed to load home");

    return await res.json();

}

window.getHome=getHome;

})();