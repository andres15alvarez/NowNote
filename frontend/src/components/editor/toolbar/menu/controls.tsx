import { INLINE_STYLES, BLOCK_TYPES, TABS, REDO_UNDO } from "../../../utils/constants";
import { Link } from "../../../utils/svg/link";
import { EditorState, ContentBlock } from 'draft-js';
import { getSelectedBlock } from "draftjs-utils"

interface controlsProps {
    editorState: EditorState,
    onToggle: any
}

interface linkStyleProps {
    editorState: EditorState,
    onToggle: any,
    url: string,
    setUrl: any
}

export const StyleButton = ({ active, style, label, onToggle }: any) => {
    return (
        <button
            className={active ? "activeButton" : ""}
            onClick={e => onToggle(style)}
        >
            {label}
        </button>
    );
}

export const InlineStyleControls = ({ editorState, onToggle }: controlsProps) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map((type: any, idx: number) => (
                <StyleButton
                    key={`type.label-${idx}`}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={onToggle}
                    style={type.style}
                />
            ))}
        </div>
    );
}

export const BlockStyleControls = ({ editorState, onToggle }: controlsProps) => {
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map((type: any, idx: number) => (
                <StyleButton
                    key={`${type.label}-${idx}`}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={onToggle}
                    style={type.style}
                />
            ))}
        </div>
    );
}

export const LinkStyleControls = ({ editorState, onToggle, url, setUrl }: linkStyleProps) => {
    let active = false;
    const linkStyle = 'LINK';
    const contentState = editorState.getCurrentContent();
    const contentBlock = getSelectedBlock(editorState) as ContentBlock;
    contentBlock.findEntityRanges((character: any) => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === 'LINK'
        );
    }, (start, end) => {
        const cursorStart = editorState.getSelection().getStartOffset();
        if (start <= cursorStart && cursorStart < end) active = true;
    });
    return (
        <div className="linkSubMenu">
            <input type="text" onChange={(e: any) => setUrl(e.target.value)} value={url} placeholder="Ingrese enlace" />
            <StyleButton
                active={active}
                label={<Link />}
                onToggle={onToggle}
                style={{ linkStyle }}
            />
        </div>
    )
}

export const TabControls = ({ onToggle }: controlsProps) => {
    return (
        <div>
            {TABS.map((tab: any, idx: number) => (
                <StyleButton
                    key={`${tab.name}-${idx}`}
                    active={false}
                    label={tab.component}
                    onToggle={onToggle}
                    style={tab.value}
                />
            ))}
        </div>
    )
}

export const RedoControls = ({ onToggle }: controlsProps) => {
    return (
        <div>
            {REDO_UNDO.map((tab: any, idx: number) => (
                <StyleButton
                    key={`${tab.name}-${idx}`}
                    active={false}
                    label={tab.component}
                    onToggle={onToggle}
                    style={tab.value}
                />
            ))}
        </div>
    )
}