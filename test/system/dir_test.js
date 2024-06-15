import { error, range_error, type_error } from "../../lib/error.js";
import { FILTER_FILE, FILTER_FOLDER, dir } from "../../lib/system/dir.js";


describe("Dir class", () => {
    let root;

    beforeEach(() => {
        root = new dir("root");
    });

    it("should initialize correctly with a name", () => {
        expect(root.name).toBe("root");
    });

    it("should set and get name correctly", () => {
        root.name = "newRoot";
        expect(root.name).toBe("newRoot");
    });

    it("should throw type_error if name is not a string", () => {
        expect(() => root.name = 123).toThrowError(type_error, "Name must be a string.");
    });

    it("should correctly identify an empty directory", () => {
        expect(root.empty()).toBe(true);
    });

    it("should append a file or directory correctly", () => {
        const file = { kind: `file`, name: "file1.txt" };
        root.append(file);
        expect(root.contains("file1.txt")).toBe(true);
    });

    it("should throw type_error if appended object is not a file or directory", () => {
        expect(() => root.append("invalid")).toThrowError(type_error, "Path must be a file or a directory.");
    });

    it("should correctly identify contained files or directories", () => {
        const file = { kind: `file`, name: "file1.txt" };
        root.append(file);
        expect(root.contains("file1.txt")).toBe(true);
        expect(root.contains("file2.txt")).toBe(false);
    });

    it("should return the correct index of a file or directory", () => {
        const file = { kind: `file`, name: "file1.txt" };
        root.append(file);
        expect(root.index("file1.txt")).toBe(0);
        expect(root.index("file2.txt")).toBe(-1);
    });

    it("should return the correct directory for a valid index", () => {
        const file = { kind: `file`, name: "file1.txt" };
        root.append(file);
        expect(root.at(0)).toBe(file);
    });

    it("should throw type_error for an invalid index type", () => {
        expect(() => root.at("invalid")).toThrowError(type_error, "Index must be a number.");
    });

    it("should throw range_error for out-of-range index", () => {
        expect(() => root.at(1)).toThrowError(range_error, "Index out of range: 1");
    });

    it("should filter content based on flags", () => {
        const file1 = { kind: `file`, name: "file1.txt" };
        const file2 = { kind: `dir`, name: "file2" };
        root.append(file1);
        root.append(file2);
        expect(root.filtered(FILTER_FILE)).toEqual([file1]);
        expect(root.filtered(FILTER_FOLDER)).toEqual([file2]);
    });

    it("should navigate directories with cd", () => {
        const subdir = new dir("subdir", root);
        root.append(subdir);
        expect(root.cd("subdir")).toBe(subdir);
    });

    it("should throw error if cd to a non-existent directory", () => {
        expect(() => root.cd("invalid")).toThrowError(error, "Entry not found: invalid");
    });

    it("should create a directory with mkdir", () => {
        const newDir = root.mkdir("newDir");
        expect(root.contains("newDir")).toBe(true);
        expect(newDir.name).toBe("newDir");
    });

    xit("should throw error if mkdir with an existing directory name", () => {
        root.mkdir("newDir");
        expect(() => root.mkdir("newDir")).toThrowError(error, "Folder already exists: newDir");
    });

    it("should create nested directories with mkpath", () => {
        const nestedDir = root.mkpath("a/b/c");
        expect(root.cd("a/b/c")).toBe(nestedDir);
    });

    it("should remove a directory with rmdir", () => {
        root.mkdir("dirToRemove");
        root.rmdir("dirToRemove");
        expect(root.contains("dirToRemove")).toBe(false);
    });

    it("should throw error if rmdir on a non-existent directory", () => {
        expect(() => root.rmdir("nonExistent")).toThrowError(error, "Folder does not exist: nonExistent");
    });

    it("should navigate to parent directory with cd('..')", () => {
        const subdir = root.mkdir("subdir");
        expect(root.cd("subdir")).toBe(subdir);
        expect(subdir.cd("..")).toBe(root);
    });

    it("should navigate to current directory with cd('.')", () => {
        expect(root.cd(".")).toBe(root);
    });

    it("should maintain the correct hierarchy for nested directories", () => {
        const dirA = root.mkdir("A");
        const dirB = dirA.mkdir("B");
        expect(dirB.path).toBe("root/A/B/");
    });

    it("should append multiple files and directories correctly", () => {
        const file1 = { kind: `file`, name: "file1.txt" };
        const file2 = { kind: `file`, name: "file2.txt" };
        const subdir = new dir("subdir", root);
        root.append(file1);
        root.append(file2);
        root.append(subdir);
        expect(root.contains("file1.txt")).toBe(true);
        expect(root.contains("file2.txt")).toBe(true);
        expect(root.contains("subdir")).toBe(true);
    });

    it("should throw error if rmdir with an invalid type", () => {
        expect(() => root.rmdir(123)).toThrowError(type_error, "Name must be a string.");
    });

    it("should handle the creation of deeply nested directories with mkpath", () => {
        const nestedDir = root.mkpath("a/b/c/d/e/f");
        expect(root.cd("a/b/c/d/e/f")).toBe(nestedDir);
    });

    it("should return the correct path for nested directories", () => {
        const subdir = root.mkdir("subdir");
        const nestedDir = subdir.mkdir("nested");
        expect(nestedDir.path).toBe("root/subdir/nested/");
    });
});