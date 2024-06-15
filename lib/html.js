import { NULL, type_of} from './global.js';
/**
 * Returns the DOM element with the specified ID, or undefined if not found.
 * 
 * @param {string} id - The ID of the element to retrieve.
 * @returns {HTMLElement|undefined} - The DOM element with the specified ID, or undefined if not found.
 */
export const elem = (id, from) => {
    // Attempt to retrieve the element by its ID, if not found return undefined
    return (from || document).getElementById(id) || NULL;
};

/**
 * Attaches an event listener to an element or selector.
 * 
 * @param {string|HTMLElement} target - The element or selector to attach the event listener to.
 * @param {string} event - The name of the event to listen for.
 * @param {EventListener} fn - The function to call when the event is triggered.
 */
export const ev = (target, event, fn) => {
    // If the target is a string, assume it's a selector and retrieve the corresponding element
    const element = (type_of(target) === `string`) ? elem(target) : target;

    // Attach the event listener to the element
    element.addEventListener(event, fn, false);
};

/**
 * Removes all child nodes from a given element.
 * 
 * @param {HTMLElement} el - The element from which to remove child nodes.
 */
export const clear_element = (el) => {
    // Loop through all child nodes of the element and remove them one by one
    while (el.firstChild) {
        el.removeChild(el.firstChild);
    }
};

/**
 * Creates a new DOM element with optional attributes.
 * 
 * @param {string} tagname - The tag name of the new element.
 * @param {Object} [opt] - Optional attributes to set on the new element.
 * @returns {HTMLElement} - The newly created DOM element.
 */
export const new_node = (tagname, opt) => {
    // Create a new DOM element with the specified tag name
    const el = document.createElement(tagname);
    
    // If optional attributes are provided, set them on the element
    if (opt) {
        for (const [key, value] of Object.entries(opt)) {
            // Check if the attribute is 'className', set it directly as 'className'
            if (key === 'className') {
                el.className = value;
            } else {
                // Set other attributes using setAttribute
                el.setAttribute(key, value);
            }
        }
    }

    return el;
};

/**
 * Creates a new text node with the specified text content.
 * 
 * @param {string} text - The text content of the new text node.
 * @returns {Text} - The newly created text node.
 */
export const new_text = text => document.createTextNode(text);

/**
 * Sets the text content of a DOM element.
 * 
 * @param {string|HTMLElement} e - The element or selector to set the text content of.
 * @param {string} value - The text content to set.
 */
export const set_node_text = (e, value) => {
    // If the first argument is a string, assume it's a selector and retrieve the corresponding element
    const el = (type_of(e) === `string`) ? elem(e) : e;
    
    // Clear the existing content of the element
    clear_element(el);

    // Create a new text node with the specified value and append it to the element
    el.appendChild(new_text(value));
};
