import { error } from "../../../error.js";
import { file } from "../../../system/file.js";
import { string } from "../../../text/string.js";

export var llspec = {};

export const load_spec = async (url) => {
    if (Object.keys(llspec).length === 0) {

        if (!url || string.empty(url)) url = `./lsl_data.json`;
        if (!file.exists(url)) throw new error(`could not find file ${url}`);

        const txt = await file.load_text(url);
        llspec = JSON.parse(txt);

        llspec.functions[`llReplaceSubString`] = {
            "desc": `Returns a string that is the result of replacing the first count matching instances pattern in src with replacement_pattern.`,
            "sleep": 0,
            "type": `string`,
            "deprecated": false,
            "god-mode": false,
            "energy": 10,
            "arg_numb": 4,
            "arg_0": {
                "name": "src",
                "type": "string",
                "desc": ""
            },
            "arg_1": {
                "name": "pattern",
                "type": "string",
                "desc": ""
            },
            "arg_2": {
                "name": "replacement_pattern",
                "type": "string",
                "desc": ""
            },
            "arg_3": {
                "name": "count",
                "type": "integer",
                "desc": ""
            }
        };

        llspec.functions[`llLinksetDataCountFound`] = {
            "desc": `The llLinksetDataCountFound function returns the number of keys in the linkset datastore that match the pattern supplied in the pattern.`,
            "sleep": 0,
            "type": `integer`,
            "deprecated": false,
            "god-mode": false,
            "energy": 10,
            "arg_numb": 1,
            "arg_0": {
                "name": "pattern",
                "type": "string",
                "desc": "A regular expression describing which keys to return."
            }
        };

        llspec.functions[`llList2ListSlice`] = {
            "desc": `Returns a list of the slice_index'th element of every stride in strided list whose index is a multiple of stride in the range start to end.`,
            "sleep": 0,
            "type": `list`,
            "deprecated": false,
            "god-mode": false,
            "energy": 10,
            "arg_numb": 5,
            "arg_0": {
                "name": "src",
                "type": "list",
                "desc": ""
            },
            "arg_1": {
                "name": "start",
                "type": "integer",
                "desc": "start index"
            },
            "arg_2": {
                "name": "end",
                "type": "integer",
                "desc": "end index"
            },
            "arg_3": {
                "name": "stride",
                "type": "integer",
                "desc": "number of entries per stride, if less than 1 it is assumed to be 1"
            },
            "arg_4": {
                "name": "slice_index",
                "type": "integer",
                "desc": ""
            }
        };

        llspec.functions[`llLinksetDataDeleteFound`] = {
            "desc": `The llLinksetDataDeleteFound function finds and attempts to delete all keys in the data store that match pattern. This function will delete protected key-value pairs only if the matching pass phrase is passed in the pass parameter. The function returns a list, the first entry in the list is the number of keys deleted, the second entry in the list is the number of keys that could not be deleted due to a non-matching pass phrase. If this function successfully deletes any keys from the datastore it will trigger a linkset_data event with the type of LINKSET_DATA_MULTIDELETE, the key name will consist of a comma separated list of the key names removed from the datastore.`,
            "sleep": 0,
            "type": `list`,
            "deprecated": false,
            "god-mode": false,
            "energy": 10,
            "arg_numb": 2,
            "arg_0": {
                "name": "pattern",
                "type": "string",
                "desc": "A regular expression describing which keys to delete."
            },
            "arg_1": {
                "name": "pass",
                "type": "string",
                "desc": "Optional pass phrase to delete protected keys."
            }
        };
        
        llspec.functions[`llListFindListNext`] = {
            "desc": `Returns the integer index of the nth instance of test in src.`,
            "sleep": 0,
            "type": `integer`,
            "deprecated": false,
            "god-mode": false,
            "energy": 10,
            "arg_numb": 3,
            "arg_0": {
                "name": "src",
                "type": "list",
                "desc": "what to search in (haystack)"
            },
            "arg_1": {
                "name": "test",
                "type": "list",
                "desc": "what to search for (needles)"
            },
            "arg_2": {
                "name": "instance",
                "type": "integer",
                "desc": "which instance (needle) to return"
            }
        };
    }
}

export const clear_specs = () => {
    llspec = {};
};

