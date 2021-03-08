import React, { useEffect, useMemo, useRef, useState } from 'react';

import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';

import createSideToolbarPlugin from '@draft-js-plugins/side-toolbar';
import createStaticToolbarPlugin from '@draft-js-plugins/static-toolbar';
import {
    BoldButton,
    ItalicButton,
    UnderlineButton,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton,
} from '@draft-js-plugins/buttons';
import { EditorState } from 'draft-js';
import '@draft-js-plugins/side-toolbar/lib/plugin.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import editorStyles from './editorStyles.module.css';
import buttonStyles from './buttonStyles.module.css';
import toolbarStyles from './toolbarStyles.module.css';
import blockTypeSelectStyles from './blockTypeSelectStyles.module.css';

const text = 'In this editor a toolbar shows up once you select part of the text …';

export const CustomSideToolbarEditor = () => {
    const [editorState, setEditorState] = useState(createEditorStateWithText(text));
    const [plugins, SideToolbar, StaticToolbar] = useMemo(() => {
        const sideToolbarPlugin = createSideToolbarPlugin({
            position: 'right',
            theme: { buttonStyles, toolbarStyles, blockTypeSelectStyles }
        });
        const staticToolbarPlugin = createStaticToolbarPlugin({
            theme: { buttonStyles, toolbarStyles },
        });
        return [[sideToolbarPlugin, staticToolbarPlugin], sideToolbarPlugin.SideToolbar, staticToolbarPlugin.Toolbar];
    }, [])

    const editor = useRef<Editor | null>(null);
    const onChange = (editorState: EditorState) => setEditorState(editorState);
    const focus = () => editor.current?.focus();
    return (
        <div
            onClick={focus}
            className={editorStyles.editor}
        >
            <Editor
                editorKey="CustomInlineToolbarEditor"
                editorState={editorState}
                onChange={onChange}
                plugins={plugins}
                ref={(element) => {
                    editor.current = element;
                }}
            />
            <StaticToolbar>
                {
                    (externalProps) => (
                        <>
                            <BoldButton {...externalProps} />
                            <UnderlineButton {...externalProps} />
                            <ItalicButton {...externalProps} />
                        </>
                    )
                }
            </StaticToolbar>
            <SideToolbar>
                {
                    // may be use React.Fragment instead of div to improve perfomance after React 16
                    (externalProps) => (
                        <>
                            <HeadlineOneButton {...externalProps} />
                            <HeadlineTwoButton {...externalProps} />
                            <HeadlineThreeButton {...externalProps} />
                            <UnorderedListButton {...externalProps} />
                            <OrderedListButton {...externalProps} />
                            <BlockquoteButton {...externalProps} />
                            <CodeBlockButton {...externalProps} />
                        </>
                    )
                }
            </SideToolbar>
        </div>
    )
}