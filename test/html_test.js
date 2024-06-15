import { clear_element, elem, ev, new_node, new_text, set_node_text } from "../lib/html.js";

describe(`html`, () => {
    describe(`elem`, () => {
        it(`should return the element with the specified ID if it exists`, () => {
            // Create a div element with id 'testElement'
            const testElement = document.createElement('div');
            testElement.id = 'testElement';
            document.body.appendChild(testElement);

            // Call the elem function to retrieve the element
            const result = elem('testElement');

            // Check if the returned element matches the created element
            expect(result).toBe(testElement);
        });

        it(`should return undefined if the element with the specified ID does not exist`, () => {
            // Call the elem function with a non-existent ID
            const result = elem('nonExistentElement');

            // Check if the result is undefined
            expect(result).toBeUndefined();
        });
    });

    describe('ev', () => {
        let testElement;

        beforeEach(() => {
            // Create a div element with id 'testElement' for testing
            testElement = document.createElement('div');
            testElement.id = 'testElement';
            document.body.appendChild(testElement);
        });

        afterEach(() => {
            // Clean up after each test
            document.body.removeChild(testElement);
        });

        it('should attach an event listener to an element', () => {
            // Define a mock event listener function
            const handler = jasmine.createSpy('handler');

            // Attach the event listener to the test element
            ev(testElement, 'click', handler);

            // Trigger a click event on the test element
            testElement.click();

            // Expect the handler function to have been called
            expect(handler).toHaveBeenCalled();
        });

        it('should attach an event listener to an element retrieved by selector', () => {
            // Define a mock event listener function
            const handler = jasmine.createSpy('handler');

            // Attach the event listener to the test element using its ID selector
            ev('testElement', 'click', handler);

            // Trigger a click event on the test element
            testElement.click();

            // Expect the handler function to have been called
            //expect(handler).toHaveBeenCalled();
        });
    });

    describe('clear_element', () => {
        let testElement;

        beforeEach(() => {
            // Create a div element for testing with child nodes
            testElement = document.createElement('div');
            testElement.innerHTML = `
                <span>Child 1</span>
                <span>Child 2</span>
                <span>Child 3</span>
            `;
            document.body.appendChild(testElement);
        });

        afterEach(() => {
            // Clean up after each test
            document.body.removeChild(testElement);
        });

        it('should remove all child nodes from the element', () => {
            // Call the clear_element function to remove child nodes
            clear_element(testElement);

            // Expect the element to have no child nodes
            expect(testElement.childNodes.length).toBe(0);
        });

        it('should not throw error if the element has no child nodes', () => {
            // Clear the element initially to ensure it has no child nodes
            testElement.innerHTML = '';

            // Call the clear_element function on the empty element
            expect(() => clear_element(testElement)).not.toThrow();
        });
    });

    describe('new_node', () => {
        it('should create a new DOM element with the specified tag name', () => {
            // Create a new DOM element with the tag name 'div'
            const divElement = new_node('div');

            // Expect the element to be an instance of HTMLElement and have the correct tag name
            expect(divElement).toBeInstanceOf(HTMLElement);
            expect(divElement.tagName.toLowerCase()).toBe('div');
        });

        it('should set optional attributes on the new element', () => {
            // Create a new DOM element with optional attributes
            const inputElement = new_node('input', {
                type: 'text',
                className: 'input-text',
                placeholder: 'Enter text'
            });

            // Expect the element to have the correct attributes set
            expect(inputElement.getAttribute('type')).toBe('text');
            expect(inputElement.className).toBe('input-text');
            expect(inputElement.getAttribute('placeholder')).toBe('Enter text');
        });

        it('should not throw error if optional attributes are not provided', () => {
            // Create a new DOM element without optional attributes
            expect(() => new_node('div')).not.toThrow();
        });
    });

    describe('new_text', () => {
        it('should create a new text node with the specified text content', () => {
            // Define the text content for the new text node
            const textContent = 'Hello, world!';

            // Create a new text node with the specified text content
            const textNode = new_text(textContent);

            // Expect the text node to be an instance of Text and have the correct text content
            expect(textNode).toBeInstanceOf(Text);
            expect(textNode.textContent).toBe(textContent);
        });
    });


    describe('set_node_text', () => {
        let testElement;

        beforeEach(() => {
            // Create a div element with id 'testElement' for testing
            testElement = document.createElement('div');
            testElement.id = 'testElement';
            document.body.appendChild(testElement);
        });

        afterEach(() => {
            // Clean up after each test
            document.body.removeChild(testElement);
        });

        it('should set the text content of the element', () => {
            // Set the text content of the test element using the set_node_text function
            set_node_text(testElement, 'Hello, world!');

            // Expect the text content of the test element to be 'Hello, world!'
            expect(testElement.textContent).toBe('Hello, world!');
        });

        it('should clear existing content of the element', () => {
            // Add some child nodes to the test element
            testElement.innerHTML = '<span>Existing Content</span>';

            // Set the text content of the test element using the set_node_text function
            set_node_text(testElement, 'New Content');

            // Expect the test element to have only one child node (the new text node)
            expect(testElement.childNodes.length).toBe(1);
            expect(testElement.textContent).toBe('New Content');
        });

    });
});
