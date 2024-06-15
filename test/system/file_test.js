import { file } from '../../lib/system/file.js';


describe('file class', () => {
    let fileObj, mockFile, now;

    beforeEach(() => {
        now = Date.now();
        mockFile = {
            lastModified: now,
            name: 'example.txt',
            webkitRelativePath: 'folder/example.txt'
        };
        fileObj = new file(new File([`foo`], `folder/example.txt`, { type: "text/plain", lastModified: now }));
    });

    describe('get last_modified', () => {
        it('should return the last modification date', () => {
            expect(fileObj.last_modified).toEqual(mockFile.lastModified);
        });
    });

    describe('get name', () => {
        it('should return the name of the file', () => {
            expect(fileObj.name).toEqual(mockFile.name);
        });
    });

    describe('get relative_path', () => {
        it('should return the relative path of the file', () => {
            expect(fileObj.path).toEqual(mockFile.webkitRelativePath);
        });
    });

    describe('edge cases', () => {
        it('should handle null file object', () => {
            expect(() => new file(null)).toThrowError('File must be a File.');
        });

        it('should handle undefined file object', () => {
            expect(() => new file(undefined)).toThrowError('File must be a File.');
        });
    });
});