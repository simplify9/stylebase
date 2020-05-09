import "./component_card.less";

import * as React from "react";

import { classes } from "../uiShell/utils";
import { ErrorShield } from "./ErrorShield";
import { ComponentUri, PropsMap } from "./doc/docModels";
import { useDraggableAsset } from "./uiState/useDraggableAsset";

interface Props {
    style?: React.CSSProperties
    className?: string
    renderComponent: (componentUri: ComponentUri) => JSX.Element
    componentUri: ComponentUri
    defaultProps: PropsMap
}

export const ComponentCard = (props:Props) => {

    const drag = useDraggableAsset({ type: "component", uri: props.componentUri, props: props.defaultProps });

    return (
        <div className={classes("component-card", props.className)} style={props.style}>
            <div key="label" className="title">{props.componentUri.component} @ {props.componentUri.lib}</div>
            <div key="sublabel" className="subtitle">{props.componentUri.lib}</div>
            <div ref={drag} key="container" className="container">
                <ErrorShield message="Component Card Error">
                    {props.renderComponent(props.componentUri)}
                </ErrorShield>
            </div>
        </div>
    );
}