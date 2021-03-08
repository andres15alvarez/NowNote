
import { CompositeDecorator } from "draft-js";
import { findLinkEntities, Link } from "./decoratorComponents";

export const decorator = new CompositeDecorator([
    {
        strategy: findLinkEntities,
        component: Link
    }
])