import React from 'react';
import { Toolbar } from './toolbar/Toolbar';
import "./Editor.scss";
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, ContentBlock } from "draft-js";
import "draft-js/dist/Draft.css";
import { decorator } from "../../decorator/decorator";
import { onTab } from './editorFunctions/editorFunctions';
import { getSelectedBlocksList } from "draftjs-utils";
import { customInlineStyleFontSize, customInlineStyleFontFamily } from "../utils/constants";
const { useState } = React;

const processStyleMap = () => {
    const fontSizes = customInlineStyleFontSize.map(fontSize => fontSize.split("_")[1]);
    const fontFamilies = customInlineStyleFontFamily.map(fontSize => fontSize);
    let styleMap: any = {
        'HIGHLIGHT': {
            'backgroundColor': '#faed27',
        }
    }
    fontSizes.forEach(fontSize => {
        styleMap[`FONTSIZE_${fontSize}`] = {
            'fontSize': `${fontSize}px`
        };
    })
    fontFamilies.forEach(fontFamily => {
        styleMap[fontFamily] = {
            'fontFamily': `${fontFamily.split("_")[1]}`
        };
    })
    return styleMap;
}

export const EditorBody = () => {
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty(decorator)
    );
    const editor = React.useRef(null);
    function focusEditor() {
        //@ts-ignore
        editor.current.focus();
    }
    const handleKeyCommand: any = (command: string, editorState: EditorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (!newState) return false;
        setEditorState(newState);
        return true;
    };

    const mapKeyToEditorCommand: any = (e: any) => {
        if (e.key === 'Tab' /* TAB */) {
            //FOR UL AND OL
            const newEditorState = RichUtils.onTab(e, editorState, 4);
            if (newEditorState !== editorState) setEditorState(newEditorState);
            else setEditorState(onTab(editorState, "1"))
            return false;
        }
        else if (e.keyCode === 8) {
            const blockList = getSelectedBlocksList(editorState).toArray();
            const tabData = blockList[0].getData().get('tab');
            const selectionState = editorState.getSelection();
            const selection = {
                start: selectionState.getAnchorOffset(),
                end: selectionState.getFocusOffset(),
            }
            if (selection.start === selection.end &&
                selection.start === 0 &&
                blockList.length === 1 &&
                +tabData > 0) {
                setEditorState(onTab(editorState, "-1"));
                return false;
            }
        }
        return getDefaultKeyBinding(e);
    };

    const MyBlockStyleFn = (contentBlock: ContentBlock) => {
        let paragraph = ["richText-textAlignment-block"];
        const contentData = contentBlock.getData();
        if (!contentData) return paragraph.join("");
        const blockAlignment = contentData.get('text-align');
        const tab = contentData.get('tab');
        if (blockAlignment)
            paragraph.push(`richText-${blockAlignment}-block`);
        if (tab)
            paragraph.push(`richText-tab-${tab}`)
        return paragraph.join(" ");
    }

    return (
        <>
            <div className="editorPanel">
                <Toolbar
                    setEditorState={setEditorState}
                    editorState={editorState}
                />
            </div>
            <div className="editorBody">
                <input type="text" className="titleInput" name="title" id="title" placeholder="Titulo" />
                <div
                    className="editorBorder"
                    onClick={focusEditor}
                >
                    <Editor
                        customStyleMap={processStyleMap()}
                        editorState={editorState}
                        handleKeyCommand={handleKeyCommand}
                        keyBindingFn={mapKeyToEditorCommand}
                        onChange={setEditorState}
                        blockStyleFn={MyBlockStyleFn}
                        placeholder="Write something!"
                        ref={editor}
                        spellCheck={true}
                    />
                </div>
            </div>
        </>
    );
}

