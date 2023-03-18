//Compulsory Task | Capstone Project I

const API_KEY = "AIzaSyC5PgmSABc6dT9TO_v-cxXfxyKyUOYzkKI";
const CHANNEL_ID = "UCGyDjbX9F9ARt_8sgv5kGDg";
const MAX_RESULTS = 12;

//An array to store the saved videos
// let savedVideos = [];

// Check if there is any saved data in localStorage
let savedVideos = localStorage.getItem("savedVideos");
if (savedVideos) {
  savedVideos = JSON.parse(savedVideos);
} else {
  savedVideos = [];
}

//A function to fetch @Helpme Devon tutorials and create a thumbnail for each video
function getVideos() {
    //API URL with the API key, channel ID and some parameters
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}`;
    // const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${CHANNEL_ID}&part=snippet&order=date&maxResults=${MAX_RESULTS}`;

   // Fetch the data from the API as a JSON object
    fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
        // console.log(data);
        // Extracting the video objects from the API response
        const videos = data.items;
        // Finding the HTML element where the thumbnails will be added
        const tutorialsDiv = document.querySelector("#tutorials");
        // Adding the 'row' class to the tutorials container
        tutorialsDiv.classList.add("row");

        // Extracting the title, thumbnail URLS, and video ID from each object
        videos.forEach((video, index) => {
            const { title, thumbnails} = video.snippet;
            const videoId = video.id.videoId;
            // Using the medium-sized thumbnail for the thumbnail image
            // console.log(videoId);
            const thumbnailUrl = thumbnails.medium.url;

            // Creating a new HTML element for the thumbnail
            const thumbnailDiv = document.createElement("div");
            // Adding the 'col-md-6' class to display two videos per row
            thumbnailDiv.classList.add("col-md-6");
            // Check if the current video is the first in the row
            if (index % 2 === 0) {
                const rowDiv = document.createElement("div");
                rowDiv.classList.add("row","row-cols-2");
                rowDiv.appendChild(thumbnailDiv);
                tutorialsDiv.appendChild(rowDiv);
            } else {
                // If it's not the first in the row, add it to the last row
                const rowDivs = tutorialsDiv.querySelectorAll(".row-cols-2");
                const lastRowDiv = rowDivs[rowDivs.length - 1];
                lastRowDiv.appendChild(thumbnailDiv);
            }

            //Creating a new HTML elemenr for the thumbnails's comment section
            const commentSectionDiv = document.createElement("div");
            commentSectionDiv.classList.add("comment-section");

            thumbnailDiv.innerHTML = `
                <!-- Using Bootstrap's thumbnail and caption to style the thumbnail -->
                <div class="thumbnail">
                    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank"><img src="${thumbnailUrl}" alt="${title}" class="img-responsive"></a>
                    <div class="caption">
                        <h3>${title}</h3>
                        <p>
                            <a href="#" class="btn btn-primary" role="button" onclick="saveForLater('${title}', '${thumbnailUrl}', '${videoId}');">Save for later</a>
                            <a href="#" class="btn btn-secondary" role="button" onclick="like('${videoId}')">Like</a>
                            <a href="#" class="btn btn-info" role="button" onclick="showComments('${videoId}')">Comments</a>
                        </p>
                        <div class="likes" id="likes-${videoId}"></div>
                            <div class="comments" id="comments-${videoId}">
                                <h4>Comments</h4>
                                <ul></ul>
                                <form>
                                    <div class="form-group">
                                        <label for="comment-input">Add Comment:</label>
                                        <input type="text" class="form-control" id="comment-input-${videoId}">
                                    </div>
                                    <button type="submit" class="btn btn-primary" onclick="addComment(event,'${videoId}')">Submit</button>
                                </form>
                            </div>     
                    </div>
                </div>    
            `
            console.log(thumbnailDiv);
            ;

            //Display the likes and comments for a video
            const likesDiv = thumbnailDiv.querySelector(`#likes-${videoId}`);
            const commentsUl = thumbnailDiv.querySelector(`#comments-${videoId} ul`);
            // displayLikesAndComments(videoId, likesDiv, commentsUl);
            displayLikesAndComments(videoId);
        });
    })
    .catch((error) => console.error(error));
}

getVideos();

//FUNCTIONS

//Function for save for later.
function saveForLater(title, thumbnailUrl, videoId) {
    savedVideos.push({ title, thumbnailUrl, videoId});
    window.localStorage.setItem("savedVideos", JSON.stringify(savedVideos));
    console.log(savedVideos);
    alert(`Video saved for later. You have ${savedVideos.length} videos saved for later.`);
}

//Function to display likes and comments for a video.
function displayLikesAndComments(videoId) {
    const likes = localStorage.getItem(`likes-${videoId}`) || 0;
    const comments = localStorage.getItem(`comments-${videoId}`) || [];
    const likesDiv = document.querySelector(`#likes-${videoId}`);
    if (likesDiv) {
        likesDiv.innerHTML = `<p>Likes: ${likes}</p>`;
    }
    const commentsDiv = document.querySelector(`#comments-${videoId}`);
    if (commentsDiv) {
        commentsDiv.innerHTML = "";
        comments.forEach((comment) => {
            const commentNode = document.createElement("div");
            commentNode.innerHTML = `<p>${comment}</p>`;
            commentsDiv.appendChild(commentNode);
        });
    }
}

//Function to add a comment to a video
function addComment(event, videoId) {
    event.preventDefault();
    const commentInput = document.querySelector(`#comment-input-${videoId}`);
    if (!commentInput) {
        console.error(`Input element not found for video ID: ${videoId}`);
        return;
    }
    const comment = commentInput.value;
    let comments = localStorage.getItem(`comments-${videoId}`);
    if(!comments) {
        comments = [];
    } else {
        comments = JSON.parse(comments);
    }
    comments.push(comment);
    localStorage.setItem(`comments-${videoId}`, JSON.stringify(comments));
    const commentsUl = document.querySelector(`#comments-${videoId} ul`);
    if (!commentsUl) {
        console.error(`Comments UL element not found for video ID: ${videoId}`);
        return;
    }
    commentsUl.innerHTML += `<li>${comment}</li>`;
    commentInput.value = "";
}

//Function to show comments for a video
function showComments(videoId) {
    const commentsUl = document.querySelector(`#comments-${videoId} ul`);
    let comments = localStorage.getItem(`comments-${videoId}`);
    if (!comments) {
        comments = [];
    } else {
        comments = JSON.parse(comments);
    }
    if (comments.length === 0) {
        commentsUl.innerHTML = "<li>No comments yet.</li>";
    } else {
        commentsUl.innerHTMl = comments.map(comment => `<li>${comment}</li>`).join("");
    }
}

//Function to like a video
function like(videoId) {
    let likes = localStorage.getItem(`likes-${videoId}`);
    if(!likes) {
        likes = 0;
    }
    likes++
    localStorage.setItem(`likes-${videoId}`, likes);
    const likesDiv = document.querySelector(`#likes-${videoId}`);
    likesDiv.innerHTML =`<p>Likes: </p>`;
}