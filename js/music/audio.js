document.addEventListener("DOMContentLoaded", function() {
    var audioFiles = [
        '../../media/audio/1.mp3',
        '../../media/audio/2.mp3'
    ];

    var currentIndex = 0;
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('id', 'backgroundMusic');
    audioElement.setAttribute('src', audioFiles[currentIndex]);
    audioElement.setAttribute('loop', 'loop');
    document.body.appendChild(audioElement);

    audioElement.addEventListener('ended', function() {
        currentIndex = (currentIndex + 1) % audioFiles.length;
        audioElement.src = audioFiles[currentIndex];
        audioElement.play();
    });

    audioElement.play();
});