import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { ContentBlock, ContentState } from "draft-js";
import { SET_HOVERLINK } from "../../reducers/actionTypes/storeActionTypes";
import { useState } from "react";

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

export const Link = (props: any) => {
    const [hover, setHover] = useState(false);
    const dispatch = useDispatch();
    const { url } = props.contentState.getEntity(props.entityKey).getData();
    const mouseEnter = ({ target }: any) => {
        setHover(true);
        const offsetX = target.getBoundingClientRect().left;
        const offsetY = target.getBoundingClientRect().top + target.offsetHeight + 10;
        const width = target.getBoundingClientRect().width;
        const height = target.getBoundingClientRect().height;
        dispatch({
            type: SET_HOVERLINK, payload: {
                url,
                offsetX,
                offsetY,
                tooltipHeight: height,
                tooltipWidth: width,
            }
        })
    }
    const mouseLeave = (e: any) => {
        setHover(false);
        dispatch({
            type: SET_HOVERLINK, payload: {
                url: "",
                offsetX: 0,
                offsetY: 0,
                tooltipHeight: 0,
                tooltipWidth: 0,
            }
        })
    }
    return (
        <div
            className={'tooltip'}
            onMouseEnter={mouseEnter}
            onMouseLeave={mouseLeave}>
            <a className={`hyperlink ${hover ? "active" : ""}`}>
                {props.children}
            </a>
            {hover ? <div className="link-tooltip">
                <a href={"https://youtu.be/GNhn6ETbf2E"} target="_BLANK">{url}</a>
            </div> : ""}
        </div>
    );
};