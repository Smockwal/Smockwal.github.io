import { error } from "../../lib/global.js";
import {
    FORMAT_GRAY16, FORMAT_GRAY8, FORMAT_RGB8, FORMAT_RGBA8,
    image, image_from_url, image_new, image_to_color_index
} from "../../lib/gui/image.js";
import { sizei } from "../../lib/gui/size.js";
import { reset_index } from "../../lib/text/string.js";

const img_test_gray8 = [0, 0xFF, 0, 0xFF, 0, 0xFF, 0, 0xFF, 0, 0xFF, 0, 0xFF, 0, 0xFF, 0, 0xFF];
const img_test_gray16 = [0, 0xFFFF, 0, 0xFFFF, 0, 0xFFFF, 0, 0xFFFF, 0, 0xFFFF, 0, 0xFFFF, 0, 0xFFFF, 0, 0xFFFF];

const img_test_rgb = [
    0, 0, 0, 0xFF, 0xFF, 0xFF, 0, 0, 0, 0xFF, 0xFF, 0xFF,
    0, 0, 0, 0xFF, 0xFF, 0xFF, 0, 0, 0, 0xFF, 0xFF, 0xFF,
    0, 0, 0, 0xFF, 0xFF, 0xFF, 0, 0, 0, 0xFF, 0xFF, 0xFF,
    0, 0, 0, 0xFF, 0xFF, 0xFF, 0, 0, 0, 0xFF, 0xFF, 0xFF,
];

const img_test_rgba = [
    0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
    0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0, 0, 0, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
];

const img_test_10x10_rgba = [
    0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 254, 254, 254, 255, 1, 1, 1, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
    0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 254, 254, 254, 255, 1, 1, 1, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
    0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 254, 254, 254, 255, 1, 1, 1, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
    0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 254, 254, 254, 255, 1, 1, 1, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
    0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 254, 254, 254, 255, 1, 1, 1, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
    0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 254, 254, 254, 255, 1, 1, 1, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
    0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 254, 254, 254, 255, 1, 1, 1, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
    0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 254, 254, 254, 255, 1, 1, 1, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
    0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 254, 254, 254, 255, 1, 1, 1, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
    0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 254, 254, 254, 255, 1, 1, 1, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255
];

const img_test_10x10_rgb = [
    0, 0, 0, 255, 255, 255, 0, 0, 0, 254, 254, 254, 1, 1, 1, 255, 255, 255, 0, 0, 0, 255, 255, 255, 0, 0, 0, 255, 255, 255,
    0, 0, 0, 255, 255, 255, 0, 0, 0, 254, 254, 254, 1, 1, 1, 255, 255, 255, 0, 0, 0, 255, 255, 255, 0, 0, 0, 255, 255, 255,
    0, 0, 0, 255, 255, 255, 0, 0, 0, 254, 254, 254, 1, 1, 1, 255, 255, 255, 0, 0, 0, 255, 255, 255, 0, 0, 0, 255, 255, 255,
    0, 0, 0, 255, 255, 255, 0, 0, 0, 254, 254, 254, 1, 1, 1, 255, 255, 255, 0, 0, 0, 255, 255, 255, 0, 0, 0, 255, 255, 255,
    0, 0, 0, 255, 255, 255, 0, 0, 0, 254, 254, 254, 1, 1, 1, 255, 255, 255, 0, 0, 0, 255, 255, 255, 0, 0, 0, 255, 255, 255,
    0, 0, 0, 255, 255, 255, 0, 0, 0, 254, 254, 254, 1, 1, 1, 255, 255, 255, 0, 0, 0, 255, 255, 255, 0, 0, 0, 255, 255, 255,
    0, 0, 0, 255, 255, 255, 0, 0, 0, 254, 254, 254, 1, 1, 1, 255, 255, 255, 0, 0, 0, 255, 255, 255, 0, 0, 0, 255, 255, 255,
    0, 0, 0, 255, 255, 255, 0, 0, 0, 254, 254, 254, 1, 1, 1, 255, 255, 255, 0, 0, 0, 255, 255, 255, 0, 0, 0, 255, 255, 255,
    0, 0, 0, 255, 255, 255, 0, 0, 0, 254, 254, 254, 1, 1, 1, 255, 255, 255, 0, 0, 0, 255, 255, 255, 0, 0, 0, 255, 255, 255,
    0, 0, 0, 255, 255, 255, 0, 0, 0, 254, 254, 254, 1, 1, 1, 255, 255, 255, 0, 0, 0, 255, 255, 255, 0, 0, 0, 255, 255, 255
];

