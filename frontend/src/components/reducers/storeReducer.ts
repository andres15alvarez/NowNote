import { SET_HOVERLINK } from "./actionTypes/storeActionTypes";

export interface INITIAL_STORE_PROPS {
    hoverHyperLink: {
        url: string,
        offsetX: number,
        offsetY: number,
        tooltipWidth: number,
        tooltipHeight: number,
    }
}

const INITIAL_STORE: INITIAL_STORE_PROPS = {
    hoverHyperLink: {
        url: "",
        offsetX: 0,
        offsetY: 0,
        tooltipWidth: 0,
        tooltipHeight: 0,
    }
}

export type storeReducerType = (state: INITIAL_STORE_PROPS, action: any) => any

export const storeReducer: storeReducerType = (state = INITIAL_STORE, action: any) => {
    switch (action.type) {
        case SET_HOVERLINK:
            return {
                ...state, hoverHyperLink: {
                    url: action.payload.url,
                    offsetX: action.payload.offsetX,
                    offsetY: action.payload.offsetY,
                    tooltipHeight: action.payload.tooltipHeight,
                    tooltipWidth: action.payload.tooltipWidth,
                }
            };
        default:
            return state;
    }
}