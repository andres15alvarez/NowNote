import React from 'react';
import "./Toolbar.scss";
import { AlignLeft, AlignCenter, AlignEnd } from "../../utils/svg/Align";
import { Link } from "../../utils/svg/link";
import { Menu } from "./menu/dropdownMenu/Menu";
import { EditorState, RichUtils, Modifier, SelectionState, ContentBlock, CharacterMetadata, Editor, ContentState } from "draft-js";
import { InlineStyleControls, BlockStyleControls, LinkStyleControls, TabControls, RedoControls } from "./menu/controls";
import { getSelectedBlock, getSelectedBlocksList, getSelectionCustomInlineStyle, getCurrentInlineStyle } from "draftjs-utils";
import { onTab, removeStylesWithPrefix } from '../editorFunctions/editorFunctions';
import { createNewContentState } from "../editorFunctions/editorFunctions";
import { customInlineStyleFontSize, customInlineStyleFontFamily } from "../../utils/constants";
const { useState, useEffect } = React;

interface ToolbarProps {
    setEditorState: React.Dispatch<React.SetStateAction<EditorState>>,
    editorState: EditorState
}

const initialStates = {
    initialFontSize: () => {
        let fontSize = customInlineStyleFontSize.map(font => ({ name: font, component: font.split("_")[1], active: false }));
        fontSize[5].active = true;
        return fontSize;
    },
    initialFontFamily: () => {
        let fontFamily = customInlineStyleFontFamily.map(font => ({ name: font, component: font.split("_")[1], active: false }));
        fontFamily[0].active = true;
        return fontFamily;
    }
}

export const Toolbar: React.FC<ToolbarProps> = ({ setEditorState, editorState }) => {
    const [align, setAlign] = useState([
        { name: "left", component: <AlignLeft />, active: true },
        { name: "center", component: <AlignCenter />, active: false },
        { name: "right", component: <AlignEnd />, active: false }]);
    const [fontSize, setFontSize] = useState(initialStates.initialFontSize());
    const [fontFamily, setFontFamily] = useState(initialStates.initialFontFamily());
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
        const fontSizeName = item['name'];
        newFontSize = newFontSize.map((_item, index) => {
            _item.active = index === idx;
            return _item;
        })
        let newState = removeStylesWithPrefix(editorState, "FONTSIZE_");
        newState = RichUtils.toggleInlineStyle(newState, fontSizeName);
        setEditorState(newState);
        setFontSize(newFontSize);
    }

    const handleFontFamilyClick = ({ item, idx }: any) => {
        let newFontFamily = [...fontFamily];
        const fontFamilyName = item['name'];
        newFontFamily.map((_item, index) => {
            _item.active = index === idx;
            return _item;
        });
        let newState = removeStylesWithPrefix(editorState, "FONTFAMILY_");
        newState = RichUtils.toggleInlineStyle(newState, fontFamilyName);
        setEditorState(newState);
        setFontFamily(newFontFamily);
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