const img_test_10x10_gray8 = [
    0, 255, 0, 254, 1, 255, 0, 255, 0, 255,
    0, 255, 0, 254, 1, 255, 0, 255, 0, 255,
    0, 255, 0, 254, 1, 255, 0, 255, 0, 255,
    0, 255, 0, 254, 1, 255, 0, 255, 0, 255,
    0, 255, 0, 254, 1, 255, 0, 255, 0, 255,
    0, 255, 0, 254, 1, 255, 0, 255, 0, 255,
    0, 255, 0, 254, 1, 255, 0, 255, 0, 255,
    0, 255, 0, 254, 1, 255, 0, 255, 0, 255,
    0, 255, 0, 254, 1, 255, 0, 255, 0, 255,
    0, 255, 0, 254, 1, 255, 0, 255, 0, 255
];

const img_test_10x10_gray16 = [
    0, 65025, 0, 64770, 255, 65025, 0, 65025, 0, 65025,
    0, 65025, 0, 64770, 255, 65025, 0, 65025, 0, 65025,
    0, 65025, 0, 64770, 255, 65025, 0, 65025, 0, 65025,
    0, 65025, 0, 64770, 255, 65025, 0, 65025, 0, 65025,
    0, 65025, 0, 64770, 255, 65025, 0, 65025, 0, 65025,
    0, 65025, 0, 64770, 255, 65025, 0, 65025, 0, 65025,
    0, 65025, 0, 64770, 255, 65025, 0, 65025, 0, 65025,
    0, 65025, 0, 64770, 255, 65025, 0, 65025, 0, 65025,
    0, 65025, 0, 64770, 255, 65025, 0, 65025, 0, 65025,
    0, 65025, 0, 64770, 255, 65025, 0, 65025, 0, 65025
];

const equals = (value, test, err) => {
    if (value !== test) throw new error(`fail: ${err} ${value} !== ${test}`);
};

