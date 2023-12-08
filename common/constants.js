const constants = {};

constants.DATA_DIR = "../data";

constants.RAW_DIR = constants.DATA_DIR+"/raw";
constants.DATASET_DIR = constants.DATA_DIR+"/dataset";
constants.IMG_DIR = constants.DATASET_DIR+"/images";

constants.ROW_OUTSOURCE_DIR = constants.RAW_DIR+"/outsource/source";
constants.TRANS_OUTSOURCE_DIR = constants.RAW_DIR+"/outsource";
constants.INSOURCE_DIR = constants.RAW_DIR+"/insource";
constants.SAMPLES_DIR = constants.DATASET_DIR+"/samples";
constants.JOSN_DIR = constants.DATASET_DIR+"/jsonA";
constants.FEATURES_JSON = constants.DATASET_DIR+"/features.json";
constants.FEATURES_JS = constants.DATASET_DIR+"/features.js";
constants.TRANING_SAMPLES = constants.DATASET_DIR+"/traningSamples.js";
constants.TESTING_SAMPLES = constants.DATASET_DIR+"/testingSamples.js";

if(typeof module !== "undefined"){
    module.exports = constants;
}