import * as React from "react";
import { ElementRect } from "./types";
import "./document_view.css";
import { DocumentMargin } from "./DocumentMargin";
import { elementIdFromDom } from "./viewElementIdentification";

interface Props {
    rerenderSequence: number
    margins: number
    style: React.CSSProperties
    zoom: number
    onRectChange?: (rects: ElementRect[]) => void
}
 
type PartialMutationRecord = {
    target: Node
}

export const DocumentView:React.SFC<Props> = (props) => {

    const ref = React.useRef<HTMLDivElement>();
    const boxRef = React.useRef<HTMLDivElement>();


    const handleMutations = (mutations:PartialMutationRecord[]) => {
        const marginRect = ref.current.getBoundingClientRect();
        const borderRect = boxRef.current.getBoundingClientRect();
        const rects = mutations
            .map(m => ({
                m,
                elementId: ("getAttribute" in m.target)? elementIdFromDom(m.target): undefined
            }))
            .filter(pair => !!pair.elementId)
            .map<ElementRect>(pair => { 
                const r = (pair.m.target as Element).getBoundingClientRect();
                return {
                    
                    display: {
                        ...r,
                        width: r.width, 
                        height: r.height,
                        top: r.top - marginRect.top,
                        left: r.left - marginRect.left
                    },

                    actual: {
                        ...r,
                        width: r.width / props.zoom, 
                        height: r.height / props.zoom,
                        top: (r.top - borderRect.top) / props.zoom,
                        left: (r.left - borderRect.left) / props.zoom,
                        bottom: r.bottom / props.zoom,
                        right: r.right / props.zoom
                    },
                    
                    info: pair.elementId
                }
            });

        if (props.onRectChange) props.onRectChange(rects);
    }

    // refresh rectangles on mount and zoom changes
    React.useEffect(() => {
        let all:PartialMutationRecord[] = [];
        ref.current.querySelectorAll("*").forEach(n => all.push({ target: n }));
        handleMutations(all);
    }, [props.zoom, props.rerenderSequence]);

    React.useEffect(() => {
        let mo = new MutationObserver(handleMutations);
        mo.observe(ref.current, { childList: true, subtree: true });
        return () => mo.disconnect();
    }, []);

    return (
        <div 
            ref={ref}
            style={{ 
                ...props.style,
                display: "block", 
                transformOrigin: "0 0", 
                transform: `scale(${props.zoom})`, 
                position: "relative", 
                top: 0, 
                left: 0
            }}>
            <DocumentMargin margin={props.margins}>
                <div className="document-view" ref={boxRef}>

                    {props.children}
                    
                </div>
            </DocumentMargin>
        </div>
    );
}