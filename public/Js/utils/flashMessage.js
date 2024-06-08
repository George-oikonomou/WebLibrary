import { CONFIG } from '../config.js';
import { ELEMENTS } from '../elements.js';
import { state } from '../state.js';

export const showFlashMessage = (message, isError = false) => {
    ELEMENTS.flashMessage.innerHTML = message;
    ELEMENTS.flashMessage.className = `flash-message${isError ? ' error' : ''}`;
    ELEMENTS.flashMessage.style.display = 'block';

    clearTimeout(state.hideTimeout);
    ELEMENTS.flashMessage.onmouseover = () => clearTimeout(state.hideTimeout);
    ELEMENTS.flashMessage.onmouseleave = () => hideFlashMessageWithDelay();
    hideFlashMessageWithDelay();
};

const hideFlashMessageWithDelay = () => {
    state.hideTimeout = setTimeout(hideFlashMessage, CONFIG.FLASH_HIDE_DELAY);
};

const hideFlashMessage = () => {
    ELEMENTS.flashMessage.style.transition = `opacity 1s ease-out`;
    ELEMENTS.flashMessage.style.opacity = '0';
    setTimeout(() => {
        ELEMENTS.flashMessage.style.display = 'none';
        ELEMENTS.flashMessage.style.opacity = '1';
    }, CONFIG.FLASH_FADE_OUT_DURATION);
};
