import { Bold, Italic, Underline, HighLight } from './svg/inlineType';
import { List, NumberList } from "./svg/list";
import { Redo, Tab } from "./svg/menuArrow";

export const INLINE_STYLES = [
    { label: <Bold />, style: 'BOLD' },
    { label: <Italic />, style: 'ITALIC' },
    { label: <Underline />, style: 'UNDERLINE' },
    { label: <HighLight />, style: 'HIGHLIGHT' }
]

export const BLOCK_TYPES = [
    { label: <List />, style: 'unordered-list-item' },
    { label: <NumberList />, style: 'ordered-list-item' },
]

export const TABS = [
    { name: "tabLeft", component: <Tab transform="scale(-1, 1)" transform-origin="center" />, value: "-1" },
    { name: "tabRight", component: <Tab />, value: "1" },
]

export const REDO_UNDO = [
    { name: "undo", component: <Redo transform="scale(-1, 1)" transform-origin="center" />, value: "-1" },
    { name: "redo", component: <Redo />, value: "1" },
]
