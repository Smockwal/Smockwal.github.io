import { options, opts } from "../../lib/source/options.js";



describe(`options`, () => {

    afterEach(() => {
		options.clear();
	});

	it(`constructor_00`, () => {
        //expect(options._data.size).toBe(3);
	});

    it(`category_00`, () => {
        expect(opts.GENERAL).toBe(`general`);
        expect(opts.PREPRO).toBe(`prepro`);
        expect(opts.FORMATTER).toBe(`formatter`);
	});

    it(`has_00`, () => {
        expect(options.has(opts.GENERAL)).toBeTrue();
        expect(options.has(opts.PREPRO)).toBeTrue();
        expect(options.has(opts.FORMATTER)).toBeTrue();

        expect(options.has("b")).toBeFalse();
        expect(options.has(opts.GENERAL,"b")).toBeFalse();
	});

    it(`has_01`, () => {
        expect(options.has("b")).toBeFalse();
        expect(options.has(opts.GENERAL,"b")).toBeFalse();
	});

    it(`has_02`, () => {
        options.set(opts.GENERAL, "a", 300);
        expect(options.has(opts.GENERAL,"a")).toBeTrue();
	});

    it(`get_00`, () => {
        options.set(opts.GENERAL, "a", 300);
        expect(options.has(opts.GENERAL,"a")).toBeTrue();
        expect(options.get(opts.GENERAL,"a")).toBe(300);
	});

    it(`get_01`, () => {
        options.set(opts.GENERAL, "a", 300);
        expect(options.get(opts.GENERAL)).toBe(``);
        expect(options.get(opts.GENERAL, ``)).toBe(``);
        expect(options.get(opts.GENERAL, `b`)).toBe(``);
	});


    it(`set_00`, () => {
        options.set(opts.GENERAL, "a", 300);
        expect(options.get(opts.GENERAL,"a")).toBe(300);
	});

    it(`set_01`, () => {
        options.set(opts.GENERAL, 300);
        expect(options.get(opts.GENERAL)).toBe(``);
	});

    it(`set_02`, () => {
        options.set(`a`, `b`, 5);
        expect(options.get(`a`, `b`)).toBe(5);
	});

    it(`clear_00`, () => {
        options.set(opts.GENERAL, "a", 300);
        options.clear();
        expect(options.get(opts.GENERAL, `a`)).toBe(``);

        expect(options.has(opts.GENERAL)).toBeTrue();
        expect(options.has(opts.PREPRO)).toBeTrue();
        expect(options.has(opts.FORMATTER)).toBeTrue();
	});
    
});

describe('opts', () => {
    let opt;

    beforeEach(() => {
        opt = new opts();
    });

    it('should initialize with default empty maps', () => {
        expect(opt.get(opts.GENERAL, 'test')).toBe('');
        expect(opt.get(opts.PREPRO, 'test')).toBe('');
        expect(opt.get(opts.FORMATTER, 'test')).toBe('');
    });

    it('should return correct static values', () => {
        expect(opts.GENERAL).toBe('general');
        expect(opts.PREPRO).toBe('prepro');
        expect(opts.FORMATTER).toBe('formatter');
    });

    describe('get method', () => {
        it('should return value if it exists', () => {
            opt.set(opts.GENERAL, 'test', 'value');
            expect(opt.get(opts.GENERAL, 'test')).toBe('value');
        });

        it('should return empty string if value does not exist', () => {
            expect(opt.get(opts.GENERAL, 'nonexistent')).toBe('');
        });

        it('should return empty string for empty category', () => {
            expect(opt.get('', 'test')).toBe('');
        });
    });

    describe('set method', () => {
        it('should set value correctly', () => {
            opt.set(opts.GENERAL, 'test', 'value');
            expect(opt.get(opts.GENERAL, 'test')).toBe('value');
        });

        it('should create new category if it does not exist', () => {
            opt.set('newCategory', 'test', 'value');
            expect(opt.get('newCategory', 'test')).toBe('value');
        });

        it('should not set value for empty category or name', () => {
            opt.set('', 'test', 'value');
            expect(opt.get('', 'test')).toBe('');

            opt.set(opts.GENERAL, '', 'value');
            expect(opt.get(opts.GENERAL, '')).toBe('');
        });
    });

    describe('has method', () => {
        it('should return true if category and name exist', () => {
            opt.set(opts.GENERAL, 'test', 'value');
            expect(opt.has(opts.GENERAL, 'test')).toBe(true);
        });

        it('should return false if category does not exist', () => {
            expect(opt.has('nonexistent', 'test')).toBe(false);
        });

        it('should return true if only category exists', () => {
            expect(opt.has(opts.GENERAL)).toBe(true);
        });

        it('should return false for empty category', () => {
            expect(opt.has('', 'test')).toBe(false);
        });
    });

    describe('clear method', () => {
        it('should clear all data and reset to default state', () => {
            opt.set(opts.GENERAL, 'test', 'value');
            opt.clear();
            expect(opt.get(opts.GENERAL, 'test')).toBe('');
            expect(opt.get(opts.PREPRO, 'test')).toBe('');
            expect(opt.get(opts.FORMATTER, 'test')).toBe('');
        });
    });

    describe('edge cases', () => {
        it('should handle null and undefined inputs gracefully', () => {
            expect(opt.get(null, 'test')).toBe('');
            expect(opt.get(undefined, 'test')).toBe('');

            expect(opt.set(null, 'test', 'value')).toBe(opt);
            expect(opt.set(undefined, 'test', 'value')).toBe(opt);
            //console.log(opt);

            expect(opt.has(null, 'test')).toBe(false);
            expect(opt.has(undefined, 'test')).toBe(false);
        });

        it('should handle special characters in category and name', () => {
            opt.set('cat@#$', 'name!%^&*', 'value');
            expect(opt.get('cat@#$', 'name!%^&*')).toBe('value');
            expect(opt.has('cat@#$', 'name!%^&*')).toBe(true);
        });
    });
});


