/**
 * Get DOM element by selector
 *
 * @return {HTMLElement | null}
 * @private
 */
const _getElement = function(selector) {
    return document.querySelector(selector);
}

/**
 * Array of editor's UI buttons
 *
 * @return {Array}
 * @private
 */
const _getButtonsArray = function() {
    return [
        {
            selector: '.js-h1',
            command: 'formatBlock',
            value: '<h1>'
        },
        {
            selector: '.js-h2',
            command: 'formatBlock',
            value: '<h2>'
        },
        {
            selector: '.js-bold',
            command: 'bold'
        },
        {
            selector: '.js-italic',
            command: 'italic'
        }
    ];
};

/**
 * Add buttons' listeners and exec commands of the editor
 *
 * @param {HTMLElement} button - each button
 * @param {String} command - for execCommand
 * @param {String | undefined} value - for command
 * @private
 */
const _addButtonsListeners = function(button, { command, value }) {
    button.addEventListener('click', function() {
        document.execCommand(command, false, value || null);
    });
};

/**
 * Get buttons array and iterate it when it has buttons
 * Send each button to the method _addButtonsListeners
 *
 * @private
 */
const _getButtons = function() {
    const buttons = _getButtonsArray() || [];

    if (buttons.length) {
        buttons.map(function(buttonProperties) {
            const button = _getElement(buttonProperties.selector);

            if (button) {
                _addButtonsListeners(button, buttonProperties);
            }
        });
    }
};

/**
 * Initialization of the WYSIWYG script
 * Run internal methods
 *
 * @return {Boolean} false only when the Edit Area doesn't exist or UI buttons have not found
 */
const initWysiwyg = function() {
    if (!_getElement('.js-edit') || !_getButtonsArray().length) {
        return false;
    }

    _getButtons();
};

/**
 * Window listener when DOM Content (all HTML elements) will be loaded
 */
window.addEventListener('DOMContentLoaded', initWysiwyg);