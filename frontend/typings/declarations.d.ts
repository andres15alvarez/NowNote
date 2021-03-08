/**
 * This interface can be augmented by users to add default types for the root state when
 * using `react-redux`.
 * Use module augmentation to append your own type definition in a your_custom_type.d.ts file.
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
 */
// tslint:disable-next-line:no-empty-interface
import { storeReducerType } from "../src/components/reducers/storeReducer";

export interface DefaultRootState {
    storeReducer: storeReducerType
}
