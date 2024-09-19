document.addEventListener("DOMContentLoaded", function() {
  // Add the fade-in class to trigger the transition
  document.body.classList.add('fade-in');
  
  // Video Modal functionality
  const heartPaper = document.querySelector(".paper.heart");
  const modal = document.getElementById("video-modal");
  const closeButton = document.querySelector(".close");
  const videoPlayer = document.getElementById("video-player");
  const backgroundMusic = document.getElementById("background-music");
  
  // Open the modal when the heart paper is clicked
  heartPaper.addEventListener("click", function() {
    modal.style.display = "block";
    backgroundMusic.pause(); // Stop background music
    videoPlayer.play(); // Start video playback
  });
  
  // Close the modal when the close button is clicked
  closeButton.addEventListener("click", function() {
    modal.style.display = "none";
    videoPlayer.pause(); // Pause the video when closing
    backgroundMusic.play(); // Resume background music
  });
  
  // Close the modal if the user clicks outside of the modal content
  window.addEventListener("click", function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
      videoPlayer.pause(); // Pause the video when closing
      backgroundMusic.play(); // Resume background music
    }
  });
});

let highestZ = 1;

class Paper {
  holdingPaper = false;
  startX = 0;
  startY = 0;
  moveX = 0;
  moveY = 0;
  prevX = 0;
  prevY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  lastMoveTime = 0;

  init(paper) {
    const onMove = (e) => {
      const now = Date.now();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      // Throttle move events to improve performance
      if (now - this.lastMoveTime < 16) return; // About 60 FPS
      this.lastMoveTime = now;

      if (!this.rotating) {
        this.moveX = clientX;
        this.moveY = clientY;
        this.velX = this.moveX - this.prevX;
        this.velY = this.moveY - this.prevY;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }

        this.prevX = this.moveX;
        this.prevY = this.moveY;

        paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
      }
    };

    const onStart = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      this.startX = clientX;
      this.startY = clientY;
      this.prevX = this.startX;
      this.prevY = this.startY;
    };

    const onEnd = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    const onRotateStart = (e) => {
      e.preventDefault();
      this.rotating = true;
    };

    const onRotateEnd = () => {
      this.rotating = false;
    };

    // Mouse and touch event listeners for dragging
    paper.addEventListener('touchmove', onMove, { passive: true });
    paper.addEventListener('mousemove', onMove);

    paper.addEventListener('touchstart', onStart);
    paper.addEventListener('mousedown', onStart);

    paper.addEventListener('touchend', onEnd);
    window.addEventListener('mouseup', onEnd);

    // Two-finger rotation on touch screens
    paper.addEventListener('gesturestart', onRotateStart);
    paper.addEventListener('gestureend', onRotateEnd);

    // Right-click rotation on mouse
    paper.addEventListener('mousedown', (e) => {
      if (e.button === 2) {
        this.rotating = true;
      }
    });
  }
}

// Initialize papers
const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
