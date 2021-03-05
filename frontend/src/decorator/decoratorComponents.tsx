
import { ContentBlock, ContentState } from "draft-js";

export const findLinkEntities = (contentBlock: ContentBlock, callback: any, contentState: ContentState) => {
    contentBlock.findEntityRanges(
        (character: any) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === 'LINK'
            );
        },
        callback
    );
}

export const Link = ({ contentState, entityKey, children }: any) => {
    const { url } = contentState.getEntity(entityKey).getData();
    const gotoPage = () => {
        const start = window.getSelection()?.anchorOffset;
        const end = window.getSelection()?.focusOffset;
        if (start && end && end === start) window.open(url);
    };
    return (
        <a href={url} onClick={gotoPage} style={{ cursor: 'pointer' }}>
            {children}
        </a>
    );
};