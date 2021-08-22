import * as storeReducer from "./storeReducer"
// @ponicode
describe("storeReducer.storeReducer", () => {
    test("0", () => {
        let callFunction: any = () => {
            storeReducer.storeReducer(-100, false)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            storeReducer.storeReducer(0, { type: "SET_HOVERLINK", payload: { offsetX: 1, url: "www.google.com", tooltipHeight: 40, offsetY: 100, tooltipWidth: 80.0 } })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            storeReducer.storeReducer(0, { type: "SET_HOVERLINK", payload: { offsetX: 4, url: "www.google.com", tooltipHeight: 5, offsetY: 1, tooltipWidth: 150 } })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            storeReducer.storeReducer(100, { type: "string", payload: { offsetX: 1, url: "https://", tooltipHeight: 5, offsetY: 400, tooltipWidth: 1080 } })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            storeReducer.storeReducer("Île-de-France", { type: "array", payload: { offsetX: 1, url: "https://", tooltipHeight: 40, offsetY: 380, tooltipWidth: 15 } })
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            storeReducer.storeReducer(NaN, NaN)
        }
    
        expect(callFunction).not.toThrow()
    })
})
