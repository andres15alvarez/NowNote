import React, { useMemo, useRef, useState } from 'react';

import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';

import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import createLinkPlugin from '@draft-js-plugins/anchor';
import editorStyles from './editorStyles.module.css';
import buttonStyles from './buttonStyles.module.css';
import toolbarStyles from './toolbarStyles.module.css';
import { EditorState } from 'draft-js';
import { BoldButton, ItalicButton, UnderlineButton } from '@draft-js-plugins/buttons';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';

const text = 'In this editor a toolbar with a lot more options shows up once you select part of the text …';
const linkPlugin = createLinkPlugin({ placeholder: 'http://…' });

export const ThemedInlineToolbarEditor = () => {
    const [plugins, Toolbar] = useMemo(() => {
        const staticToolbarPlugin = createToolbarPlugin();
        return [[staticToolbarPlugin], staticToolbarPlugin.Toolbar];
    }, []);
    const editor = useRef<Editor | null>(null);
    const [editorState, setEditorState] = useState(createEditorStateWithText(text));
    const onChange = (editorState: EditorState) => setEditorState(editorState);
    const focus = () => editor.current?.focus();
    return (
        <div
            className={editorStyles.editor}
            onClick={focus}>
            <Editor
                editorState={editorState}
                onChange={onChange}
                plugins={plugins}
                ref={(element) => {
                    editor.current = element;
                }}
            />
            <Toolbar />
        </div>
    )
}