describe(`image test`, () => {
    xit(`dummy`, () => expect(true).toBeFalse());

    it(`constructor_000`, () => {
        let x = new image();
        expect(x.data).not.toBeDefined();
    });

    xit(`from_url_000`, async () => {
        expect(1).toBe(1);
        let x = new image(10, 10);
        image_from_url(x, "../data/10_x_10_pix_test.jpg", FORMAT_RGB8, e => {
            equals(e.width, 10, `fail: image width`);
            expect(e.width).toBe(10);
            expect(e.height).toBe(10);
            expect(e.data_length).toBe(100);
            expect(e.pixel_length).toBe(3);
            expect(e.format).toBe(FORMAT_RGB8);
            expect(e.data instanceof Uint8ClampedArray).toBeTrue();
            for (let i = 0; i < img_test_10x10_rgb.data_length; ++i) {
                expect(e.data[i]).toBe(img_test_10x10_rgb[i]);
            }
        });
        x.from_url("../data/10_x_10_pix_test.jpg", FORMAT_GRAY8, e => console.log(e));

    });

    xit(`from_url_001`, async () => {
        expect(1).toBe(1);
        let x = new image(10, 10);
        x.from_url("../data/10_x_10_pix_test.jpg", FORMAT_GRAY16, e => console.log(e));
    });

    xit(`from_url_001`, async () => {
        expect(1).toBe(1);
        let x = new image(10, 10);
        x.from_url("../data/10_x_10_pix_test.jpg", FORMAT_GRAY16, e => console.log(e));
    });

    xit(`pixel_at_factor_00`, async () => {
        expect(1).toBe(1);
        let x = new image(10, 10);
        x.from_url("../data/10_x_10_pix_test.jpg", FORMAT_RGBA8, e => console.log(e));
        //console.log(x);
        //expect(x._data).toBeDefined();
        //console.log(x.pixel_at_factor(0.9, 0.1));
    });

    xit(`block_00`, async () => {
        expect(1).toBe(1);
        let x = new image(10, 10);
        await x.load("./data/10_x_10_pix_test.jpg");
        const blc = x.block(0, 0, 4, 4);

        //console.log(x);
        expect(blc._data).toBeDefined();
        expect(blc._format).toBe(x._format);
        expect(blc._size.width).toBe(4);
        expect(blc._size.height).toBe(4);

        let t = [
            0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
            0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
            0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
            0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
        ];
        expect(blc._data.length).toBe(t.length);

        for (let i = 0; i < blc._data.length; ++i) {
            //expect(x._data[i]).toBe(t[i]);
        }
        //console.log(x.block(0, 0, 4, 4));
    });
    /*
        it(`block_01`, async () => {
            expect(1).toBe(1);
            let x = new image(10, 10);
            await x.load("./data/10_x_10_pix_test.jpg");
            const blc = x.block(2, 2, 4, 4, new image(4, 4), ALIGN_CENTER);
    
            //console.log(x);
            expect(blc._data).toBeDefined();
            expect(blc._format).toBe(x._format);
            expect(blc._size.width).toBe(4);
            expect(blc._size.height).toBe(4);
    
            let t = [
                0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
                0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
                0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
                0, 0, 0, 255, 255, 255, 255, 255, 0, 0, 0, 255, 255, 255, 255, 255,
            ];
            expect(blc._data.length).toBe(t.length);
    
            for (let i = 0; i < blc._data.length; ++i) {
                //expect(x._data[i]).toBe(t[i]);
            }
            //console.log(x.block(0, 0, 4, 4));
        });
    
        it(`block_02`, async () => {
            expect(1).toBe(1);
            let x = new image(10, 10);
            await x.load("./data/10_x_10_pix_test.jpg", FORMAT_GRAY8);
            const blc = x.block(0, 0, 4, 4);
    
            //console.log(x);
            expect(blc._data).toBeDefined();
            expect(blc._format).toBe(x._format);
            expect(blc._size.width).toBe(4);
            expect(blc._size.height).toBe(4);
    
            let t = [
                0, 255, 0, 255,
                0, 255, 0, 255,
                0, 255, 0, 255,
                0, 255, 0, 255,
            ];
            expect(blc._data.length).toBe(t.length);
    
            for (let i = 0; i < blc._data.length; ++i) {
                //expect(x._data[i]).toBe(t[i]);
            }
            //console.log(x.block(0, 0, 4, 4));
        });
    
        it(`block_03`, async () => {
            expect(1).toBe(1);
            let x = new image(10, 10);
            await x.load("./data/10_x_10_pix_test.jpg", FORMAT_GRAY8);
            const blc = x.block(0, 0, 4, 4, new image(4, 4), ALIGN_CENTER, PADDING_MIN);
    
            //console.log(x);
            expect(blc._data).toBeDefined();
            expect(blc._format).toBe(x._format);
            expect(blc._size.width).toBe(4);
            expect(blc._size.height).toBe(4);
    
            let t = [
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 255,
                0, 0, 0, 255,
            ];
            expect(blc._data.length).toBe(t.length);
    
            for (let i = 0; i < blc._data.length; ++i) {
                expect(blc._data[i]).toBe(t[i]);
            }
    
        });
    
        it(`block_04`, async () => {
            expect(1).toBe(1);
            let x = new image(10, 10);
            await x.load("./data/10_x_10_pix_test.jpg", FORMAT_GRAY8);
            const blc = x.block(10, 10, 4, 4, new image(4, 4), ALIGN_CENTER, PADDING_MAX);
    
            //console.log(x);
            expect(blc._data).toBeDefined();
            expect(blc._format).toBe(x._format);
            expect(blc._size.width).toBe(4);
            expect(blc._size.height).toBe(4);
    
            let t = [
                0, 255, 255, 255,
                0, 255, 255, 255,
                255, 255, 255, 255,
                255, 255, 255, 255,
            ];
            expect(blc._data.length).toBe(t.length);
    
            for (let i = 0; i < blc._data.length; ++i) {
                expect(blc._data[i]).toBe(t[i]);
            }
            //console.log(x.block(10, 10, 4, 4, new image(4, 4), ALIGN_CENTER));
        });
        // convolution
    
        it(`process_image_00`, async () => {
            expect(1).toBe(1);
            let x = new image(10, 10);
            await x.load("./data/10_x_10_pix_test.jpg", FORMAT_GRAY8);
    
            //console.log(process_image(x, kernel));
        });
        */
});


