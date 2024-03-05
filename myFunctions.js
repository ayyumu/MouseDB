require('dotenv').config();
const ytKey = process.env.YT_KEY;
const axios = require('axios');

async function videoSearch(search, maxResults) {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search?part=snippet&key=" + ytKey + "&maxResults=" + maxResults + "&type=video&q=" + search);

    response.data.items.forEach(item => {
        return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    });
}

module.exports = { videoSearch };