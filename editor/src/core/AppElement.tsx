import * as React from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import {  batchActions } from "redux-batched-actions";

import { ComponentFactory } from "./doc/docModels";
import { DocAction, ElementAddAction, ElementLocation, ElementMoveAction } from "./doc/state/actionModels";
import { PropMetadata } from "./doc/dataTypes/models";
import { useDocElementState } from "./doc/docHooks";
import { ViewElement } from "../viewport/ViewElement";
import { useDraggableAsset } from "./uiState/useDraggableAsset";
import { useViewDropTarget } from "./uiState/useViewDropTarget";
import { dragEnd } from "./uiState/ideState";
import { actionUpdate } from "../patterns/docEditor/docEditorState";
import { optionChanged } from "./uiState/optionState";
import { selectComponentMetadata } from "./doc/docLibSelectors";
import { ErrorShield } from "./ErrorShield";
import { COMPONENT_EDITOR_TAB_KEY, componentEditorTabs } from "./constants";
 
const combineRefs = (...refs:any[]) => (value:any) => {
    refs.forEach(ref => { 
        if (!ref) return;
        if (typeof ref === 'function') ref(value)
        else ref.current = value;
    });
}

interface Props {
    component: string
    elementId: string
    parentElementId?: string
    parentMetadata?: {[k:string]: PropMetadata }
    componentFactory: ComponentFactory
    onClick: (id:string) => void
    onHover: (id:string) => void
}

export const AppElement = (props:Props) => {
    const element = useDocElementState(props.component, props.elementId);
    
    const {  propTypes } = useSelector(s => selectComponentMetadata(s, element.type), shallowEqual);

    const dispatch = useDispatch();

    const drag = useDraggableAsset({
        type: "element",
        id: props.elementId,
        component: props.component
    });

    const drop = useViewDropTarget({
        accept: ["component", "element"],
        component: props.component,
        elementId: props.elementId,
        actionTypeResolver: (item, g) => {
            
            if (item.type == "element" && 
                item.id == props.elementId && 
                item.component == props.component) return undefined;

            if (props.parentElementId && ("children" in props.parentMetadata)) {

                const xMin = Math.floor(g.containerWidth * 0.1);
                const yMin = Math.floor(g.containerHeight * 0.1);
                if (g.offsetX < xMin || g.offsetY < yMin) return "before";
                
                const xMax = g.containerWidth - xMin;
                const yMax = g.containerHeight - yMin;
                if (g.offsetX >= xMax || g.offsetY >= yMax) return "after";
            
            }

            // TODO React-DnD drag-drop latency
            // TODO prevent drag-drop item in self or in child

            if ("children" in propTypes) return "in";

            return undefined;
            
        },
        onDrop: ({ actionType, item }) => {
            
            dispatch(dragEnd());

            if (!actionType) return;

            let location:ElementLocation = null;
            if (actionType == "before") {
                location = { 
                    component: props.component, 
                    containerElement: props.parentElementId,
                    before: props.elementId 
                }
            }
            else if (actionType == "in") {
                location = {
                    component: props.component,
                    containerElement: props.elementId
                }
            }
            else {
                location = {
                    component: props.component,
                    containerElement: props.parentElementId,
                    after: props.elementId
                }
            }

            let docAction:DocAction = null;
            if (item.type == "element") {
                docAction = {
                    type: "ELEMENT_MOVE",
                    fromComponent: item.component,
                    fromElementId: item.id,
                    location
                } as ElementMoveAction
            }

            else if (item.type == "component") {
                docAction = {
                    type: "ELEMENT_ADD",
                    elementType: item.uri,
                    props: item.props,
                    location
                } as ElementAddAction
            }

            dispatch(batchActions([
                actionUpdate(docAction), 
                optionChanged(COMPONENT_EDITOR_TAB_KEY, componentEditorTabs.adjust, false)
            ]));

            
        }
    });

    const { children = [], ...otherProps } = element.props;
    const C = props.componentFactory(element.type) as any;
    
    return (
        <ViewElement  
            elementId={props.elementId} 
            mute={element.isPreview}
            onClick={props.onClick} 
            onHover={props.onHover}>
            {({ ref }) => (
                <ErrorShield message="Component Error">
                    <C {...otherProps} 
                        ref={combineRefs(ref, drag, drop)} 
                        children={children.map((child:string) => (
                            <AppElement 
                                key={child}
                                component={props.component}
                                onClick={props.onClick}
                                onHover={props.onHover}
                                elementId={child} 
                                parentElementId={props.elementId}
                                parentMetadata={propTypes}
                                componentFactory={props.componentFactory} />
                        ))} />
                </ErrorShield>
            )}
        </ViewElement>
    );
}