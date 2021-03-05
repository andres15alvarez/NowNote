import React from 'react';
import "./Toolbar.scss";
import { AlignLeft, AlignCenter, AlignEnd } from "../../utils/svg/Align";
import { Link } from "../../utils/svg/link";
import { Menu } from "./menu/dropdownMenu/Menu";
import { EditorState, RichUtils, Modifier, SelectionState, ContentBlock } from "draft-js";
import { InlineStyleControls, BlockStyleControls, LinkStyleControls, TabControls, RedoControls } from "./menu/controls";
import { getSelectedBlock } from "draftjs-utils";
import { onTab } from '../editorFunctions/editorFunctions';
import { createNewContentState } from "../editorFunctions/editorFunctions";
const { useState, useEffect } = React;

interface ToolbarProps {
    setEditorState: React.Dispatch<React.SetStateAction<EditorState>>,
    editorState: EditorState
}

const initialFontSize = [
    { name: "FONTSIZE_8", component: "8", active: false },
    { name: "FONTSIZE_9", component: "9", active: false },
    { name: "FONTSIZE_10", component: "10", active: false },
    { name: "FONTSIZE_12", component: "12", active: false },
    { name: "FONTSIZE_14", component: "14", active: false },
    { name: "FONTSIZE_16", component: "16", active: true },
    { name: "FONTSIZE_18", component: "18", active: false },
    { name: "FONTSIZE_20", component: "20", active: false },
    { name: "FONTSIZE_24", component: "24", active: false },
    { name: "FONTSIZE_30", component: "30", active: false },
    { name: "FONTSIZE_36", component: "36", active: false },
    { name: "FONTSIZE_48", component: "48", active: false },
]

const initialFontFamily = [
    { name: "Sans Serif", component: "Sans Serif", active: true },
    { name: "Times New Roman", component: "Times New Roman", active: false },
    { name: "MonoSpace", component: "Monospace", active: false },
    { name: "Arial", component: "Arial", active: false },
]

export const Toolbar: React.FC<ToolbarProps> = ({ setEditorState, editorState }) => {
    const [align, setAlign] = useState([
        { name: "left", component: <AlignLeft />, active: true },
        { name: "center", component: <AlignCenter />, active: false },
        { name: "right", component: <AlignEnd />, active: false }]);
    const [fontSize, setFontSize] = useState(initialFontSize);
    const [fontFamily, setFontFamily] = useState(initialFontFamily);
    const [url, setUrl] = useState('');

    useEffect(() => {
        const textAlign = getSelectedBlock(editorState).getData().get('text-align');
        let newAlign = [...align];
        if (!textAlign) {
            newAlign = newAlign.map(_item => {
                _item.active = _item.name === "left";
                return _item;
            })
        }
        else {
            newAlign = newAlign.map(_item => {
                _item.active = _item.name === textAlign;
                return _item;
            })
        }
        setAlign(newAlign);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editorState])

    const toggleBlockType = (blockType: string) => {
        setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    };

    const toggleInlineStyle = (inlineStyle: string) => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    };

    const toggleLink = () => {
        const contentState = editorState.getCurrentContent();
        let parsedUrl = url;
        if (!/(http|https):\/\/www/.test(parsedUrl)) parsedUrl = 'http://www.' + parsedUrl;
        const contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', {
            url: parsedUrl,
        });
        const selection = editorState.getSelection();
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const contentStateWithLink = Modifier.applyEntity(contentStateWithEntity, selection, entityKey);
        const newEditorState = EditorState.set(editorState, {
            currentContent: contentStateWithLink,
        });
        setEditorState(RichUtils.toggleLink(newEditorState, selection, entityKey))
    }

    const toggleTab = (value: string) => setEditorState(onTab(editorState, value))

    const toggleRedo = (value: string) => {
        let newEditor = editorState;
        if (+value > 0)
            newEditor = EditorState.redo(newEditor);
        else if (+value < 0)
            newEditor = EditorState.undo(newEditor);
        setEditorState(newEditor);
    }

    const handleAlignClick = ({ item }: any) => {
        const alignStyle = item['name'];
        let newState = createNewContentState(editorState, (data, newContentState) => {
            const metadata = data.getData().toJS();
            let blockSelected = SelectionState.createEmpty(data.getKey());
            return Modifier.setBlockData(newContentState, blockSelected, { ...metadata, 'text-align': alignStyle })
        })
        newState = EditorState.forceSelection(newState, editorState.getSelection());
        setEditorState(newState);
    }

    const handleFontSizeClick = ({ item, idx }: any) => {
        let newFontSize = [...fontSize];
        const prevFontSize = fontSize.filter(item => item.active === true);
        const fontSizeName = item['name'];
        newFontSize = newFontSize.map((_item, index) => {
            _item.active = index === idx;
            return _item;
        })
        let newState = RichUtils.toggleInlineStyle(editorState, prevFontSize[0].name);
        newState = RichUtils.toggleInlineStyle(newState, fontSizeName);
        console.log(getSelectedBlock(newState).toJS())
        setEditorState(newState);
        setFontSize(newFontSize);
    }

    const handleFontFamilyClick = ({ item, idx }: any) => {
        let newFontFamily = [...fontFamily];
        const prevFontFamily = fontFamily.filter(font => font.active === true);
        const fontFamilyName = item['name'];
        newFontFamily.map((_item, index) => {
            _item.active = index === idx;
            return _item;
        });
        let newContentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();
        newContentState = Modifier.removeInlineStyle(newContentState, selectionState, prevFontFamily[0].name);
        newContentState = Modifier.applyInlineStyle(newContentState, selectionState, fontFamilyName);
        const newState = EditorState.push(editorState, newContentState, "change-inline-style");
        setEditorState(newState);
    }

    const preventClearSelection = (e: any) => {
        if (e.target.tagName === "INPUT") return;
        e.preventDefault();
    }

    return (
        <div className='toolbar' onMouseDown={preventClearSelection}>
            <div className="options">
                <InlineStyleControls
                    editorState={editorState}
                    onToggle={toggleInlineStyle}
                />
                <BlockStyleControls
                    editorState={editorState}
                    onToggle={toggleBlockType}
                />
                <Menu
                    className="button"
                    subMenuItems={fontSize}
                    onClickSubMenuItem={handleFontSizeClick}
                />
                <Menu
                    className="button"
                    subMenuItems={fontFamily}
                    onClickSubMenuItem={handleFontFamilyClick}
                />
                <Menu
                    className="button"
                    subMenuItems={<LinkStyleControls
                        editorState={editorState}
                        onToggle={toggleLink}
                        url={url}
                        setUrl={setUrl}
                    />}
                    onClickSubMenuItem={handleAlignClick}
                    defaultItem={<Link />}
                />
                <div id='url-input' className='hidden'>
                    <input id='txtFormatUrl' placeholder='url' />
                    <button>Create Link</button>
                </div>
                <Menu
                    className="button"
                    subMenuItems={align}
                    onClickSubMenuItem={handleAlignClick}
                />
                <TabControls
                    editorState={editorState}
                    onToggle={toggleTab}
                />
                <RedoControls
                    editorState={editorState}
                    onToggle={toggleRedo}
                />
            </div>
        </div>
    )
}