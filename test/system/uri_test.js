import { error, type_error } from "../../lib/error.js";
import { uri } from "../../lib/system/uri.js";


const HAS_FILE_NAME = 1;
const HAS_DIR = 2;
const IS_DIR = 4;

describe('uri class', () => {
    let uriInstance;

    beforeEach(() => {
        uriInstance = new uri('path/to/file.txt');
    });

    describe('constructor', () => {
        it('should throw an error if the input is not a string', () => {
            expect(() => new uri(123)).toThrow(new type_error(`uri must be a string.`));
        });

        it('should throw an error if the input string is empty', () => {
            expect(() => new uri('')).toThrow(new error(`uri must not be empty.`));
        });
    });

    describe('path property', () => {
        it('should return the full path of the URI', () => {
            expect(uriInstance.path).toBe('path/to/file.txt');
        });
    });

    describe('file_name property', () => {
        it('should return the name of the file without the extension', () => {
            expect(uriInstance.file_name).toBe('file');
        });

        it('should throw an error if the URI is not a file', () => {
            const dirUriInstance = new uri('path/to/directory');
            expect(dirUriInstance.flags).toBe(HAS_DIR | IS_DIR);
            expect(() => dirUriInstance.file_name).toThrow(new error(`The uri is not a file.`));
        });
    });

    describe('file_full_name property', () => {
        it('should return the full name of the file including the extension', () => {
            expect(uriInstance.file_full_name).toBe('file.txt');
        });

        it('should throw an error if the URI is not a file', () => {
            const dirUriInstance = new uri('path/to/directory');
            expect(() => dirUriInstance.file_full_name).toThrow(new error(`The uri is not a file: "path/to/directory/"`));
        });
    });

    describe('dir_name property', () => {
        it('should return the name of the directory', () => {
            expect(uriInstance.dir_name).toBe('to');

            const dirUriInstance = new uri('path/to/directory');
            expect(dirUriInstance.dir_name).toBe('directory');
        });

        it('should throw an error if the URI has no directory', () => {
            const a = new uri('file.txt');
            expect(() => a.dir_name).toThrow(new error(`The uri has no directory.`));
        });
    });

    describe('dir_path property', () => {
        it('should return the path of the directory', () => {
            expect(uriInstance.dir_path).toBe('path/to/');

            const dirUriInstance = new uri('path/to/directory');
            expect(dirUriInstance.dir_path).toBe('path/to/directory/');
        });

        it('should throw an error if the URI has no directory', () => {
            const dirUriInstance = new uri('file.txt');
            expect(() => dirUriInstance.dir_path).toThrow(new error(`The uri has no directory.`));
        });
    });

    describe('ext property', () => {
        it('should return the extension of the file', () => {
            expect(uriInstance.ext).toBe('.txt');
        });

        it('should throw an error if the URI is not a file', () => {
            const dirUriInstance = new uri('path/to/directory');
            expect(() => dirUriInstance.ext).toThrow(new error(`The uri is not a file.`));
        });
    });

    describe('static std method', () => {
        it('should return the standardized path of the input string', () => {
            expect(uri.std('path\\to\\file.txt')).toBe('path/to/file.txt');
            expect(uri.std('path/to')).toBe('path/to/');
        });

        it('should throw an error if the input is not a string', () => {
            expect(() => uri.std(123)).toThrow(new type_error(`path must be a string.`));
        });
    });
});