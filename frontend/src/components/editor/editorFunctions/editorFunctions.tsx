
import { ContentBlock, ContentState, EditorState, Modifier, SelectionState } from "draft-js";
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

export const createNewContentState = (editorState: EditorState, blockListFunc: (data: ContentBlock, newContentState: ContentState) => ContentState): EditorState => {
    let newContentState: ContentState = editorState.getCurrentContent();
    const blockList = getSelectedBlocksList(editorState);
    blockList.forEach((data: ContentBlock) => {
        newContentState = blockListFunc(data, newContentState);
    });
    return EditorState.push(editorState, newContentState, "change-block-data");
}