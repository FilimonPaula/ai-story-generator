const form = document.querySelector('#create-story');
const messageEl = document.querySelector('#message');
let names = document.querySelector('#c-names');
const loading = document.querySelector('#loading');
const story = document.querySelector('#story');
const flipbook = document.querySelector('#flipbook');

const handleSubmit = async(event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const entries = formData.entries();
    var formBody = [];

    for (var property of entries) {
        var encodedKey = encodeURIComponent(property[0]);
        var encodedValue = encodeURIComponent(property[1]);
        formBody.push(encodedKey + "=" + encodedValue);
    }

    formBody = formBody.join("&");
    loading.classList.remove("d-none");
    story.innerHTML = '';
    try {
        let response = await fetch('http://localhost:3025/createStory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody,
        });
        const result = await response.json();
        loading.classList.add("d-none");
        flipbook.classList.remove("d-none");
        createBook(result.story);
        $("#flipbook").turn({
            width: 1000,
            height: 800,
            autoCenter: true
        });
    } catch (error) {
        loading.classList.add("d-none");
        flipbook.classList.remove("d-none");
        showMessage(error.message, 'danger');
    }
};



const showMessage = (message, type = 'success') => {
    messageEl.innerHTML = `
        <div class="alert alert-${type}" role="alert">
        ${message}
        </div>
    `;
};

const getStoryList = () => {
    fetch('http://localhost:3025/story-list/')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch(function(error) {
        console.log(error);
    });
}

getStoryList();

const splitTextIntoChunks = (text, chunkSize = 200) => {
    // Split the text into words
    const words = text.split(/\s+/);

    // Initialize the array to hold chunks of words
    const chunks = [];

    // Iterate over the words and create chunks of specified size
    for (let i = 0; i < words.length; i += chunkSize) {
        const chunk = words.slice(i, i + chunkSize);
        chunks.push(chunk.join(' '));
    }

    return chunks;
}

const createBook = (story = '') => {
    const chunks = splitTextIntoChunks(story);
    chunks.forEach((element, i) => {
        $('#flipbook').append('<div class="turn-page"><div>' + element + '</div><div class="page-number">' + (i + 2) + '</div></div>');

    });
    $('#flipbook').append('<div class="hard the-end"> <span>The end!</span> </div>');
}



form.addEventListener('submit', handleSubmit);