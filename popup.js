const popupOverlay = document.getElementById('popup-overlay');

// Function to open the popup
function openPopup() {
    popupOverlay.style.display = 'block';
    pauseGame()
}

// Function to close the popup
function closePopup() {
    popupOverlay.style.display = 'none';
    resumeGame()
}

// Close the popup when clicking outside the popup content
popupOverlay.addEventListener('click', function(event) {
  if (event.target === popupOverlay) {
    closePopup();
  }
});