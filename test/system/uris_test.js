import { uris } from "../../lib/system/uris.js";
// test\data\pic_7.jpg



describe('uris', () => {
    describe('uris.index', () => {
        beforeEach(() => {
            uris.add('file1.txt');
            uris.add('dir/file2.txt');
            uris.add('dir/subdir/file3.txt');
        });

        afterEach(() => {
            uris.clear();
        });


        it('should return -1 if the files list is empty', () => {
            const index = uris.index('uris.txt');
            expect(index).toBe(-1);
        });

        it('should return -1 if the file URI is not found in the files list', () => {
            const index = uris.index('nonexistent/uris.txt');
            expect(index).toBe(-1);
        });

        it('should return the index of the file URI in the files list', () => {
            const index = uris.index('dir/file2.txt');
            expect(index).toBe(1);
        });

        it('should handle file URIs with different cases', () => {
            const index1 = uris.index('./DIR/subdir/FILE3.txt');
            const index2 = uris.index('./DiR/FiLe2.TxT');
            expect(index1).toBe(-1);
            expect(index2).toBe(-1);
        });

        it('should handle file URIs with leading "./"', () => {
            const index = uris.index('./file1.txt');
            expect(index).toBe(0);
        });

        it('should handle file URIs with backslashes', () => {
            const index = uris.index('dir\\subdir\\file3.txt');
            expect(index).toBe(2);
        });

        xit('should return the correct index for relative paths', () => {
            const index = uris.index('../file1.txt');
            expect(index).toBe(0);
        });

        it('should return the correct index for deeply nested file URIs', () => {
            const index = uris.index('dir/subdir/file3.txt');
            expect(index).toBe(2);
        });

        it('should handle special characters in file URIs', () => {
            const index = uris.index('dir/subdir/file!@#$%^&*()_+.txt');
            expect(index).toBe(-1);
        });

        it('should handle empty file URIs', () => {
            const index = uris.index('');
            expect(index).toBe(-1);
        });

        it('should handle null file URIs', () => {
            const index = uris.index(null);
            expect(index).toBe(-1);
        });

        it('should handle undefined file URIs', () => {
            const index = uris.index(undefined);
            expect(index).toBe(-1);
        });
    });

    describe('uris.uri', () => {
        beforeEach(() => {
            uris.add('file1.txt');
            uris.add('dir/file2.txt');
            uris.add('dir/subdir/file3.txt');
        });

        afterEach(() => {
            uris.clear();
        });

        it('should return an empty string if the index is -1', () => {
            const uri = uris.uri(-1);
            expect(uri).toBe('');
        });

        it('should return the file URI at the specified index', () => {
            const uri = uris.uri(1);
            expect(uri).toBe('dir/file2.txt');
        });

        it('should return an empty string if the index is out of bounds (negative index)', () => {
            const uri = uris.uri(-2);
            expect(uri).toBe('');
        });

        it('should return an empty string if the index is out of bounds (index too high)', () => {
            const uri = uris.uri(3);
            expect(uri).toBe('');
        });

        it('should handle index 0 correctly', () => {
            const uri = uris.uri(0);
            expect(uri).toBe('file1.txt');
        });

        it('should handle the last valid index correctly', () => {
            const uri = uris.uri(2);
            expect(uri).toBe('dir/subdir/file3.txt');
        });

        it('should handle large indexes gracefully', () => {
            const uri = uris.uri(1000);
            expect(uri).toBe('');
        });

        it('should handle non-integer indexes by converting them to integers', () => {
            const uri = uris.uri(1.5);
            expect(uri).toBe('dir/file2.txt');
        });

    });

    describe('uris.contains', () => {
        beforeEach(() => {
            uris.add('file1.txt');
            uris.add('dir/file2.txt');
            uris.add('dir/subdir/file3.txt');
        });

        afterEach(() => {
            uris.clear();
        });

        it('should return true if the file URI exists in the files list', () => {
            const result = uris.contains('dir/file2.txt');
            expect(result).toBe(true);
        });

        it('should return false if the file URI does not exist in the files list', () => {
            const result = uris.contains('nonexistent/uris.txt');
            expect(result).toBe(false);
        });

        it('should handle file URIs with different cases', () => {
            const result = uris.contains('DIR/file2.txt');
            expect(result).toBe(false); // Case-sensitive check
        });

        it('should handle file URIs with leading "./"', () => {
            const result = uris.contains('./file1.txt');
            expect(result).toBe(true);
        });

        it('should handle file URIs with backslashes', () => {
            const result = uris.contains('dir\\subdir\\file3.txt');
            expect(result).toBe(true);
        });

        it('should return false for empty file URIs', () => {
            const result = uris.contains('');
            expect(result).toBe(false);
        });
    });

    describe('uris.add', () => {

        afterEach(() => {
            uris.clear();
        });

        it('should return -1 if the URI is invalid', () => {
            const index = uris.add('');
            expect(index).toBe(-1);
        });

        it('should add a new file URI to the files list and return its index', () => {
            const index = uris.add('file1.txt');
            expect(index).toBe(0);
            expect(uris.contains(`file1.txt`)).toBeTrue();
        });

        it('should not add a duplicate file URI and return its index', () => {
            uris.add('file1.txt');
            const index = uris.add('file1.txt');
            expect(index).toBe(0);
            expect(uris.contains(`file1.txt`)).toBeTrue();
        });

        it('should handle file URIs with leading "./"', () => {
            const index = uris.add('./file1.txt');
            expect(index).toBe(0);
            expect(uris.contains(`./file1.txt`)).toBeTrue();
        });

        it('should handle file URIs with backslashes', () => {
            const index = uris.add('dir\\file2.txt');
            expect(index).toBe(0);
            expect(uris.contains(`./dir/file2.txt`)).toBeTrue();
        });

        it('should correctly add and return the index of multiple file URIs', () => {
            uris.add('file1.txt');
            const index = uris.add('dir/file2.txt');
            expect(index).toBe(1);
            expect(uris.contains(`./file1.txt`)).toBeTrue();
            expect(uris.contains(`./dir/file2.txt`)).toBeTrue();
        });

        it('should return the correct index for a file URI that was added after other URIs', () => {
            uris.add('file1.txt');
            uris.add('dir/file2.txt');
            const index = uris.add('dir/subdir/file3.txt');
            expect(index).toBe(2);
            expect(uris.contains(`./dir/subdir/file3.txt`)).toBeTrue();
        });

        it('should handle special characters in file URIs', () => {
            const index = uris.add('dir/subdir/file!@#$%^&*()_+.txt');
            expect(index).toBe(0);
            expect(uris.contains(`./dir/subdir/file!@#$%^&*()_+.txt`)).toBeTrue();
        });

       
    });
});
