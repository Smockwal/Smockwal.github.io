
import { flag } from "../../../lib/global.js";
import { message } from "../../../lib/source/message.js";
import { macros } from "../../../lib/source/preprocessor/macro.js";
import { clear_prepro, preprocessing } from "../../../lib/source/preprocessor/preprocess.js";
import { token } from "../../../lib/source/token.js";
import { tokens } from "../../../lib/source/tokens.js";
import { file } from "../../../lib/system/file.js";
import { uris } from "../../../lib/system/uris.js";
import { reset_index } from "../../../lib/text/string.js";
import { test_tokens } from "../../test.js";


describe(`preprocessing`, () => {
    beforeAll(() => { message.clear(); });

    beforeEach(async () => {
        await clear_prepro();
        macros.clear();
        uris.clear();
        reset_index();
    });

    afterEach(() => {
        //message.print();
        message.clear();
        //scr.clear();

    });

    it(`preprocessing_000`, async () => {
        const toks0 = new tokens(`#define A 123\nA`, `main.lsl`);
        //console.log(toks0.stringify());

        expect(toks0.file).toBe(`main.lsl`);

        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n123`);
        //expect(toks1.front.loc.is(new location(`main.lsl`, 2, 0))).toBeTrue();
    });

    it(`preprocessing_001`, async () => {
        const toks0 = new tokens(`#define eprintf(...) fprintf (stderr, __VA_ARGS__)\neprintf(1,2,3);`, `main.lsl`);

        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\nfprintf ( stderr , 1 , 2 , 3 ) ;`);
        test_tokens(toks1, [`fprintf`, `(`, `stderr`, `,`, `1`, `,`, `2`, `,`, `3`, `)`, `;`]);
        message.print();
    });

    it(`preprocessing_002`, async () => {
        const toks0 = new tokens(`#define A 1+2\na=A+3;`, `main.lsl`);
        expect(toks0.stringify()).toBe(`# define A 1 + 2\na = A + 3 ;`);
        const toks1 = await preprocessing([toks0]);
        test_tokens(toks1, [`a`, `=`, `1`, `+`, `2`, `+`, `3`, `;`]);
        expect(toks1.stringify()).toBe(`\na = 1 + 2 + 3 ;`);
        message.print();
    });

    it(`preprocessing_003`, async () => {
        const toks0 = new tokens(`#define ADD(A,B) A+B\nADD(1+2,3);`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n1 + 2 + 3 ;`);
        message.print();
    });

    it(`preprocessing_004`, async () => {
        const toks0 = new tokens(`#define A   123\n#define B   A\nA B`, `main.lsl`);
        expect(toks0.back.flag & flag.NAME_FLAG).toBe(flag.NAME_FLAG);

        const toks1 = await preprocessing([toks0]);
        expect(macros.has(`A`)).toBeTrue();
        expect(macros.has(`B`)).toBeTrue();

        expect(toks1.stringify()).toBe(`\n\n123 123`);
        message.print();
    });

    it(`preprocessing_005`, async () => {
        const toks0 = new tokens(`#define A      123\n#define B(C)   A\nA B(1)`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n123 123`);
        message.print();
    });

    it(`preprocessing_006`, async () => {
        const toks0 = new tokens(`#define add(x,y) x+y\nadd(add(1,2),3)`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n1 + 2 + 3`);
        message.print();
    });

    it(`preprocessing_007`, async () => {
        const toks0 = new tokens(`#define A() 1\nA()`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n1`);
        message.print();
    });

    it(`preprocessing_008`, async () => {
        const toks0 = new tokens(`#define A(X) X+1\nA(1 /*23*/)`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n1 + 1`);
        message.print();
    });

    it(`preprocessing_009`, async () => {
        const toks0 = new tokens(`#define A(X) \nint A[10];`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\nint A [ 10 ] ;`);
        message.print();
    });

    it('preprocessing_010', async () => {
        const toks0 = new tokens(`#define AB ab.AB\nAB.CD\n`, `main.lsl`);
        // AB.CD
        // ab.AB.CD
        const toks1 = await preprocessing([toks0], false, 100);
        expect(message.at(0).msg).toBe(`Macro recursion detected.`, `main.lsl`);
        message.clear();
        //expect(toks1.stringify()).toBe(`\nab . AB . CD`);
    });

    it('preprocessing_011', async () => {
        const toks0 = new tokens(`#define A u8 \"a b\"\nA;`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\nu8 \"a b\" ;`);
        message.print();
    });

    it('preprocessing_012', async () => {
        const toks0 = new tokens(`#line "version.h":4\n#define A(x) B(x)\n#define B(x) x\n#define VER A(1)\n\n#line "cppcheck.cpp":10 \nVER;`, `main.lsl`);
        expect(toks0.front.loc.file).toBe(1);
        //for (let tok = toks0.front; tok; tok = tok._next) 
        //console.log(`str: ${tok.str}, file: ${tok.loc.file}, line: ${tok.loc.line}, col: ${tok.loc.col}`);

        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify(toks1.front)).toBe(`\n#file "cppcheck.cpp":10\n1 ;`);
        message.print();
    });

    it('preprocessing_013', async () => {
        const toks0 = new tokens(`#define A(x) (x+1)\n#define B    A(\nB(i))`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n( ( i ) + 1 )`);
        message.print();
    });

    it('preprocessing_014', async () => {
        const toks0 = new tokens(`#define A(m)    n=m\n#define B(x)    A(x)\nB(0)`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\nn = 0`);
        message.print();
    });

    it('preprocessing_015', async () => {
        const toks0 = new tokens(`#define ABC 123\n#define A(B) A##B\nA(BC)`, `main.lsl`);
        // A(BC)
        // ABC
        // 123
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n123`);
        message.print();
    });

    it('preprocessing_016', async () => {
        const toks0 = new tokens(`#define FOO1()\n#define TEST(FOO) FOO FOO()\nTEST(FOO1)`, `main.lsl`);
        // TEST(FOO1)
        // FOO1 FOO1()
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\nFOO1`);
        message.print();
    });

    it('preprocessing_017', async () => {
        const toks0 = new tokens(`#define X() Y\n#define Y() X\nA: X()()()`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\nA : Y`);
        message.print();
    });

    it('preprocessing_018', async () => {
        const toks0 = new tokens(`#define f(a) a*g\n#define g f\na: f(2)(9)\n`, `main.lsl`);
        // a: f(2)(9)
        // a: 2*g(9)
        // a: 2*f(9)
        // a: 2*9*g
        // a: 2 * 9 * f
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\na : 2 * 9 * f`);
        message.print();
    });

    it('preprocessing_019', async () => {
        const toks0 = new tokens(`#define f(a) a*g\n#define g(a) f(a)\na: f(2)(9)\n`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\na : 2 * 9 * g`);
        message.print();
    });

    it('preprocessing_020', async () => {
        const toks0 = new tokens(`#define f(x) g(x\n#define g(x) x()\nf(f))\n`, `main.lsl`);
        // f(f))
        // g(f)
        // f()
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\nf ( )`);
        message.print();
    });

    it('preprocessing_021', async () => {
        const toks0 = new tokens(`#define A(X,Y)  ((X)*(Y))\n#define B(X,Y)  ((X)+(Y))\nB(0,A(255,x+\ny))\n`, `main.lsl`);
        // B ( 0 , A ( 255 , x +\ny ) )
        // ( ( 0 ) + ( A ( 255 , x +\ny ) ) )
        // ( ( 0 ) + ( ( ( 255 ) * ( x +\ny ) ) ) )

        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n( ( 0 ) + ( ( ( 255 ) * ( x + y ) ) ) )`);
        message.print();
    });

    it('preprocessing_022', async () => {
        const toks0 = new tokens(`#define A(X) X\n#define B(X) X\nA(\nB(dostuff(1,\n2)))\n`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\ndostuff ( 1 , 2 )`);
        message.print();
    });

    it('preprocessing_023', async () => {
        const toks0 = new tokens(`#define glue(a, b) a ## b\n#define xglue(a, b) glue(a, b)\n#define AB 1\n#define B B 2\nxglue(A, B)\n`, `main.lsl`);
        // xglue(A, B)
        // glue(A, B)
        // A ## B
        // A ## B 2
        // AB 2
        // 1 2
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n\n\n1 2`);
        message.print();
    });

    it('preprocessing_024', async () => {
        const toks0 = new tokens(`#define XY(x, y) x ## y\n#define XY2(x, y) XY(x, y)\n#define PORT XY2(P, 2)\n#define ABC XY2(PORT, DIR)\nABC;\n`, `main.lsl`);
        // ABC ;
        // XY2(PORT, DIR) ;
        // XY(PORT, DIR) ;
        // PORT ## DIR
        // XY2(P, 2) ## DIR ;
        // XY(P, 2) ## DIR ;
        // P ## 2 ## DIR ;
        // P2DIR ;
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n\n\nP2DIR ;`);
        //message.print();
    });

    it('preprocessing_025', async () => {
        const toks0 = new tokens(`#define XY(Z)  Z\n#define X(ID)  X##ID(0)\nX(Y)\n`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n0`);
        message.print();
    });

    it('preprocessing_026', async () => {
        const toks0 = new tokens(`#define f()\n#define t(a) a\n(t(f))\n`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n( f )`);
        message.print();
    });

    it('preprocessing_027', async () => {
        const toks0 = new tokens(`#define z f(w\n#define f()\n#define w f(z\nw\n`, `main.lsl`);
        // w
        // f(z
        // f(f(w

        // f(f(f(z
        // f(f(f(f(w
        // f(f(f(f(f(z
        // ...
        const toks1 = await preprocessing([toks0]);
        //expect(toks1.stringify()).toBe(`f ( f ( w`);
        expect(message.at(0).msg).toBe(`Macro recursion detected.`);
        message.clear();
    });

    it('preprocessing_028', async () => {
        const toks0 = new tokens(`#define a          f\n#define foo(x,y)   a(x,y)\n#define f(x, y)    x y\nfoo(1,2)`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n\n1 2`);
        message.print();
    });

    it('preprocessing_029', async () => {
        const toks0 = new tokens(`#define ab(a, b)  a##b\n#define foo(...) ab(f, 2) (__VA_ARGS__)\n#define f2(x, y) x y\nfoo(1,2)`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n\n1 2`);
        message.print();
    });

    it('preprocessing_030', async () => {
        const toks0 = new tokens(`#define Bar(x) x\n#define Foo Bar(1)\nBar( Foo ) ;`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n1 ;`);
        message.print();
    });

    it('preprocessing_031', async () => {
        const toks0 = new tokens(`#define A(fmt...) dostuff(fmt)\nA(1,2);`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\ndostuff ( 1 , 2 ) ;`);
        message.print();
    });

    it('preprocessing_032', async () => {
        const toks0 = new tokens(`#define A(X,...) X(#__VA_ARGS__)\nA(f,123);`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\nf ( "123" ) ;`);
        message.print();
    });

    it('preprocessing_033', async () => {
        const toks0 = new tokens(`#define A(x, y, z...) 1\nA(1, 2)\n`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n1`);
        message.print();
    });

    it('preprocessing_034', async () => {
        const toks0 = new tokens(`x=#__LINE__`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`x = "1"`);
        message.print();
    });

    it('preprocessing_035', async () => {
        const toks0 = new tokens(`#define a(x) #x\na(1)\na(2+3)`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n"1"\n"2+3"`);
        message.print();
    });

    it('preprocessing_036', async () => {
        const toks0 = new tokens(`#define str(x) #x\nstr("abc\\0")\n`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n"\\"abc\\0\\""`);
        message.print();
    });

    it('preprocessing_037', async () => {
        const toks0 = new tokens(`#define A(x)  (x)\n#define B(x)  A(#x)\nB(123)`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n( "123" )`);
        message.print();
    });

    it('preprocessing_038', async () => {
        const toks0 = new tokens(`#define MACRO( A, B, C ) class A##B##C##Creator {};\nMACRO( B\t, U , G )`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\nclass BUGCreator { } ;`);
        message.print();
    });

    it('preprocessing_039', async () => {
        const toks0 = new tokens(`#define A(x) a##x\n#define B 0\nA(B)`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\na0`);
        message.print();
    });

    it('preprocessing_040', async () => {
        const toks0 = new tokens(`#define A(B) A##B\n#define a(B) A(B)\na(A(B))`, `main.lsl`);
        // a ( A ( B ) )
        // A ( A ( B ) )
        // A ## A ( B )
        // A ## A ## B
        // AAB
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\nAAB`);
        message.print();
    });

    it('preprocessing_041', async () => {
        const toks0 = new tokens(`#define A(x,y...) a(x,##y)\nA(1)\n`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\na ( 1 )`);
        message.print();
    });

    it('preprocessing_042', async () => {
        const toks0 = new tokens(`x##__LINE__`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`x1`);
        message.print();
    });

    it('preprocessing_043', async () => {
        const toks0 = new tokens(`#define A(X, ...) LOG(X, ##__VA_ARGS__)\n#define B(X, ...) A(X, ##__VA_ARGS__)\n#define C(X, ...) B(X, ##__VA_ARGS__)\nC(1,(int)2)`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n\nLOG ( 1 , ( int ) 2 )`);
        message.print();
    });

    it('preprocessing_044', async () => {
        const toks0 = new tokens(`#define hash_hash # ## #\nx hash_hash y`, `main.lsl`);
        // x hash_hash y
        // x # ## # y
        // x ## y
        // x ## y
        const toks1 = await preprocessing([toks0]);
        //expect(toks1.stringify()).toBe(`\nx ## y`);
        expect(toks1.stringify()).toBe(`\nxy`);
        message.print();
    });

    it('preprocessing_045', async () => {
        const toks0 = new tokens(`#define a(xy)    x##y = xy\na(123);`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        //expect(toks1.stringify()).toBe(`\nx ## y`);
        expect(toks1.stringify()).toBe(`\nxy = 123 ;`);
        message.print();
    });

    it('preprocessing_046', async () => {
        const toks0 = new tokens(`#define ADD_OPERATOR(OP) void operator OP ## = (void) { x = x OP 1; }\nADD_OPERATOR(+);\nADD_OPERATOR(-);\nADD_OPERATOR(*);\nADD_OPERATOR(/);\nADD_OPERATOR(%);\nADD_OPERATOR(&);\nADD_OPERATOR(|);\nADD_OPERATOR(^);\nADD_OPERATOR(<<);\nADD_OPERATOR(>>);\n`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        //expect(toks1.stringify()).toBe(`\nx ## y`);
        expect(toks1.stringify()).toBe(`\nvoid operator += ( void ) { x = x + 1 ; } ;\nvoid operator -= ( void ) { x = x - 1 ; } ;\nvoid operator *= ( void ) { x = x * 1 ; } ;\nvoid operator /= ( void ) { x = x / 1 ; } ;\nvoid operator %= ( void ) { x = x % 1 ; } ;\nvoid operator &= ( void ) { x = x & 1 ; } ;\nvoid operator |= ( void ) { x = x | 1 ; } ;\nvoid operator ^= ( void ) { x = x ^ 1 ; } ;\nvoid operator <<= ( void ) { x = x << 1 ; } ;\nvoid operator >>= ( void ) { x = x >> 1 ; } ;`);
        message.print();
    });

    it('preprocessing_047', async () => {
        const toks0 = new tokens(`#define A 2##=\nA`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.at(0).msg).toBe(`Invalid ## usage.`);
        message.clear();
    });

    it('preprocessing_048', async () => {
        const toks0 = new tokens(`#define A <<##x\nA`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.at(0).msg).toBe(`Invalid ## usage.`);
        message.clear();
    });

    it('preprocessing_049', async () => {
        const toks0 = new tokens(`#define x # #\nx`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n# #`);
    });

    it('preprocessing_050', async () => {
        const toks0 = new tokens(`#define x # # #\nx`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n# # #`);
    });

    it('preprocessing_051', async () => {
        const toks0 = new tokens(`#define MAX_FOO 1\n#define MAX_FOO_AA 2\n\n#define M(UpperCaseName, b) do {int MaxValue = MAX_##UpperCaseName;if (b) {MaxValue = MAX_##UpperCaseName##_AA;}} while (0)\nstatic void f(bool b) { M(FOO, b); }\n`, `main.js`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n\n\nstatic void f ( bool b ) { do { int MaxValue = 1 ; if ( b ) { MaxValue = 2 ; } } while ( 0 ) ; }`);
    });

    it('preprocessing_052', async () => {
        const toks0 = new tokens(`#define X(x) x##U\nX((1<<1)-1)`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n( 1 << 1 ) - 1U`);
    });

    it('preprocessing_053', async () => {
        const toks0 = new tokens(`#define  f(a)  (##x)\nf(1)`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.at(0).msg).toBe(`Invalid ## usage.`);
        message.clear();
    });

    it('preprocessing_054', async () => {
        const toks0 = new tokens(`#define  f(a)  (x##)\nf(1)`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.at(0).msg).toBe(`Invalid ## usage.`);
    });

    it('preprocessing_055', async () => {
        const toks0 = new tokens(`#define A`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(macros.has(`A`)).toBeTrue();
    });

    it('preprocessing_056', async () => {
        reset_index();
        const toks0 = new tokens(`#define A #__UID__\nA;`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n"b" ;`);
    });

    it('preprocessing_057', async () => {
        const toks0 = new tokens(`#define A(X, ...) LOG(X, ##__VA_ARGS__)\nA(1,(int)2)`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\nLOG ( 1 , ( int ) 2 )`);
        message.print();
    });

    it('preprocessing_058', async () => {
        const toks0 = new tokens(`#define A +##x\nA`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.at(0).msg).toBe(`Invalid ## usage.`);
    });

    it('preprocessing_059', async () => {
        const toks0 = new tokens(`#define CONCAT(x, y) x##y\nCONCAT(&a, b)`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n& ab`);
    });

    it('error_000', async () => {
        const toks0 = new tokens(`#error    hello world!\n`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Error: hello world! #file "main.lsl":1:1`);
    });

    it('error_001', async () => {
        const toks0 = new tokens(`#error   it's an error\n`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Error: it's an error #file "main.lsl":1:1`);
    });

    it('error_002', async () => {
        const toks0 = new tokens(`#error "bla bla\\n bla bla."\n`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Error: "bla bla\\n bla bla." #file "main.lsl":1:1`);
    });

    it('error_003', async () => {
        const toks0 = new tokens(`#error "bla bla\\n bla bla."\n`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Error: "bla bla\\n bla bla." #file "main.lsl":1:1`);
    });

    /*
    it('error_4', () => {
        const toks0 = new tokens(`\xFE\xFF\x00\x23\x00\x65\x00\x72\x00\x72\x00\x6f\x00\x72\x00\x20\x00\x78\x00\x0a\x00\x31`, `main.lsl`);
        console.log(toks0.stringify());
        const toks1 = preprocessing([toks0]);
        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`# error x #line "main.lsl":1:1`);
    });
*/
    it('ifdef_000', async () => {
        const toks0 = new tokens(`#ifdef A\n1\n#else\n2\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(0);
        expect(toks1.stringify()).toBe(`\n\n\n2`);
        message.print();
    });

    it('ifdef_001', async () => {
        const toks0 = new tokens(`#define A\n#ifdef A\n1\n#else\n2\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(0);
        expect(toks1.stringify()).toBe(`\n\n1`);
        message.print();
    });

    it('ifndef_000', async () => {
        const toks0 = new tokens(`#define A\n#ifndef A\n1\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(0);
        expect(toks1.stringify()).toBe(``);
        message.print();
    });

    it('ifndef_001', async () => {
        const toks0 = new tokens(`#ifndef A\n1\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(0);
        expect(toks1.stringify()).toBe(`\n1`);
        message.print();
    });

    it('if_000', async () => {
        const toks0 = new tokens(`#if A==1\nX\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(0);
        expect(toks1.stringify()).toBe(``);
        message.print();
    });

    it('if_001', async () => {
        const toks0 = new tokens(`#define A 1\n#if A==1\nX\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(0);
        expect(toks1.stringify()).toBe(`\n\nX`);
    });

    it('if_invalide_000', async () => {
        const toks0 = new tokens(`#define A 1\n#endif\nB\n`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(``);
        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: #endif without #if #file "main.lsl":2:2`);
        message.clear();
    });

    it('if_invalide_001', async () => {
        const toks0 = new tokens(`#elif\nB\n`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(``);
        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: #elif without #if #file "main.lsl":1:1`);
        message.clear();
    });

    it('if_invalide_002', async () => {
        const toks0 = new tokens(`#if 1\nG\n#endif\n#elif\nsomething\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(``);
        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Syntax error: #elif without #if #file "main.lsl":4:2`);
    });

    it('if_char_literal_000', async () => {
        const toks0 = new tokens(`#if ('A'==0x41)\n123\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(0);
        expect(toks1.stringify()).toBe(`\n123`);
        message.print();
    });

    it('if_defined_000', async () => {
        const toks0 = new tokens(`#if defined(A)\nX\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(``);
        message.print();
    });

    it('if_defined_001', async () => {
        const toks0 = new tokens(`#define A\n#if defined(A)\nX\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\nX`);
        message.print();
    });

    it('if_defined_002', async () => {
        macros.clear();
        const toks0 = new tokens(`#define A\n#if defined(A) && defined(B)\nX\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(``);
        message.print();
    });

    it('if_defined_no_par_000', async () => {
        const toks0 = new tokens(`#if defined A\nX\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(``);
        message.print();
    });

    it('if_defined_no_par_001', async () => {
        const toks0 = new tokens(`#define A\n#if defined A\nX\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\nX`);
        message.print();
    });

    it('if_defined_nested_000', async () => {
        const toks0 = new tokens(`#define FOODEF defined(FOO)\n#if FOODEF\nX\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(``);
        message.print();
    });

    it('if_defined_nested_001', async () => {
        const toks0 = new tokens(`#define FOO\n#define FOODEF defined(FOO)\n#if FOODEF\nX\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n\nX`);
        message.print();
    });

    it('if_defined_nested_no_par_000', async () => {
        const toks0 = new tokens(`#define FOODEF defined FOO\n#if FOODEF\nX\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(``);
        message.print();
    });

    it('if_defined_invalid1_000', async () => {
        const toks0 = new tokens(`#if defined(A`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(1);
        expect(toks1.stringify()).toBe(``);
        message.print();
    });

    it('if_defined_invalid1_001', async () => {
        const toks0 = new tokens(`#if defined`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(1);
        expect(toks1.stringify()).toBe(``);
        message.print();
    });

    it('if_defined_hash_hash_000', async () => {
        const toks0 = new tokens(`#define ENABLE(FEATURE)  defined ENABLE_##FEATURE\n#define ENABLE_FOO 1\n#if ENABLE(FOO)\n#error FOO is enabled\n#else\n#error FOO is not enabled\n#endif\n`, `main.lsl`);
        //console.log(toks0.stringify());
        const toks1 = await preprocessing([toks0]);
        /*
        #define ENABLE(FEATURE)  defined ENABLE_##FEATURE
        #define ENABLE_FOO 1
        #if ENABLE(FOO)
        #error FOO is enabled
        #else
        #error FOO is not enabled
        #endif
        */
        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Error: FOO is enabled #file "main.lsl":4:2`);
    });

    it('if_logical_000', async () => {
        const toks0 = new tokens(`#if defined(A) || defined(B)\nX\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(``);
    });

    it('if_logical_001', async () => {
        const toks0 = new tokens(`#define A\n#if defined(A) || defined(B)\nX\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\nX`);
    });

    it('if_logical_002', async () => {
        const toks0 = new tokens(`#define B\n#if defined(A) || defined(B)\nX\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\nX`);
    });

    it('elif_000', async () => {
        const toks0 = new tokens(`#ifndef X\n1\n#elif 1<2\n2\n#else\n3\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n1`);
    });

    it('elif_001', async () => {
        const toks0 = new tokens(`#ifdef X\n1\n#elif 1<2\n2\n#else\n3\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n\n2`);
    });

    it('elif_002', async () => {
        const toks0 = new tokens(`#ifdef X\n1\n#elif 1>2\n2\n#else\n3\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n#file "main.lsl":6:1\n3`);
    });

    it('has_include_000', async () => {
        const toks0 = new tokens(`#ifdef __has_include\n#ifdef __has_include("./data/test_0.h")\nA\n#else\nB\n#endif\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\nA`);
    });

    it('has_include_001', async () => {
        const toks0 = new tokens(`#if defined( __has_include)\n#ifdef __has_include("./data/test_0.h")\nA\n#else\nB\n#endif\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\nA`);
    });

    it('has_include_002', async () => {
        spyOn(file, 'exists').and.resolveTo(true);

        const toks0 = new tokens(`#if __has_include("./data/test_0.h")\nA\n#else\nB\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\nA`);
    });

    it('has_include_003', async () => {
        const toks0 = new tokens(`#if __has_include("./data/test_1.h")\nA\n#else\nB\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n\nB`);
    });

    it('has_include_004', async () => {
        spyOn(file, 'exists').and.resolveTo(true);

        const toks0 = new tokens(`#if __has_include(<test_1.h>)\nA\n#else\nB\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\nA`);
    });

    it('has_include_005', async () => {
        const toks0 = new tokens(`#if __has_include(<test_0.h>)\nA\n#else\nB\n#endif`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n\nB`);
    });

    it('include_000', async () => {
        const toks0 = new tokens(`#include "A.h"\n`, `main.lsl`);
        expect(toks0.stringify()).toBe(`# include "A.h"`);
    });

    it('include_001', async () => {
        const toks0 = new tokens(`#include <A.h>\n`, `main.lsl`);
        expect(toks0.stringify()).toBe(`# include <A.h>`);
    });

    it('include_002', async () => {
        spyOn(window, 'fetch').and.resolveTo({ ok: true, text() { return `#define glue(a,b,c,d) a##b##c##d`; } });
        spyOn(file, 'exists').and.resolveTo(true);
        //spyOn(window, 'read_file').and.resolveTo(new tokens(`#define glue(a,b,c,d) a##b##c##d`, `include_2.h`));
        //spyOn(window, 'load_from_obj').and.resolveTo(new tokens(`#define glue(a,b,c,d) a##b##c##d`, `include_2.h`));

        const toks0 = new tokens(`#include <include_2.h>\nglue(1,2,3,4)\n`, `main.lsl`);
        expect(toks0.stringify()).toBe(`# include <include_2.h>\nglue ( 1 , 2 , 3 , 4 )`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n1234`);
    });

    it('include_003', async () => {
        spyOn(window, 'fetch').and.resolveTo({ ok: true, text() { return `#define X 123`; } });
        spyOn(file, 'exists').and.resolveTo(true);

        const toks0 = new tokens(`#include <27.h>\nX\n`, `main.lsl`);
        expect(toks0.stringify()).toBe(`# include <27.h>\nX`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n123`);
    });

    it('include_004', async () => {
        spyOn(window, 'fetch').and.resolveTo({ ok: true, text() { return `123`; } });
        spyOn(file, 'exists').and.resolveTo(true);

        const toks0 = new tokens(`#define A <3.h>\n#include A\n`, `main.lsl`);
        expect(toks0.stringify()).toBe(`# define A < 3. h >\n# include A`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n#file "3.h":1\n123`);
    });

    it('include_005', async () => {
        const toks0 = new tokens(`#define INCLUDE_LOCATION somewhere\n#define INCLUDE_FILE(F)  <INCLUDE_LOCATION/F.h>\n#include INCLUDE_FILE(header)\n`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(``);
        expect(message.length()).toBe(1);
        expect(message.at(0).str()).toBe(`Missing header: Header not found: include/somewhere/header.h #file "main.lsl":3:2`);
    });

    it('include_006', async () => {
        spyOn(window, 'fetch').and.resolveTo({ ok: true, text() { return `123`; } });
        spyOn(file, 'exists').and.resolveTo(true);

        const toks0 = new tokens(`#include <3.h>\n#include <3.h>\n`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n#file "3.h":1\n123 123`);
        expect(message.length()).toBe(0);
    });

    it('undef_000', async () => {
        const toks0 = new tokens(`#define A\n#undef A\n#ifndef A\n123\n#endif\n`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(0);
        expect(toks1.stringify()).toBe(`\n\n\n123`);
    });

    it('pragma_once_000', async () => {
        spyOn(window, 'fetch').and.resolveTo({ ok: true, text() { return `#pragma once\n123`; } });
        spyOn(file, 'exists').and.resolveTo(true);

        const toks0 = new tokens(`#include <pragma_once.h>\n#include <pragma_once.h>\n`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(0);
        expect(toks1.stringify()).toBe(`\n#file "pragma_once.h":2:1\n123`);
    });

    it('expand__FILE__000', async () => {
        const toks0 = new tokens(`__FILE__`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`main.lsl`);
    });

    it('expand__FILE_NAME__000', async () => {
        const toks0 = new tokens(`__FILE_NAME__`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`main.lsl`);
    });

    it('expand__LINE__000', async () => {
        const toks0 = new tokens(`__LINE__`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`1`);
    });

    it('expand__COUNTER__000', async () => {
        const toks0 = new tokens(`__COUNTER__`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`0`);
    });

    /*
    it('expand__DATE__0', async () => {
        const toks0 = new tokens(`__DATE__`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(new Date().toISOString());
    });

    it('expand__TIME__0', async () => {
        const toks0 = new tokens(`__TIME__`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`0`);
    });
    
    it('expand__VERSION__0', async () => {
        const toks0 = new tokens(`__VERSION__`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`0`);
    });
    */
    it('expand__INCLUDE_LEVEL__000', async () => {
        const toks0 = new tokens(`__INCLUDE_LEVEL__`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`0`);
    });

    it('expand__BASE_FILE__000', async () => {

        const toks0 = new tokens(`__BASE_FILE__`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`main.lsl`);
    });

    // https://github.com/danmar/simplecpp/issues
    it('preprocessing_file_000', async () => {
        // https://github.com/danmar/simplecpp/issues/262

        spyOn(window, 'fetch').and.resolveTo({ ok: true, text() { return `#if 0\n'\n#endif\nPOP`; } });
        spyOn(file, 'exists').and.resolveTo(true);

        const name = `./data/preprocessing_file_0.c`;
        const toks0 = new tokens(await file.load_text(name), name);
        //console.log(toks0.stringify());

        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`\n\n\nPOP`);
    });

    /**/
    it('preprocessing_file_001', async () => {
        spyOn(window, 'fetch').and.resolveTo({ ok: true, text() { return `#define SIMPLE(T, NAME) \\\nT NAME;\n\n#define ADVANCED(T, PREFIX, NAME, EXTENSION) \\\nSIMPLE(T, PREFIX##NAME##EXTENSION)\n\nADVANCED(int, , foo, )`; } });
        spyOn(file, 'exists').and.resolveTo(true);

        const name = `./data/preprocessing_file_1.c`;
        const toks0 = new tokens(await file.load_text(name), name);
        expect(message.length()).toBe(0);

        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(0);
        message.print();

        expect(toks1.stringify()).toBe(`\n#file "preprocessing_file_1.c":7:1\nint foo ;`);
        message.print();
    });

    it('preprocessing_file_002', async () => {
        spyOn(window, 'fetch').and.resolveTo({ ok: true, text() { return `#define CAT(a, b) CAT2(a, b)\n#define CAT2(a, b) a ## b\n#define FOO x\n#define BAR() CAT(F, OO)\n#define BAZ CAT(B, AR)()\nBAZ`; } });
        spyOn(file, 'exists').and.resolveTo(true);

        const name = `./data/preprocessing_file_2.c`;
        const toks0 = new tokens(await file.load_text(name), name);
        expect(message.length()).toBe(0);

        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(0);
        message.print();

        expect(toks1.stringify()).toBe(`\n#file "preprocessing_file_2.c":6:3\nx`);
        message.print();
    });

    it('preprocessing_file_003', async () => {
        spyOn(window, 'fetch').and.resolveTo({ ok: true, text() { return `#define EMPTY()\n#define EVAL(...) __VA_ARGS__\n#define HELLO() "Hello World"\n\nEVAL ( HELLO EMPTY() () ) `; } });
        spyOn(file, 'exists').and.resolveTo(true);

        const name = `./data/preprocessing_file_3.c`;
        const toks0 = new tokens(await file.load_text(name), name);
        expect(message.length()).toBe(0);

        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(0);
        message.print();

        expect(toks1.stringify()).toBe(`\n\n\n\n"Hello World"`);
        message.print();
    });

    it('preprocessing_file_004', async () => {
        spyOn(window, 'fetch').and.resolveTo({ ok: true, text() { return `/\\\n*\n*/ #/*\n*/defi\\\nne FO\\\nO 10\\\n20\nFOO`; } });
        spyOn(file, 'exists').and.resolveTo(true);

        const name = `./data/preprocessing_file_4.c`;
        const toks0 = new tokens(await file.load_text(name), name);
        expect(message.length()).toBe(0);

        toks0.remove_comments();
        expect(toks0.stringify()).toBe(`# define FOO 1020\n\n\n\nFOO`);


        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(0);
        message.print();

        expect(toks1.stringify()).toBe(`\n\n\n\n1020`);
        message.print();
    });

    it('preprocessing_file_005', async () => {
        spyOn(window, 'fetch').and.resolveTo({
            ok: true, text() {
                return `#define at(x, y) x##y
#define b(...)                                                                 \
    aa(__VA_ARGS__, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ,  \
        , , , , , , , , 2)
#define aa(c, d, a, b, e, f, g, h, ab, ac, i, ad, j, k, l, m, n, o, p, ae, q,  \
            r, s, t, u, v, w, x, y, z, af, ag, ah, ai, aj, ak, al, am, an, ao,  \
            ap)                                                                 \
    ap
#define aq(...) ar(b(__VA_ARGS__), __VA_ARGS__) static_assert(true, "")
#define ar(ap, ...) at(I_, ap)(__VA_ARGS__)
#define I_2(as, a)
aq(a, array);`;
            }
        });
        spyOn(file, 'exists').and.resolveTo(true);

        const name = `./data/preprocessing_file_5.c`;
        const toks0 = new tokens(await file.load_text(name), name);
        expect(message.length()).toBe(0);

        toks0.remove_comments();
        /*
#define at(x, y) x##y
#define b(...) aa(__VA_ARGS__, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 2)
#define aa(c, d, a, b, e, f, g, h, ab, ac, i, ad, j, k, l, m, n, o, p, ae, q, r, s, t, u, v, w, x, y, z, af, ag, ah, ai, aj, ak, al, am, an, ao, ap) ap
#define aq(...) ar(b(__VA_ARGS__), __VA_ARGS__) static_assert(true, "")
#define ar(ap, ...) at(I_, ap)(__VA_ARGS__)
#define I_2(as, a)
aq(a, array);
        */

        // aq(a, array);
        // ar(b(a, array), a, array) static_assert(true, "")
        // at(I_, b(a, array))(a, array) static_assert(true, "")
        // I_##aa(a, array, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 2)(a, array) static_assert(true, "")
        // I_##2(a, array) static_assert(true, "")
        // I_2(a, array) static_assert(true, "")
        // static_assert(true, "")

        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(0);
        message.print();

        expect(toks1.stringify()).toBe(`\n#file "preprocessing_file_5.c":7:1\nstatic_assert ( true , "" ) ;`);
        message.print();
    });

    it('preprocessing_file_006', async () => {
        spyOn(window, 'fetch').and.resolveTo({
            ok: true, text() {
                return `#define __FOO__ 1
  
#define IS_DEFINED(name) (defined(__ ## name ## __))

#warning Before IS_DEFINED(FOO)

#if IS_DEFINED(FOO)
#warning Inside IS_DEFINED(FOO)
#endif

#warning After IS_DEFINED(FOO)`;
            }
        });
        spyOn(file, 'exists').and.resolveTo(true);

        const name = `./data/preprocessing_file_6.c`;
        const toks0 = new tokens(await file.load_text(name), name);
        toks0.remove_comments();

        const toks1 = await preprocessing([toks0]);
        expect(message.length()).toBe(3);
        message.print();
    });

    // https://www.open-std.org/JTC1/sc22/wg14/www/docs/n1256.pdf
    /*
    it('preprocessing_file_7', async () => {
        const toks0 = await read_file(`./data/preprocessing_file_7.c`);
        toks0.remove_comments();
        
        const toks1 = await preprocessing([toks0], true);
        expect(message.length()).toBe(0);
        message.print();

        expect(toks1.stringify()).toBe(`\n#file "preprocessing_file_5.c":12:1\nstatic_assert ( true , "" ) ;`);
    });
*/

    /*
    it('string_encoding_0', async () => {
        const toks0 = new tokens(`u8"Hello world!"`, `main.lsl`);
        const toks1 = await preprocessing([toks0]);
        expect(toks1.stringify()).toBe(`"\x48\x65\x6C\x6C\x6F\x20\x77\x6F\x72\x6C\x64\x21"`);
    });
    */


});


describe("Macro Preprocessing", () => {

    beforeEach(async () => {
        await clear_prepro();
    });

    it("should define and expand a simple macro", async () => {
        const src = new tokens(`#define FOO 42\nFOO`, `main.lsl`);

        const result = await preprocessing([src]);
        expect(result.str).toEqual("42");
    });

    it("should handle nested macro expansions", async () => {
        const src = new tokens(`#define FOO 42\n#define BAR FOO\nBAR`, `main.lsl`);

        const result = await preprocessing([src]);
        expect(result.str).toEqual("42");
    });

    it("should handle undefined macros", async () => {
        const src = new tokens(`BAR`, `main.lsl`);

        const result = await preprocessing([src]);
        expect(result.str).toEqual("BAR");
    });

    it("should handle conditional macros", async () => {
        const src = new tokens(`#define FOO 1\n#if FOO\nBAR\n#endif`, `main.lsl`);

        const result = await preprocessing([src]);
        expect(result.str).toEqual("BAR");
    });

    it("should handle else in conditional macros", async () => {
        const src = new tokens(`#define FOO 0\n#if FOO\nBAR\n#else\nBAZ\n#endif`, `main.lsl`);

        const result = await preprocessing([src]);
        expect(result.str).toEqual("BAZ");
    });

    it("should handle elif in conditional macros", async () => {
        const src = new tokens(`#define FOO 0\n#define BAR 1\n#if FOO\nFOO\n#elif BAR\nBAR\n#endif`, `main.lsl`);

        const result = await preprocessing([src]);
        expect(result.str).toEqual("1");
    });

    it("should handle undefined macros in conditions", async () => {
        const src = new tokens(`#if FOO\nBAR\n#else\nBAZ\n#endif`, `main.lsl`);

        const result = await preprocessing([src]);
        expect(result.str).toEqual("BAZ");
    });

    it("should handle error directive", async () => {
        const src = new tokens(`#error \"this is an error\"`, `main.lsl`);

        const result = await preprocessing([src]);
        expect(result.empty()).toBeTruthy();
    });

    it("should handle warning directive", async () => {
        const src = new tokens(`#warning \"this is a warning\"\nFOO`, `main.lsl`);

        const result = await preprocessing([src]);
        expect(result.str).toEqual("FOO");
    });

    xit("should handle include directive", async () => {
        const src = new tokens(`#include \"test.h\"`, `main.lsl`);

        const result = await preprocessing([src]);
        expect(result.str).toEqual("included content");
    });

    xit("should handle pragma once", async () => {
        spyOn(file, 'exists').and.returnValue(Promise.resolve(true));
        spyOn(read_file, 'read_file').and.returnValue(Promise.resolve(new tokens("content")));
        spyOn(file, 'uri').and.returnValue("test.h");

        const src1 = new tokens();
        src1.push_back(new token("#pragma once"));
        src1.push_back(new token("content"));

        const src2 = new tokens();
        src2.push_back(new token("#include \"test.h\""));

        await preprocessing([src1]);  // Simulate preprocessing the included file first
        const result = await preprocessing([src2]);
        expect(result.empty()).toBeTruthy();
    });

    it("should handle function-like macros", async () => {
        const src = new tokens(`#define ADD(x, y) ((x) + (y))\nADD(1, 2)`, `main.lsl`);

        const result = await preprocessing([src]);
        expect(result.str).toEqual("((1)+(2 ) )");
    });

    it("should handle variadic macros", async () => {
        const src = new tokens(`#define LOG(fmt, ...) printf(fmt, __VA_ARGS__)\nLOG(\"value: %d\", 42)`, `main.lsl`);

        const result = await preprocessing([src]);
        expect(result.str).toEqual(`printf("value: %d",42 )`);
    });

    it("should handle hash concatenation in macros", async () => {
        const src = new tokens(`#define CONCAT(a, b) a ## b\nCONCAT(foo, bar)`, `main.lsl`);

        const result = await preprocessing([src]);
        expect(result.str).toEqual("foobar");
    });

    it("should handle stringification in macros", async () => {
        const src = new tokens(`#define STR(x) #x\nSTR(foo)`, `main.lsl`);

        const result = await preprocessing([src]);
        expect(result.str).toEqual(`"foo"`);
    });

});