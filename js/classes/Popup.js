export class Popup {
    constructor(options = {}) {
        this.popupOverlay = options.popupOverlay;
        this.popupContent = options.popupContent;
        this.onOpenModal = options.onOpenModal;
        this.onCloseModal = options.onCloseModal;

        this.closeButton = this.popupOverlay.querySelector('#close-popup');
        this.closeButton.addEventListener('click', () => this.closePopup());
    }

    showPopup(html) {
        this.popupOverlay.style.display = 'block';
        this.popupContent.innerHTML = html;
        this.onOpenModal();
    }

    closePopup() {
        this.popupOverlay.style.display = 'none';
        this.popupContent.innerHTML = '';
        this.onCloseModal();
    }
}