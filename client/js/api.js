(() => {

const API_BASE="http://localhost:3000";

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

})();