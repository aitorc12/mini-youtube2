document.addEventListener("DOMContentLoaded", () => {
    fetch('/videos')
        .then(response => response.json())
        .then(videos => {
            const videoList = document.getElementById('video-list');
            videos.forEach(video => {
                const videoItem = document.createElement('div');
                videoItem.classList.add('video-item');
                videoItem.onclick = () => openModal(video.filename);

                videoItem.innerHTML = `
                    <video class="video-thumbnail" src="/uploads/${video.filename}" controls></video>
                    <div class="video-info">
                        <h3>${video.title}</h3>
                        <p>${video.description}</p>
                    </div>
                `;
                videoList.appendChild(videoItem);
            });
        });
});

function openModal(filename) {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    video.src = `/uploads/${filename}`;
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('videoModal');
    const video = document.getElementById('modalVideo');
    video.pause();
    video.src = '';
    modal.style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('videoModal');
    if (event.target === modal) {
        closeModal();
    }
}
