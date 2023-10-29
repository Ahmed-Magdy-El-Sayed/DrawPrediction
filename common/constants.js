const constants = {};

constants.DATA_DIR = "../data";

constants.RAW_DIR = constants.DATA_DIR+"/raw";
constants.DATASET_DIR = constants.DATA_DIR+"/dataset";

constants.JOSN_DIR = constants.DATASET_DIR+"/json";
constants.NDJOSN_DIR = constants.DATASET_DIR+"/ndjson";
constants.IMG_DIR = constants.DATASET_DIR+"/images";
constants.SAMPLES_DIR = constants.DATASET_DIR+"/samples";
constants.FEATURES = constants.DATASET_DIR+"/features.json";

if(typeof module !== "undefined"){
    module.exports = constants;
}