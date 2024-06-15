import { classes, flag, kind_of, type_of } from '../lib/global.js';
class Base {
    constructor(name) {
        this.name = name;
    }
    greet() {
        return `Hello, ${this.name}`;
    }
}

class Mixin1 {
    constructor(age) {
        this.age = age;
    }
    get_age() {
        return this.age;
    }
}

class Mixin2 {
    constructor(country) {
        this.country = country;
    }
    get_country() {
        return this.country;
    }
}

describe('global', () => {
    describe('flag.to_string', () => {
        it('should return "[ NONE ]" for an invalid flag', () => {
            const result = flag.to_string(flag.INVALID_FLAG)
            expect(result).toBe('[ NONE ]')
        })

        it('should correctly identify a single flag', () => {
            const result = flag.to_string(flag.COMMENT_FLAG)
            expect(result).toBe('[ COMMENT_FLAG ]')
        })

        it('should correctly identify multiple flags', () => {
            const flags = flag.COMMENT_FLAG | flag.NAME_FLAG | flag.NUMBER_FLAG
            const result = flag.to_string(flags)
            expect(result).toBe('[ COMMENT_FLAG | NAME_FLAG | NUMBER_FLAG ]')
        })

        it('should correctly identify all flags', () => {
            const flags = flag.COMMENT_FLAG | flag.NAME_FLAG | flag.NUMBER_FLAG | flag.SYMBOL_FLAG | flag.STRING_FLAG |
                flag.TYPE_FLAG | flag.VARIABLE_FLAG | flag.USER_FUNC_FLAG | flag.DEF_FUNC_FLAG | flag.EVENT_FLAG |
                flag.CONTROL_FLAG | flag.OPERATOR_FLAG | flag.VECTOR_OP_FLAG | flag.VECTOR_CL_FLAG |
                flag.QUAT_OP_FLAG | flag.QUAT_CL_FLAG | flag.LIST_OP_FLAG | flag.LIST_ENTRY | flag.LIST_CL_FLAG |
                flag.DEL_FLAG | flag.EOL_FLAG | flag.STATE_NAME_FLAG | flag.CASTING_FLAG | flag.VALIDATE_FLAG |
                flag.USED_FLAG | flag.ASSIGNED_FLAG | flag.INITED_FLAG | flag.DEF_INIT_FLAG | flag.CONST_FLAG | flag.PARAM_FLAG

            const result = flag.to_string(flags)
            expect(result).toBe('[ COMMENT_FLAG | NAME_FLAG | NUMBER_FLAG | SYMBOL_FLAG | STRING_FLAG | TYPE_FLAG | VARIABLE_FLAG | USER_FUNC_FLAG | DEF_FUNC_FLAG | EVENT_FLAG | CONTROL_FLAG | OPERATOR_FLAG | VECTOR_OP_FLAG | VECTOR_CL_FLAG | QUAT_OP_FLAG | QUAT_CL_FLAG | LIST_OP_FLAG | LIST_ENTRY | LIST_CL_FLAG | DEL_FLAG | EOL_FLAG | STATE_NAME_FLAG | CASTING_FLAG | VALIDATE_FLAG | USED_FLAG | ASSIGNED_FLAG | INITED_FLAG | DEF_INIT_FLAG | CONST_FLAG | PARAM_FLAG ]')
        })

        it('should return the correct string for combined flags', () => {
            const flags = flag.COMMENT_FLAG | flag.VECTOR_OP_FLAG | flag.DEF_INIT_FLAG
            const result = flag.to_string(flags)
            expect(result).toBe('[ COMMENT_FLAG | VECTOR_OP_FLAG | DEF_INIT_FLAG ]')
        })

        it('should return "[ NONE ]" for zero input', () => {
            const result = flag.to_string(0)
            expect(result).toBe('[ NONE ]')
        })
    })

    describe('classes', () => {
        it('should create a class that extends the base class', () => {
            const MixedClass = classes(Base);
            const instance = new MixedClass('Alice');
            expect(instance.name).toBe('Alice');
            expect(instance.greet()).toBe('Hello, Alice');
        });

        it('should apply mixins to the class', () => {
            const MixedClass = classes(Base, Mixin1, Mixin2);
            const instance = new MixedClass('Alice', 25, 'USA');
            instance.age = 25;
            instance.country = 'USA';

            expect(instance.name).toBe('Alice');
            expect(instance.age).toBe(25);
            expect(instance.country).toBe('USA');
            expect(instance.greet()).toBe('Hello, Alice');
            expect(instance.get_age()).toBe(25);
            expect(instance.get_country()).toBe('USA');
        });

        it('should apply static properties and methods from mixins', () => {
            Mixin1.static_method = () => 'static method';
            const MixedClass = classes(Base, Mixin1);
            expect(MixedClass.static_method()).toBe('static method');
        });

        it('should not override base class properties with mixin properties', () => {
            Base.prototype.get_age = () => 'base class age';
            const MixedClass = classes(Base, Mixin1);
            const instance = new MixedClass('Alice');
            instance.age = 25;

            expect(instance.get_age()).toBe(25);
        });

        it('should work with no mixins', () => {
            const MixedClass = classes(Base);
            const instance = new MixedClass('Alice');
            expect(instance.name).toBe('Alice');
            expect(instance.greet()).toBe('Hello, Alice');
        });
    });

    describe('type_of function', () => {
        it('should return "string" for a string', () => {
            expect(type_of('Hello, World!')).toBe('string');
        });

        it('should return "number" for a number', () => {
            expect(type_of(123)).toBe('number');
        });

        it('should return "boolean" for a boolean', () => {
            expect(type_of(true)).toBe('boolean');
        });

        it('should return "object" for an object', () => {
            expect(type_of({ name: 'John' })).toBe('object');
        });

        it('should return "array" for an array', () => {
            expect(type_of([1, 2, 3])).toBe('array');
        });

        it('should return "function" for a function', () => {
            function greet() {
                return 'Hello, World!';
            }
            expect(type_of(greet)).toBe('function');
        });

        it('should return "null" for null', () => {
            expect(type_of(null)).toBe('null');
        });

        it('should return "undefined" for undefined', () => {
            expect(type_of(undefined)).toBe('undefined');
        });

        it('should return the type of a custom object with a "type" property', () => {
            class MyObject {
                constructor() {
                    this.type = 'custom';
                }
            }
            expect(type_of(new MyObject())).toBe('custom');
        });

        it('should return the type of a custom object with a "type" property and other properties', () => {
            class MyObject {
                constructor() {
                    this.type = 'custom';
                    this.name = 'John';
                }
            }
            expect(type_of(new MyObject())).toBe('custom');
        });

        it('should return the type of a custom object without a "type" property', () => {
            class MyObject {
                constructor() {
                    this.name = 'John';
                }
            }
            expect(type_of(new MyObject())).toBe('MyObject');
        });

        it('should return the type of a custom object with a "type" property set to null', () => {
            class MyObject {
                constructor() {
                    this.type = null;
                }
            }
            expect(type_of(new MyObject())).toBe('null');
        });

        it('should return the type of a custom object with a "type" property set to undefined', () => {
            class MyObject {
                constructor() {
                    this.type = undefined;
                }
            }
            expect(type_of(new MyObject())).toBe('undefined');
        });

        it('should return the type of a custom object with a "type" property set to a number', () => {
            class MyObject {
                constructor() {
                    this.type = 123;
                }
            }
            expect(type_of(new MyObject())).toBe(123);
        });

        it('should return the type of a custom object with a "type" property set to a boolean', () => {
            class MyObject {
                constructor() {
                    this.type = true;
                }
            }
            expect(type_of(new MyObject())).toBe(true);
        });

        it('should return the type of a custom object with a "type" property set to an array', () => {
            class MyObject {
                constructor() {
                    this.type = [1, 2, 3];
                }
            }
            expect(type_of(new MyObject())).toEqual([1, 2, 3]);
        });

    });


    describe('kind_of function', () => {

        it('should return the value of the "kind" property for objects with a "kind" property', () => {
            const obj = { kind: 'custom' };
            expect(kind_of(obj)).toEqual('custom');
        });

        it('should call the "type_of" function for objects without a "kind" property', () => {
            const obj = {};
            window.type_of = type_of;
            spyOn(window, 'type_of').and.returnValue('object');
            expect(kind_of(obj)).toEqual('object');
        });

        describe('edge cases', () => {
            it('should handle objects with a "kind" property set to a number', () => {
                const obj = { kind: 123 };
                expect(kind_of(obj)).toEqual(123);
            });

            it('should handle objects with a "kind" property set to a boolean', () => {
                const obj = { kind: true };
                expect(kind_of(obj)).toEqual(true);
            });

            it('should handle objects with a "kind" property set to a non-empty string', () => {
                const obj = { kind: 'custom' };
                expect(kind_of(obj)).toEqual('custom');
            });

        });
    });
})




