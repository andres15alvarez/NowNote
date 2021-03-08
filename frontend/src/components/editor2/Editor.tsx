import React, { Component, useEffect, useMemo, useRef, useState } from 'react';

import Editor, { createEditorStateWithText } from '@draft-js-plugins/editor';

import createInlineToolbarPlugin, {
    Separator,
} from '@draft-js-plugins/inline-toolbar';
import {
    ItalicButton,
    BoldButton,
    UnderlineButton,
    CodeButton,
    HeadlineOneButton,
    HeadlineTwoButton,
    HeadlineThreeButton,
    UnorderedListButton,
    OrderedListButton,
    BlockquoteButton,
    CodeBlockButton,
} from '@draft-js-plugins/buttons';
import editorStyles from './editorStyles.module.css';
import { EditorState } from 'draft-js';
import '@draft-js-plugins/inline-toolbar/lib/plugin.css';

const HeadlinesPicker = (props: any) => {
    const onWindowClick = () => props.onOverrideContent(undefined);
    const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
    useEffect(() => {
        setTimeout(() => window.addEventListener('click', onWindowClick));
        return () => window.removeEventListener('click', onWindowClick)
    }, [])
    return (
        <div>
            {buttons.map((Button, idx) => (
                <Button key={idx} {...props} />
            ))}
        </div>
    )
}

const HeadlinesButton = (props: any) => {
    const onMouseDown = (e: any) => e.preventDefault();
    const onClick = () => props.onOverrideContent(HeadlinesPicker);
    return (
        <div
            onMouseDown={onMouseDown}
            className={editorStyles.headlineButtonWrapper}
        >
            <button
                onClick={onClick}
                className={editorStyles.headlineButton}
            >
                H
            </button>
        </div>
    )
}

const text = 'In this editor a toolbar shows up once you select part of the text …';

export const CustomInlineToolbarEditor = () => {
    const [editorState, setEditorState] = useState(createEditorStateWithText(text));
    const [plugins, InlineToolbar] = useMemo(() => {
        const inlineToolbarPlugin = createInlineToolbarPlugin();
        return [[inlineToolbarPlugin], inlineToolbarPlugin.InlineToolbar];
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
            <InlineToolbar>
                {
                    // may be use React.Fragment instead of div to improve perfomance after React 16
                    (externalProps) => (
                        <div>
                            <BoldButton {...externalProps} />
                            <ItalicButton {...externalProps} />
                            <UnderlineButton {...externalProps} />
                            <CodeButton {...externalProps} />
                            <Separator />
                            <HeadlinesButton {...externalProps} />
                            <UnorderedListButton {...externalProps} />
                            <OrderedListButton {...externalProps} />
                            <BlockquoteButton {...externalProps} />
                            <CodeBlockButton {...externalProps} />
                        </div>
                    )
                }
            </InlineToolbar>
        </div>
    )
}