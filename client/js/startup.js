(() => {

    window.syntraStartup = Promise.all([
        getHome(),
        getAlbums(),
        getSongs(),
        getStories(),
        getAlbumLinks()
    ]);

})();