import { component } from './component.js';

export class llvar extends component {
    constructor(tok) {
        super(tok);
    }

    /**
     * @returns {String} The kind of component, in this case, 'llvar'.
     */
    get kind() {
        return 'llvar';
    }

    /**
     * @returns {String} The type of the token.
     */
    get type() {
        return this.tok.prev.str;
    }

    /**
     * Returns the default value for the type.
     * @returns {String} The default value for the type.
     */
    default() {
        switch (this.type) {
            case 'integer':
                return '0';
            case 'float':
                return '0.0';
            case 'string':
            case 'key':
                return '""';
            case 'vector':
                return '<0,0,0>';
            case 'quaternion':
            case 'rotation':
                return '<0,0,0,1>';
            case 'list':
                return '[]';
            default:
                return 'unknown';
        }
    }

    /**
     * Checks if the variable can be used as a specified type.
     * @param {String} str The type to check against.
     * @returns {Boolean} True if it can be used as the specified type, otherwise false.
     */
    can_be_use_as(str) {
        let this_type = this.type;
        if (this_type === 'rotation') this_type = 'quaternion';
        if (str === 'rotation') str = 'quaternion';

        if (this_type === 'integer' && str === 'float') return true;
        if ((this_type === 'key' && str === 'string') || (this_type === 'string' && str === 'key')) return true;

        return this_type === str;
    }
}