describe(`image func test`, () => {


    xit(`dummy`, () => expect(true).toBeFalse());

    beforeEach(async () => {
        reset_index();
    });

    it(`image_new_00`, async () => {

        expect(1).toBe(1);
        let x = image_new(new sizei(460, 460), FORMAT_GRAY8);
        expect(x.width).toBe(460);
        expect(x.height).toBe(460);
        expect(x.pixel_numb).toBe(460 * 460);
        expect(x.pixel_length).toBe(1);
        expect(x.format).toBe(FORMAT_GRAY8);
        expect(x.data instanceof Uint8ClampedArray).toBeTrue();
    });

    // image_new

    it(`image_new_01`, async () => {
        expect(1).toBe(1);
        let x = image_new();
        expect(x.name).toBe(`_`);
        expect(x.url).toBe(``);
        expect(x.width).toBe(0);
        expect(x.height).toBe(0);
        expect(x.pixel_length).toBe(4);
        expect(x.pixel_numb).toBe(0);
        expect(x.data_length).toBe(0);
        expect(x.format).toBe(FORMAT_RGBA8);
        expect(x.data instanceof Uint8ClampedArray).toBeTrue();
    });

    it(`image_from_url_00`, async () => {
        expect(1).toBe(1);

        image_from_url(new image(), "../data/10_x_10_pix_test.jpg", FORMAT_RGB8, e => {
            equals(e.type, `image`, `image type`);
            equals(e.name, `10_x_10_pix_test.jpg`, `image name`);
            equals(e.url, `../data/10_x_10_pix_test.jpg`, `image url`);
            equals(e.width, 10, `image width`);
            equals(e.height, 10, `image height`);
            equals(e.pixel_length, 3, `image pixel_length`);
            equals(e.pixel_numb, 100, `image pixel_numb`);
            equals(e.data_length, 300, `image data_length`);
            equals(e.format, FORMAT_RGB8, `image format`);
            for (let i = 0; i < img_test_10x10_rgb.length; ++i) {
                equals(e.data[i], img_test_10x10_rgb[i], `pixel ${i}`);
            }
        });
    });

    it(`image_from_url_01`, async () => {
        expect(1).toBe(1);

        image_from_url(new image(), "../data/10_x_10_pix_test.jpg", FORMAT_RGBA8, e => {
            equals(e.type, `image`, `image type`);
            equals(e.name, `10_x_10_pix_test.jpg`, `image name`);
            equals(e.url, `../data/10_x_10_pix_test.jpg`, `image url`);
            equals(e.width, 10, `image width`);
            equals(e.height, 10, `image height`);
            equals(e.pixel_length, 4, `image pixel_length`);
            equals(e.pixel_numb, 100, `image pixel_numb`);
            equals(e.data_length, 400, `image data_length`);
            equals(e.format, FORMAT_RGBA8, `image format`);
            for (let i = 0; i < img_test_10x10_rgba.length; ++i) {
                equals(e.data[i], img_test_10x10_rgba[i], `pixel ${i}`);
            }
        });

    });
    /*
        it(`image_load_02`, async () => {
            expect(1).toBe(1);
            image_load("./data/10_x_10_pix_test.jpg", 10, 10, FORMAT_GRAY8)
                .then(x => {
                    expect(x.width).toBe(10);
                    expect(x.height).toBe(10);
                    expect(x.length).toBe(100);
                    expect(x.pixel_length).toBe(1);
                    expect(x.format).toBe(FORMAT_GRAY8);
                    expect(x.data instanceof Uint8ClampedArray).toBeTrue();
                    for (let i = 0; i < img_test_10x10_gray8.length; ++i) {
                        expect(x.data[i]).toBe(img_test_10x10_gray8[i]);
                    }
                });
        });
    
        it(`image_load_03`, async () => {
            expect(1).toBe(1);
            image_load("./data/10_x_10_pix_test.jpg", 10, 10, FORMAT_GRAY16)
                .then(x => {
                    expect(x.width).toBe(10);
                    expect(x.height).toBe(10);
                    expect(x.length).toBe(100);
                    expect(x.pixel_length).toBe(1);
                    expect(x.format).toBe(FORMAT_GRAY16);
                    expect(x.data instanceof Uint16Array).toBeTrue();
                    for (let i = 0; i < img_test_10x10_gray16.length; ++i) {
                        expect(x.data[i]).toBe(img_test_10x10_gray16[i]);
                    }
                });
        });
    
        // image_resize
    
        it(`image_resize_00`, async () => {
            expect(1).toBe(1);
            //const can = canv_create_in(document.body, `image_resize_00`);
            //canv_set_size(can, 0xFF, 0xFF);
    
            let img = await image_load("./data/Image_test.jpg");
            await image_resize(img, 0xFF, 0xFF);
            //canv_draw_image(can, img, 0, 0, 0xFF, 0xFF);
    
            await image_resize(img, 0xFF / 2, 0xFF / 2);
            //canv_draw_image(can, img, 0, 0, 0xFF / 2, 0xFF / 2);
    
            let val = Math.floor((0xFF / 2));
            expect(img.width).toBe(val);
            expect(img.height).toBe(val);
            expect(img.length).toBe(val * val);
            expect(img.pixel_length).toBe(4);
            expect(img.format).toBe(FORMAT_RGBA8);
            expect(img.data instanceof Uint8ClampedArray).toBeTrue();
        });
    
        it(`image_resize_01`, async () => {
            expect(1).toBe(1);
            let img = await image_load("./data/Image_test.jpg", 0xFF, 0xFF, FORMAT_RGB8);
            img = await image_resize(img, 0xFF / 2, 0xFF / 2);
    
            let val = Math.floor((0xFF / 2));
            expect(img.width).toBe(val);
            expect(img.height).toBe(val);
            expect(img.length).toBe(val * val);
            expect(img.pixel_length).toBe(3);
            expect(img.format).toBe(FORMAT_RGB8);
            expect(img.data instanceof Uint8ClampedArray).toBeTrue();
        });
    
        // image_from_data
    
        it(`image_from_data_00`, async () => {
            expect(1).toBe(1);
            let img = await image_from_data(undefined, img_test_rgba, 4, 4, FORMAT_RGBA8);
            expect(img.width).toBe(4);
            expect(img.height).toBe(4);
            expect(img.length).toBe(4 * 4);
            expect(img.pixel_length).toBe(4);
            expect(img.format).toBe(FORMAT_RGBA8);
            for (let i = 0; i < img_test_rgba.length; ++i) {
                expect(img.data[i]).toBe(img_test_rgba[i]);
            }
        });
    
        it(`image_from_data_01`, async () => {
            expect(1).toBe(1);
            let img = await image_from_data(undefined, img_test_rgb, 4, 4, FORMAT_RGB8);
            expect(img.width).toBe(4);
            expect(img.height).toBe(4);
            expect(img.length).toBe(4 * 4);
            expect(img.pixel_length).toBe(3);
            expect(img.format).toBe(FORMAT_RGB8);
            for (let i = 0; i < img_test_rgb.length; ++i) {
                expect(img.data[i]).toBe(img_test_rgb[i]);
            }
        });
    
        it(`image_from_data_02`, async () => {
            expect(1).toBe(1);
            let img = await image_from_data(undefined, img_test_gray8, 4, 4, FORMAT_GRAY8);
            expect(img.width).toBe(4);
            expect(img.height).toBe(4);
            expect(img.length).toBe(4 * 4);
            expect(img.pixel_length).toBe(1);
            expect(img.format).toBe(FORMAT_GRAY8);
            for (let i = 0; i < img_test_gray8.length; ++i) {
                expect(img.data[i]).toBe(img_test_gray8[i]);
            }
            //console.log(img);
        });
    
        it(`image_from_data_03`, async () => {
            expect(1).toBe(1);
            let img = await image_from_data(undefined, img_test_gray16, 4, 4, FORMAT_GRAY16);
            expect(img.width).toBe(4);
            expect(img.height).toBe(4);
            expect(img.length).toBe(4 * 4);
            expect(img.pixel_length).toBe(1);
            expect(img.format).toBe(FORMAT_GRAY16);
            for (let i = 0; i < img_test_gray16.length; ++i) {
                expect(img.data[i]).toBe(img_test_gray16[i]);
            }
            //console.log(img);
        });
    
        // image_convert_to
    
        it(`image_convert_to_00`, async () => {
            expect(1).toBe(1);
            let img = await image_from_data(undefined, img_test_gray8, 4, 4, FORMAT_GRAY8);
            img = image_convert_to(img, FORMAT_GRAY16);
    
            expect(img.width).toBe(4);
            expect(img.height).toBe(4);
            expect(img.length).toBe(4 * 4);
            expect(img.pixel_length).toBe(1);
            expect(img.format).toBe(FORMAT_GRAY16);
            for (let i = 0; i < img_test_gray16.length; ++i) {
                expect(img.data[i]).toBe(img_test_gray16[i]);
            }
            //console.log(img);
        });
    
        it(`image_convert_to_01`, async () => {
            expect(1).toBe(1);
            let img = await image_from_data(undefined, img_test_gray8, 4, 4, FORMAT_GRAY8);
            img = image_convert_to(img, FORMAT_RGB8);
    
            expect(img.width).toBe(4);
            expect(img.height).toBe(4);
            expect(img.length).toBe(4 * 4);
            expect(img.pixel_length).toBe(3);
            expect(img.format).toBe(FORMAT_RGB8);
            for (let i = 0; i < img_test_rgb.length; ++i) {
                expect(img.data[i]).toBe(img_test_rgb[i]);
            }
            //console.log(img);
        });
    
        it(`image_convert_to_02`, async () => {
            expect(1).toBe(1);
            let img = await image_from_data(undefined, img_test_gray8, 4, 4, FORMAT_GRAY8);
            img = image_convert_to(img, FORMAT_RGBA8);
    
            expect(img.width).toBe(4);
            expect(img.height).toBe(4);
            expect(img.length).toBe(4 * 4);
            expect(img.pixel_length).toBe(4);
            expect(img.format).toBe(FORMAT_RGBA8);
            for (let i = 0; i < img_test_rgba.length; ++i) {
                expect(img.data[i]).toBe(img_test_rgba[i]);
            }
            //console.log(img);
        });
    
        it(`image_convert_to_03`, async () => {
            expect(1).toBe(1);
            let img = await image_from_data(undefined, img_test_gray16, 4, 4, FORMAT_GRAY16);
            img = image_convert_to(img, FORMAT_GRAY8);
    
            expect(img.width).toBe(4);
            expect(img.height).toBe(4);
            expect(img.length).toBe(4 * 4);
            expect(img.pixel_length).toBe(1);
            expect(img.format).toBe(FORMAT_GRAY8);
            for (let i = 0; i < img_test_gray8.length; ++i) {
                expect(img.data[i]).toBe(img_test_gray8[i]);
            }
            //console.log(img);
        });
    
        it(`image_convert_to_04`, async () => {
            expect(1).toBe(1);
            let img = await image_from_data(undefined, img_test_gray16, 4, 4, FORMAT_GRAY16);
            img = image_convert_to(img, FORMAT_RGB8);
    
            expect(img.width).toBe(4);
            expect(img.height).toBe(4);
            expect(img.length).toBe(4 * 4);
            expect(img.pixel_length).toBe(3);
            expect(img.format).toBe(FORMAT_RGB8);
            for (let i = 0; i < img_test_rgb.length; ++i) {
                expect(img.data[i]).toBe(img_test_rgb[i]);
            }
            //console.log(img);
        });
    
        it(`image_convert_to_05`, async () => {
            expect(1).toBe(1);
            let img = await image_from_data(undefined, img_test_gray16, 4, 4, FORMAT_GRAY16);
            img = image_convert_to(img, FORMAT_RGBA8);
    
            expect(img.width).toBe(4);
            expect(img.height).toBe(4);
            expect(img.length).toBe(4 * 4);
            expect(img.pixel_length).toBe(4);
            expect(img.format).toBe(FORMAT_RGBA8);
            for (let i = 0; i < img_test_rgba.length; ++i) {
                expect(img.data[i]).toBe(img_test_rgba[i]);
            }
            //console.log(img);
        });
    
        it(`image_convert_to_06`, async () => {
            expect(1).toBe(1);
            let img = await image_from_data(undefined, img_test_rgb, 4, 4, FORMAT_RGB8);
            img = image_convert_to(img, FORMAT_GRAY8);
    
            expect(img.width).toBe(4);
            expect(img.height).toBe(4);
            expect(img.length).toBe(4 * 4);
            expect(img.pixel_length).toBe(1);
            expect(img.format).toBe(FORMAT_GRAY8);
            for (let i = 0; i < img_test_gray8.length; ++i) {
                expect(img.data[i]).toBe(img_test_gray8[i]);
            }
            //console.log(img);
        });
    
        it(`image_convert_to_07`, async () => {
            expect(1).toBe(1);
            let img = await image_from_data(undefined, img_test_rgb, 4, 4, FORMAT_RGB8);
            img = image_convert_to(img, FORMAT_GRAY16);
    
            expect(img.width).toBe(4);
            expect(img.height).toBe(4);
            expect(img.length).toBe(4 * 4);
            expect(img.pixel_length).toBe(1);
            expect(img.format).toBe(FORMAT_GRAY16);
            for (let i = 0; i < img_test_gray16.length; ++i) {
                expect(img.data[i]).toBe(img_test_gray16[i]);
            }
            //console.log(img);
        });
    
        it(`image_convert_to_08`, async () => {
            expect(1).toBe(1);
            let img = await image_from_data(undefined, img_test_rgb, 4, 4, FORMAT_RGB8);
            img = image_convert_to(img, FORMAT_RGBA8);
    
            expect(img.width).toBe(4);
            expect(img.height).toBe(4);
            expect(img.length).toBe(4 * 4);
            expect(img.pixel_length).toBe(4);
            expect(img.format).toBe(FORMAT_RGBA8);
            for (let i = 0; i < img_test_rgba.length; ++i) {
                expect(img.data[i]).toBe(img_test_rgba[i]);
            }
            //console.log(img);
        });
    
        it(`image_convert_to_09`, async () => {
            expect(1).toBe(1);
            let img = await image_from_data(undefined, img_test_rgba, 4, 4, FORMAT_RGBA8);
            img = image_convert_to(img, FORMAT_GRAY8);
    
            expect(img.width).toBe(4);
            expect(img.height).toBe(4);
            expect(img.length).toBe(4 * 4);
            expect(img.pixel_length).toBe(1);
            expect(img.format).toBe(FORMAT_GRAY8);
            for (let i = 0; i < img_test_gray8.length; ++i) {
                expect(img.data[i]).toBe(img_test_gray8[i]);
            }
            //console.log(img);
        });
    
        it(`image_convert_to_10`, async () => {
            expect(1).toBe(1);
            let img = await image_from_data(undefined, img_test_rgba, 4, 4, FORMAT_RGBA8);
            img = image_convert_to(img, FORMAT_GRAY16);
    
            expect(img.width).toBe(4);
            expect(img.height).toBe(4);
            expect(img.length).toBe(4 * 4);
            expect(img.pixel_length).toBe(1);
            expect(img.format).toBe(FORMAT_GRAY16);
            for (let i = 0; i < img_test_gray16.length; ++i) {
                expect(img.data[i]).toBe(img_test_gray16[i]);
            }
            //console.log(img);
        });
    
        it(`image_convert_to_11`, async () => {
            expect(1).toBe(1);
            let img = await image_from_data(undefined, img_test_rgba, 4, 4, FORMAT_RGBA8);
            img = image_convert_to(img, FORMAT_RGB8);
    
            expect(img.width).toBe(4);
            expect(img.height).toBe(4);
            expect(img.length).toBe(4 * 4);
            expect(img.pixel_length).toBe(3);
            expect(img.format).toBe(FORMAT_RGB8);
            for (let i = 0; i < img_test_rgb.length; ++i) {
                expect(img.data[i]).toBe(img_test_rgb[i]);
            }
            //console.log(img);
        });
    
        // image_to_mat
    
        it(`image_to_mat_00`, async () => {
            expect(1).toBe(1);
            let x = new image(10, 10);
            await x.load("./data/10_x_10_pix_test.jpg", FORMAT_GRAY16);
    
            let m = new matgf(x.length, 1);
            image_to_mat(x, m, 0, 1);
            //console.log(m);
        });
    
        it(`mat_to_image_00`, async () => {
            expect(1).toBe(1);
            const width = 460;
            const height = 460;
            let x = new image(width, height);
            await x.load("./data/Image_test.jpg", FORMAT_GRAY8);
    
            let m = new matgf(x.length, 1);
            image_to_mat(x, m, 0, 1);
    
            //console.log(mat_to_image(m, width, height, FORMAT_GRAY8));
    
    
        });
        */

    xit(`image_to_color_index_000`, () => {
        image_from_url(new image(), "../data/10_x_10_pix_test.jpg", FORMAT_RGBA8, x => image_to_color_index(x));
    });

    xit(`image_to_color_index_001`, () => {
        image_from_url(new image(), "../data/Image_test.jpg", FORMAT_RGBA8, x => image_to_color_index(x));
    });
});
