import { PropMapMetadata } from "../../core/doc/dataTypes/models";
import { LIB_NAME } from "../constants";

export const textPropTypes:PropMapMetadata = {
    text: {
        type: "text"
    },
    color: {
        type: "color",
        lib: LIB_NAME
    },
    font: {
        type: "font",
        lib: LIB_NAME
    }
}