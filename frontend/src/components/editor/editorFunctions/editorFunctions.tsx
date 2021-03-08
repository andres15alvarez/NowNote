
import { ContentBlock, ContentState, EditorState, Modifier, RichUtils, SelectionState } from "draft-js";
import { getSelectedBlocksList } from "draftjs-utils";

export const onTab = (editorState: EditorState, direction: string): EditorState => {
    const blockList = getSelectedBlocksList(editorState);
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const selection = {
        start: selectionState.getAnchorOffset(),
        end: selectionState.getFocusOffset(),
    }
    let newState: EditorState = editorState;
    let newContentState: ContentState = contentState;
    if (selection.start !== selection.end ||
        selection.start === 0 ||
        blockList.size > 1) {
        newState = createNewContentState(editorState, (data, newContentState) => {
            let metadata = data.getData().toJS();
            let tabLength = metadata['tab'];
            tabLength = tabLength ? +tabLength : 0;
            tabLength += +direction;
            if (tabLength < 0 || tabLength > 5) tabLength -= +direction;
            let blockSelected = SelectionState.createEmpty(data.getKey());
            return Modifier.setBlockData(newContentState, blockSelected, { ...metadata, 'tab': `${tabLength}` });
        });
        return EditorState.forceSelection(newState, selectionState);
    }
    else {
        newContentState = Modifier.insertText(contentState, selectionState, "    ");
        newState = EditorState.push(editorState, newContentState, "insert-characters");
    }

    return newState;
}

export const addLink = (editorState: EditorState, url: string) => {
    let parsedUrl = url;
    const contentState = editorState.getCurrentContent();
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
    return RichUtils.toggleLink(newEditorState, selection, entityKey);
}

export const createNewContentState = (editorState: EditorState, blockListFunc: (data: ContentBlock, newContentState: ContentState) => ContentState): EditorState => {
    let newContentState: ContentState = editorState.getCurrentContent();
    const blockList = getSelectedBlocksList(editorState);
    blockList.forEach((data: ContentBlock) => {
        newContentState = blockListFunc(data, newContentState);
    });
    return EditorState.push(editorState, newContentState, "change-block-data");
}

export const removeStylesWithPrefix = (editorState: EditorState, prefix: string) => {
    let newContentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    getSelectedBlocksList(editorState).forEach((data: ContentBlock) => {
        const characterList = data.getCharacterList().toArray();
        let removeStyles = new Set();
        characterList.forEach(character => {
            const currentCharStyles = character.getStyle().toArray().filter(style => style.startsWith(prefix));
            currentCharStyles.forEach(style => removeStyles.add(style))
        })
        removeStyles.forEach(style => {
            newContentState = Modifier.removeInlineStyle(newContentState, selectionState, style as string);
        })
    })
    let newEditorState = EditorState.push(editorState, newContentState, "change-inline-style");
    return newEditorState;
}