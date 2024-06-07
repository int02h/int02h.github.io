const popupOverlay = document.getElementById('popup-overlay');
const popupContent = document.getElementById('popup-content');

// Function to open the popup
function showPopup(html) {
    popupOverlay.style.display = 'block';
    popupContent.innerHTML = html
    pauseGame()
}

// Function to close the popup
function closePopup() {
    popupOverlay.style.display = 'none';
    popupContent.innerHTML = ""
    resumeGame()
}

// Close the popup when clicking outside the popup content
popupOverlay.addEventListener('click', function(event) {
  if (event.target === popupOverlay) {
    closePopup();
  }
});