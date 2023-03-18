//Fetching the saved videos from local storage


function displaySavedVideos() {
    const savedVideosDiv = document.querySelector("#saved-videos");
    savedVideos = JSON.parse(window.localStorage.getItem("savedVideos")) || [];
    // //Creating a savedVideos container
    // const savedVideosDiv = document.createElement("div");
    // savedVideosDiv.setAttribute("id", "savedVideos");
    // savedVideosDiv.classList.add("row");
    
    if (!savedVideosDiv) {
        // create the saved videos container if it doesn't exist
        const savedVideosContainer = document.createElement("div");
        savedVideosContainer.classList.add("container");
        savedVideosContainer.innerHTML = `
            <h2>Saved Videos</h2>
            <div id="saved-videos" class="row"></div>
        `;
        document.body.appendChild(savedVideosContainer);
    } else {
        savedVideosDiv.innerHTML = "";
    }

    //Displaying saved videos
    savedVideos.forEach((video) => {

        const { title, thumbnailUrl, videoId } = video;

        const videoDiv = document.createElement("div");
        videoDiv.classList.add("col-md-6");
        videoDiv.innerHTML = `
            <div class="thumbnail">
            <a href="#" class="btn btn-primary" role="button" onclick="playSavedVideo("${videoId}");">Play</a>
                <div class="caption">
                    <h3>${title}</h3>
                </div>
            </div>        
        `;
        savedVideosDiv.appendChild(videoDiv);
    });

}

displaySavedVideos();

// Listen for the beforeunload event and save the current state of saved items to localStorage
window.addEventListener('beforeunload', function() {
    localStorage.setItem("savedVideos", JSON.stringify(savedVideos));
  });

//A function to play a saved video
function playSavedVideo(videoId) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(url, '_blank');
}