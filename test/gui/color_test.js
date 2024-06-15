import {
    color, color_copy, color_equals, color_set, degre_2_unit, percent_2_u16, percent_2_unit, u16_2_u8, u16_2_unit, 
    u8_2_u16, u8_2_unit, unit_2_degre, unit_2_percent, unit_2_u16
} from "../../lib/gui/color.js";
import { numb } from "../../lib/math/number.js";


describe(`color`, () => {
    xit(`dummy`, () => expect(true).toBeFalse());

    xit(`const`, () => {
        expect(UINT8_2_UINT16).toBe(257);
        expect(UINT16_2_UINT8).toBeCloseTo(0.0038910505836575876, 5);
        expect(UINT16_2_UNIT).toBeCloseTo(1.5259021896696422e-05, 5);
        expect(DEG_2_UINT16).toBeCloseTo(182.04166666666666, 5);
        expect(UINT16_2_DEG).toBeCloseTo(0.0054932478828107123, 5);
        expect(DEG_2_UNIT).toBeCloseTo(0.0027777777777777779, 5);
        expect(PERCENT_2_UINT16).toBeCloseTo(655.35000000000002, 5);
        expect(UINT16_2_PERCENT).toBeCloseTo(0.0015259021896696422, 5);
        expect(PERCENT_2_UNIT).toBeCloseTo(0.01, 5);

        expect(color.RGB).toEqual(1);
        expect(color.UNIT).toEqual(2);
        expect(color.RGBA).toEqual(3);
        expect(color.HEX).toEqual(4);
        expect(color.HSV).toEqual(5);
        expect(color.HSL).toEqual(6);
    });

    xit(`func`, () => {

        expect(u8_2_u16(255)).toBeCloseTo(65535, 0);
        expect(u8_2_u16(0)).toBeCloseTo(0, 0);
        expect(u8_2_u16(161.6369210840148)).toBeCloseTo(41541, 0);
        expect(u8_2_u16(113.64163313335054)).toBeCloseTo(29206, 0);
        expect(u8_2_u16(105.93887981108675)).toBeCloseTo(27226, 0);
        expect(u8_2_u16(122.79736230931452)).toBeCloseTo(31559, 0);
        expect(u8_2_u16(151.97747289325554)).toBeCloseTo(39058, 0);
        expect(u8_2_u16(45.149462805811289)).toBeCloseTo(11603, 0);
        expect(u8_2_u16(132.06268736797958)).toBeCloseTo(33940, 0);
        expect(u8_2_u16(115.38332920981293)).toBeCloseTo(29654, 0);
        expect(u8_2_u16(226.0062584708765)).toBeCloseTo(58084, 0);
        expect(u8_2_u16(160.21103308206924)).toBeCloseTo(41174, 0);
        expect(u8_2_u16(163.73141317340921)).toBeCloseTo(42079, 0);
        expect(u8_2_u16(205.91980436376895)).toBeCloseTo(52921, 0);
        expect(u8_2_u16(113.38332783226322)).toBeCloseTo(29140, 0);
        expect(u8_2_u16(127.90772512926506)).toBeCloseTo(32872, 0);
        expect(u8_2_u16(163.37859749080337)).toBeCloseTo(41988, 0);
        expect(u8_2_u16(124.49003987665341)).toBeCloseTo(31994, 0);
        expect(u8_2_u16(131.60298010195052)).toBeCloseTo(33822, 0);
        expect(u8_2_u16(59.48960758430146)).toBeCloseTo(15289, 0);
        expect(u8_2_u16(2.9993750116349349)).toBeCloseTo(771, 0);
        expect(u8_2_u16(128.71548369492348)).toBeCloseTo(33080, 0);

        expect(u16_2_u8(65535)).toBeCloseTo(255, 5);
        expect(u16_2_u8(0)).toBeCloseTo(0, 5);
        expect(u16_2_u8(50889.739571221697)).toBeCloseTo(198, 5);
        expect(u16_2_u8(29686.923585183296)).toBeCloseTo(116, 5);
        expect(u16_2_u8(30526.820527760592)).toBeCloseTo(119, 5);
        expect(u16_2_u8(56578.192827577273)).toBeCloseTo(220, 5);
        expect(u16_2_u8(14759.319078863378)).toBeCloseTo(57, 5);
        expect(u16_2_u8(50685.579037136711)).toBeCloseTo(197, 5);
        expect(u16_2_u8(28627.56149546208)).toBeCloseTo(111, 5);
        expect(u16_2_u8(2270.1127954928306)).toBeCloseTo(9, 5);
        expect(u16_2_u8(57526.391396691928)).toBeCloseTo(224, 5);
        expect(u16_2_u8(54705.643337745001)).toBeCloseTo(213, 5);
        expect(u16_2_u8(53078.57560890336)).toBeCloseTo(207, 5);
        expect(u16_2_u8(18639.961721352145)).toBeCloseTo(73, 5);
        expect(u16_2_u8(31585.374530246427)).toBeCloseTo(123, 5);
        expect(u16_2_u8(16114.980779332302)).toBeCloseTo(63, 5);
        expect(u16_2_u8(27363.80434381749)).toBeCloseTo(106, 5);
        expect(u16_2_u8(47819.442758842808)).toBeCloseTo(186, 5);
        expect(u16_2_u8(7733.6691985115813)).toBeCloseTo(30, 5);
        expect(u16_2_u8(7047.8716583157047)).toBeCloseTo(27, 5);
        expect(u16_2_u8(18434.887753387455)).toBeCloseTo(72, 5);
        expect(u16_2_u8(54540.312939723)).toBeCloseTo(212, 5);

        expect(unit_2_u16(1)).toBeCloseTo(65535, 2);
        expect(u16_2_u8(0)).toBeCloseTo(0, 4);
        expect(unit_2_u16(0.17820994750205665)).toBeCloseTo(11679, 0);
        expect(unit_2_u16(0.63359865502050539)).toBeCloseTo(41523, 0);
        expect(unit_2_u16(0.60837419642236523)).toBeCloseTo(39870, 0);
        expect(unit_2_u16(0.65588919859026051)).toBeCloseTo(42984, 0);
        expect(unit_2_u16(0.081656001789840893)).toBeCloseTo(5351, 0);
        expect(unit_2_u16(0.4169055282170141)).toBeCloseTo(27322, 0);
        expect(unit_2_u16(0.45764146870861089)).toBeCloseTo(29992, 0);
        expect(unit_2_u16(0.80713407738746268)).toBeCloseTo(52896, 0);
        expect(unit_2_u16(0.47021577674980763)).toBeCloseTo(30816, 0);
        expect(unit_2_u16(0.72393673576471418)).toBeCloseTo(47443, 0);
        expect(unit_2_u16(0.43179043656100058)).toBeCloseTo(28297, 0);
        expect(unit_2_u16(0.98404034279814678)).toBeCloseTo(64489, 0);
        expect(unit_2_u16(0.0052272164753018879)).toBeCloseTo(343, 0);
        expect(unit_2_u16(0.0017448466242023786)).toBeCloseTo(114, 0);
        expect(unit_2_u16(0.6165828325083641)).toBeCloseTo(40408, 0);
        expect(unit_2_u16(0.90541238628502108)).toBeCloseTo(59336, 0);
        expect(unit_2_u16(0.26962843553002691)).toBeCloseTo(17670, 0);
        expect(unit_2_u16(0.052994440237848051)).toBeCloseTo(3473, 0);
        expect(unit_2_u16(0.85125632040926724)).toBeCloseTo(55787, 0);
        expect(unit_2_u16(0.41841473086774783)).toBeCloseTo(27421, 0);

        expect(u16_2_unit(65535)).toBeCloseTo(1, 5);
        expect(u16_2_unit(0)).toBeCloseTo(0, 4);
        expect(u16_2_unit(51703.948773924989)).toBeCloseTo(0.78895168648699154, 5);
        expect(u16_2_unit(27373.262572837666)).toBeCloseTo(0.41768921298295059, 5);
        expect(u16_2_unit(15392.092459685347)).toBeCloseTo(0.2348682758783146, 5);
        expect(u16_2_unit(29785.612487325125)).toBeCloseTo(0.45449931315060843, 5);
        expect(u16_2_unit(47520.85882720058)).toBeCloseTo(0.72512182539407311, 5);
        expect(u16_2_unit(22096.820721661999)).toBeCloseTo(0.33717587123921566, 5);
        expect(u16_2_unit(23907.83383370392)).toBeCloseTo(0.36481015997106769, 5);
        expect(u16_2_unit(1029.5477113573579)).toBeCloseTo(0.015709891071295612, 5);
        expect(u16_2_unit(138.06463252733104)).toBeCloseTo(0.0021067312508938896, 5);
        expect(u16_2_unit(34574.753807446774)).toBeCloseTo(0.52757692542071832, 5);
        expect(u16_2_unit(29855.109501137511)).toBeCloseTo(0.45555976960612665, 5);
        expect(u16_2_unit(22429.44004098529)).toBeCloseTo(0.34225131671603404, 5);
        expect(u16_2_unit(9201.8834356186235)).toBeCloseTo(0.14041174083495267, 5);
        expect(u16_2_unit(15625.596652457516)).toBeCloseTo(0.23843132146879553, 5);
        expect(u16_2_unit(17295.618847370424)).toBeCloseTo(0.2639142267089406, 5);
        expect(u16_2_unit(7397.976551937938)).toBeCloseTo(0.11288588619726769, 5);
        expect(u16_2_unit(48101.338916624161)).toBeCloseTo(0.73397938378918381, 5);
        expect(u16_2_unit(43186.786365613501)).toBeCloseTo(0.65898811880084684, 5);
        expect(u16_2_unit(32781.843813197891)).toBeCloseTo(0.50021887255966879, 5);
        expect(u16_2_unit(65280.92834091137)).toBeCloseTo(0.99612311499063666, 5);

        expect(degre_2_unit(360)).toBeCloseTo(1, 5);
        expect(degre_2_unit(0)).toBeCloseTo(0, 5);
        expect(degre_2_unit(305.21108154409063)).toBeCloseTo(0.84780855984469627, 5);
        expect(degre_2_unit(246.52442284445848)).toBeCloseTo(0.68479006345682913, 5);
        expect(degre_2_unit(84.735028867932442)).toBeCloseTo(0.23537508018870124, 5);
        expect(degre_2_unit(205.71675913952194)).toBeCloseTo(0.57143544205422758, 5);
        expect(degre_2_unit(90.042392218712862)).toBeCloseTo(0.25011775616309129, 5);
        expect(degre_2_unit(351.01049822964035)).toBeCloseTo(0.97502916174900101, 5);
        expect(degre_2_unit(205.61074763909195)).toBeCloseTo(0.5711409656641443, 5);
        expect(degre_2_unit(208.32841865951042)).toBeCloseTo(0.57869005183197342, 5);
        expect(degre_2_unit(120.44734484035142)).toBeCloseTo(0.33457595788986505, 5);
        expect(degre_2_unit(21.944167034328721)).toBeCloseTo(0.060956019539802009, 5);
        expect(degre_2_unit(296.78843861966283)).toBeCloseTo(0.8244123294990634, 5);
        expect(degre_2_unit(318.37582926517263)).toBeCloseTo(0.8843773035143685, 5);
        expect(degre_2_unit(165.53971982804632)).toBeCloseTo(0.45983255507790644, 5);
        expect(degre_2_unit(101.38382217747537)).toBeCloseTo(0.28162172827076493, 5);
        expect(degre_2_unit(129.20845273916939)).toBeCloseTo(0.358912368719915, 5);
        expect(degre_2_unit(112.643656168194)).toBeCloseTo(0.31289904491164999, 5);
        expect(degre_2_unit(302.25724627575863)).toBeCloseTo(0.83960346187710733, 5);
        expect(degre_2_unit(113.03864800327045)).toBeCloseTo(0.31399624445352903, 5);
        expect(degre_2_unit(132.09829126653651)).toBeCloseTo(0.3669396979626014, 5);
        expect(degre_2_unit(254.54906945840753)).toBeCloseTo(0.70708074849557645, 5);

        expect(unit_2_degre(1)).toBeCloseTo(360, 5);
        expect(unit_2_degre(0)).toBeCloseTo(0, 5);
        expect(unit_2_degre(0.8677549985146642)).toBeCloseTo(312.39179946527912, 5);
        expect(unit_2_degre(0.46708931221597538)).toBeCloseTo(168.15215239775114, 5);
        expect(unit_2_degre(0.25051284202542445)).toBeCloseTo(90.184623129152797, 5);
        expect(unit_2_degre(0.71534220307076701)).toBeCloseTo(257.52319310547614, 5);
        expect(unit_2_degre(0.30832971240592544)).toBeCloseTo(110.99869646613315, 5);
        expect(unit_2_degre(0.9941375289898271)).toBeCloseTo(357.88951043633773, 5);
        expect(unit_2_degre(0.92057553659771418)).toBeCloseTo(331.4071931751771, 5);
        expect(unit_2_degre(0.84626359932195094)).toBeCloseTo(304.65489575590232, 5);
        expect(unit_2_degre(0.88692634499428202)).toBeCloseTo(319.29348419794155, 5);
        expect(unit_2_degre(0.597262633698326)).toBeCloseTo(215.01454813139736, 5);
        expect(unit_2_degre(0.55599452435073649)).toBeCloseTo(200.15802876626515, 5);
        expect(unit_2_degre(0.32052786270492928)).toBeCloseTo(115.39003057377454, 5);
        expect(unit_2_degre(0.5815218165921141)).toBeCloseTo(209.34785397316108, 5);
        expect(unit_2_degre(0.58828964481402357)).toBeCloseTo(211.78427213304849, 5);
        expect(unit_2_degre(0.10676463162485572)).toBeCloseTo(38.435267384948062, 5);
        expect(unit_2_degre(0.59877368908929651)).toBeCloseTo(215.55852807214674, 5);
        expect(unit_2_degre(0.087924617809735595)).toBeCloseTo(31.652862411504813, 5);
        expect(unit_2_degre(0.4507247093487895)).toBeCloseTo(162.26089536556421, 5);
        expect(unit_2_degre(0.10195986804879753)).toBeCloseTo(36.705552497567112, 5);
        expect(unit_2_degre(0.91159074315041955)).toBeCloseTo(328.17266753415106, 5);

        expect(percent_2_u16(100)).toBeCloseTo(65535, 0);
        expect(percent_2_u16(0)).toBeCloseTo(0, 0);
        expect(percent_2_u16(9.9747165221173226)).toBeCloseTo(6537, 0);
        expect(percent_2_u16(99.397970465805798)).toBeCloseTo(65140, 0);
        expect(percent_2_u16(19.005615412682342)).toBeCloseTo(12455, 0);
        expect(percent_2_u16(66.231517532780529)).toBeCloseTo(43405, 0);
        expect(percent_2_u16(87.112291958755733)).toBeCloseTo(57089, 0);
        expect(percent_2_u16(94.999221698081854)).toBeCloseTo(62258, 0);
        expect(percent_2_u16(46.300677991039699)).toBeCloseTo(30343, 0);
        expect(percent_2_u16(49.130759691043593)).toBeCloseTo(32198, 0);
        expect(percent_2_u16(52.512058542815829)).toBeCloseTo(34414, 0);
        expect(percent_2_u16(76.279753932324709)).toBeCloseTo(49990, 0);
        expect(percent_2_u16(85.004295550203722)).toBeCloseTo(55708, 0);
        expect(percent_2_u16(94.616359880592398)).toBeCloseTo(62007, 0);
        expect(percent_2_u16(14.527388619357096)).toBeCloseTo(9521, 0);
        expect(percent_2_u16(86.164977878897176)).toBeCloseTo(56468, 0);
        expect(percent_2_u16(16.243036704526347)).toBeCloseTo(10645, 0);
        expect(percent_2_u16(2.2771915796725439)).toBeCloseTo(1492, 0);
        expect(percent_2_u16(88.915711412601951)).toBeCloseTo(58271, 0);
        expect(percent_2_u16(6.1006204480765325)).toBeCloseTo(3998, 0);
        expect(percent_2_u16(49.258349769186907)).toBeCloseTo(32281, 0);
        expect(percent_2_u16(87.277167989418729)).toBeCloseTo(57197, 0);

        expect(percent_2_unit(100)).toBeCloseTo(1, 5);
        expect(percent_2_unit(0)).toBeCloseTo(0, 5);
        expect(percent_2_unit(64.809701010464096)).toBeCloseTo(0.64809701010464094, 5);
        expect(percent_2_unit(22.886004574634068)).toBeCloseTo(0.2288600457463407, 5);
        expect(percent_2_unit(54.156676163167937)).toBeCloseTo(0.54156676163167938, 5);
        expect(percent_2_unit(14.234870111767206)).toBeCloseTo(0.14234870111767206, 5);
        expect(percent_2_unit(49.640697502630502)).toBeCloseTo(0.49640697502630504, 5);
        expect(percent_2_unit(67.501982966098879)).toBeCloseTo(0.67501982966098883, 5);
        expect(percent_2_unit(51.744805838278943)).toBeCloseTo(0.5174480583827894, 5);
        expect(percent_2_unit(28.198657136788764)).toBeCloseTo(0.28198657136788763, 5);
        expect(percent_2_unit(81.692194488304693)).toBeCloseTo(0.81692194488304692, 5);
        expect(percent_2_unit(97.35188304029279)).toBeCloseTo(0.97351883040292797, 5);
        expect(percent_2_unit(32.650895272465931)).toBeCloseTo(0.3265089527246593, 5);
        expect(percent_2_unit(43.795292338191501)).toBeCloseTo(0.43795292338191505, 5);
        expect(percent_2_unit(20.582562715037067)).toBeCloseTo(0.20582562715037067, 5);
        expect(percent_2_unit(48.528268061254487)).toBeCloseTo(0.48528268061254487, 5);
        expect(percent_2_unit(80.196253717370737)).toBeCloseTo(0.80196253717370736, 5);
        expect(percent_2_unit(17.982968994758309)).toBeCloseTo(0.17982968994758308, 5);
        expect(percent_2_unit(54.666179585387098)).toBeCloseTo(0.54666179585387098, 5);
        expect(percent_2_unit(61.773098996471731)).toBeCloseTo(0.61773098996471731, 5);
        expect(percent_2_unit(83.959698492563518)).toBeCloseTo(0.83959698492563517, 5);
        expect(percent_2_unit(19.074464820865501)).toBeCloseTo(0.190744648208655, 5);

        expect(unit_2_percent(1)).toBeCloseTo(100, 5);
        expect(unit_2_percent(0)).toBeCloseTo(0, 5);
        expect(unit_2_percent(0.3025144255710398)).toBeCloseTo(30.251442557103982, 5);
        expect(unit_2_percent(0.25012570812460644)).toBeCloseTo(25.012570812460645, 5);
        expect(unit_2_percent(0.19633164704573081)).toBeCloseTo(19.63316470457308, 5);
        expect(unit_2_percent(0.10231711304983837)).toBeCloseTo(10.231711304983836, 5);
        expect(unit_2_percent(0.16247563678381549)).toBeCloseTo(16.24756367838155, 5);
        expect(unit_2_percent(0.56614515058839243)).toBeCloseTo(56.614515058839245, 5);
        expect(unit_2_percent(0.58207602265988256)).toBeCloseTo(58.207602265988257, 5);
        expect(unit_2_percent(0.45020049963406172)).toBeCloseTo(45.020049963406173, 5);
        expect(unit_2_percent(0.85290754752638775)).toBeCloseTo(85.290754752638776, 5);
        expect(unit_2_percent(0.59160983704825643)).toBeCloseTo(59.16098370482564, 5);
        expect(unit_2_percent(0.73350343429816489)).toBeCloseTo(73.35034342981649, 5);
        expect(unit_2_percent(0.059689228757150548)).toBeCloseTo(5.9689228757150552, 5);
        expect(unit_2_percent(0.91888326239970375)).toBeCloseTo(91.888326239970368, 5);
        expect(unit_2_percent(0.17325848019705881)).toBeCloseTo(17.32584801970588, 5);
        expect(unit_2_percent(0.45788895486424552)).toBeCloseTo(45.788895486424551, 5);
        expect(unit_2_percent(0.70877799292761057)).toBeCloseTo(70.877799292761054, 5);
        expect(unit_2_percent(0.12966113116852329)).toBeCloseTo(12.966113116852329, 5);
        expect(unit_2_percent(0.57854274106235581)).toBeCloseTo(57.854274106235579, 5);
        expect(unit_2_percent(0.10297144858577711)).toBeCloseTo(10.297144858577711, 5);
        expect(unit_2_percent(0.22197371696529178)).toBeCloseTo(22.197371696529178, 5);


    });

    it(`constructor_000`, () => {
        const red = numb.irand(0, 0xff),
            green = numb.irand(0, 0xff),
            blue = numb.irand(0, 0xff);
        const col = new color(color.RGB, red, green, blue);

        expect(col[0]).toBe(u8_2_u16(red));
        expect(col[1]).toBe(u8_2_u16(green));
        expect(col[2]).toBe(u8_2_u16(blue));
        expect(col[3]).toBe(u8_2_u16(0xff));
    });

    it(`constructor_001`, () => {
        const red = numb.rand(0, 1);
        const green = numb.rand(0, 1);
        const blue = numb.rand(0, 1);
        const a = new color(color.UNIT, red, green, blue);

        expect(a[0]).toBe(unit_2_u16(red));
        expect(a[1]).toBe(unit_2_u16(green));
        expect(a[2]).toBe(unit_2_u16(blue));
        expect(a[3]).toBe(unit_2_u16(1));
    });

    it(`constructor_002`, () => {
        const red = numb.irand(0, 0xff);
        const green = numb.irand(0, 0xff);
        const blue = numb.irand(0, 0xff);
        const alpha = numb.irand(0, 0xff);
        const a = new color(color.RGBA, red, green, blue, alpha);

        expect(a[0]).toBe(u8_2_u16(red));
        expect(a[1]).toBe(u8_2_u16(green));
        expect(a[2]).toBe(u8_2_u16(blue));
        expect(a[3]).toBe(u8_2_u16(alpha));
    });

    it(`constructor_003`, () => {
        const red = numb.irand(0, 0xff);
        const green = numb.irand(0, 0xff);
        const blue = numb.irand(0, 0xff);
        const alpha = numb.irand(0, 0xff);

        const hex = `#${numb.u8_to_hex(alpha)}${numb.u8_to_hex(red)}${numb.u8_to_hex(green)}${numb.u8_to_hex(blue)}`;
        const a = new color(color.HEX, hex);

        expect(a[0]).toBe(u8_2_u16(red));
        expect(a[1]).toBe(u8_2_u16(green));
        expect(a[2]).toBe(u8_2_u16(blue));
        expect(a[3]).toBe(u8_2_u16(alpha));
    });

    xit(`constructor_004`, () => {
        const red = numb.irand(0, 0xff);
        const green = numb.irand(0, 0xff);
        const blue = numb.irand(0, 0xff);
        const alpha = numb.irand(0, 0xff);

        const hex = `#${numb.u8_to_hex(alpha)}${numb.u8_to_hex(red)}${numb.u8_to_hex(green)}${numb.u8_to_hex(blue)}`;
        const a = new color(color.HSV, hex);

        expect(a[0]).toBe(u8_2_u16(red));
        expect(a[1]).toBe(u8_2_u16(green));
        expect(a[2]).toBe(u8_2_u16(blue));
        expect(a[3]).toBe(u8_2_u16(alpha));
    });

    it(`rgb_000`, () => {
        let red = numb.irand(0, 0xff);
        let green = numb.irand(0, 0xff);
        let blue = numb.irand(0, 0xff);

        const col = new color(color.RGB, red, green, blue);

        expect(col.rgb.red).toBe(red);
        expect(col.rgb.green).toBe(green);
        expect(col.rgb.blue).toBe(blue);

        red = numb.irand(0, 0xff);
        col.rgb.red = red;
        expect(col.rgb.red).toBe(red);

        green = numb.irand(0, 0xff);
        col.rgb.green = green;
        expect(col.rgb.green).toBe(green);

        blue = numb.irand(0, 0xff);
        col.rgb.blue = blue;
        expect(col.rgb.blue).toBe(blue);
    });

    it(`unit_000`, () => {
        let red = Math.fround(numb.rand(0, 1));
        let green = Math.fround(numb.rand(0, 1));
        let blue = Math.fround(numb.rand(0, 1));
        const col = new color(color.UNIT, red, green, blue);

        expect(col.unit.red).toBeCloseTo(red, 4);
        expect(col.unit.green).toBeCloseTo(green, 4);
        expect(col.unit.blue).toBeCloseTo(blue, 4);

        red = Math.fround(numb.rand(0, 1));
        col.unit.red = red;
        expect(col.unit.red).toBeCloseTo(red, 4);

        green = Math.fround(numb.rand(0, 1));
        col.unit.green = green;
        expect(col.unit.green).toBeCloseTo(green, 4);

        blue = Math.fround(numb.rand(0, 1));
        col.unit.blue = blue;
        expect(col.unit.blue).toBeCloseTo(blue, 4);
    });

    it(`rgba_000`, () => {
        let red = numb.irand(0, 0xff);
        let green = numb.irand(0, 0xff);
        let blue = numb.irand(0, 0xff);
        let alpha = numb.irand(0, 0xff);

        const col = new color(color.RGBA, red, green, blue, alpha);

        expect(col.rgba.red).toBe(red);
        expect(col.rgba.green).toBe(green);
        expect(col.rgba.blue).toBe(blue);

        red = numb.irand(0, 0xff);
        col.rgba.red = red;
        expect(col.rgba.red).toBe(red);

        green = numb.irand(0, 0xff);
        col.rgba.green = green;
        expect(col.rgba.green).toBe(green);

        blue = numb.irand(0, 0xff);
        col.rgba.blue = blue;
        expect(col.rgba.blue).toBe(blue);

        alpha = numb.irand(0, 0xff);
        col.rgba.alpha = alpha;
        expect(col.rgba.alpha).toBe(alpha);

        expect(col.rgba.css).toBe(`rgba(${red}, ${green}, ${blue}, ${u8_2_unit(alpha).toFixed(4)})`);
    });

    it(`hsl_000`, () => {
        let hue = numb.irand(0, 360);
        let saturation = numb.irand(0, 100);
        let light = numb.irand(0, 100);
        let alpha = numb.rand(0, 1);

        const col = new color(color.HSL, hue, saturation, light);

        expect(col.hsl.hue).toBe(hue);
        expect(col.hsl.saturation).toBe(saturation);
        expect(col.hsl.light).toBe(light);

        hue = numb.irand(0, 360);
        col.hsl.hue = hue;
        expect(col.hsl.hue).toBe(hue);

        saturation = numb.irand(0, 100);
        col.hsl.saturation = saturation;
        expect(col.hsl.saturation).toBe(saturation);

        light = numb.irand(0, 100);
        col.hsl.light = light;
        expect(col.hsl.light).toBe(light);

        col.hsl.alpha = alpha;
        expect(col.hsl.css).toBe(`hsla(${hue}, ${saturation}%, ${light}%, ${numb.round_2_dec(alpha, 2)})`);
    });

    it(`hsv_000`, () => {
        let hue = numb.irand(0, 360);
        let saturation = numb.irand(0, 100);
        let value = numb.irand(0, 100);

        const col = new color(color.HSV, hue, saturation, value);

        expect(col.hsv.hue).toBe(hue);
        expect(col.hsv.saturation).toBe(saturation);
        expect(col.hsv.value).toBe(value);

        hue = numb.irand(0, 360);
        col.hsv.hue = hue;
        expect(col.hsv.hue).toBe(hue);

        saturation = numb.irand(0, 100);
        col.hsv.saturation = saturation;
        expect(col.hsv.saturation).toBe(saturation);

        value = numb.irand(0, 100);
        col.hsv.value = value;
        expect(col.hsv.value).toBe(value);

    });

    it(`color_set_000`, () => {
        let red = numb.irand(0, 0xff);
        let green = numb.irand(0, 0xff);
        let blue = numb.irand(0, 0xff);

        const col = new color();
        color_set(col, color.RGB, red, green, blue);

        expect(col.rgb.red).toBe(red);
        expect(col.rgb.green).toBe(green);
        expect(col.rgb.blue).toBe(blue);
    });

    it(`color_set_001`, () => {
        let red = Math.fround(numb.rand(0, 1));
        let green = Math.fround(numb.rand(0, 1));
        let blue = Math.fround(numb.rand(0, 1));

        const col = new color();
        color_set(col, color.UNIT, red, green, blue);

        expect(col.unit.red).toBeCloseTo(red, 4);
        expect(col.unit.green).toBeCloseTo(green, 4);
        expect(col.unit.blue).toBeCloseTo(blue, 4);
    });

    it(`color_set_002`, () => {
        let red = numb.irand(0, 0xff);
        let green = numb.irand(0, 0xff);
        let blue = numb.irand(0, 0xff);
        let alpha = numb.irand(0, 0xff);

        const col = new color();
        color_set(col, color.RGBA, red, green, blue, alpha);

        expect(col.rgba.red).toBe(red);
        expect(col.rgba.green).toBe(green);
        expect(col.rgba.blue).toBe(blue);
    });

    it(`color_set_003`, () => {
        let hue = numb.irand(0, 360);
        let saturation = numb.irand(0, 100);
        let light = numb.irand(0, 100);

        const col = new color();
        color_set(col, color.HSL, hue, saturation, light);

        expect(col.hsl.hue).toBe(hue);
        expect(col.hsl.saturation).toBe(saturation);
        expect(col.hsl.light).toBe(light);
    });

    it(`color_set_004`, () => {
        let hue = numb.irand(0, 360);
        let saturation = numb.irand(0, 100);
        let value = numb.irand(0, 100);

        const col = new color();
        color_set(col, color.HSV, hue, saturation, value);

        expect(col.hsv.hue).toBe(hue);
        expect(col.hsv.saturation).toBe(saturation);
        expect(col.hsv.value).toBe(value);
    });

    it(`color_equals_000`, () => {
        const cola = new color(), colb = new color();
        expect(color_equals(cola, colb)).toBeTrue();
    });

    it(`color_equals_001`, () => {
        let red = numb.irand(0, 0xff);
        let green = numb.irand(0, 0xff);
        let blue = numb.irand(0, 0xff);

        const cola = new color(color.RGB, red, green, blue),
            colb = new color(color.RGB, red, green, blue);
        expect(color_equals(cola, colb)).toBeTrue();
    });

    it(`color_copy_000`, () => {
        let red = numb.irand(0, 0xff);
        let green = numb.irand(0, 0xff);
        let blue = numb.irand(0, 0xff);

        const cola = new color(color.RGB, red, green, blue), colb = new color();
        color_copy(colb, cola);
        expect(color_equals(cola, colb)).toBeTrue();
    });

});

