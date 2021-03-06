import * as React from "react";
import { shallowEqual, useDispatch } from "react-redux";

import { Button } from "../uiShell/controls/Button";
import { useDocEditorState } from "../patterns/docEditor/docEditorHooks";
import { DocSelection, DocState } from "./doc/state/stateModels";
import { actionUndo, actionRedo, actionUpdate } from "../patterns/docEditor/docEditorState";
import { docElementRemove, docActionSet } from "./doc/state/actions";
import { ButtonGroup } from "../uiShell/controls";

interface Props extends DocSelection {

}

export const AppToolbarEdit:React.FC<Props> = ({ component, elements }) => {

    
    const editor = useDocEditorState<DocState,DocSelection>(s => {
        const c = s.present.data.components.byName[component];
        if (!c) return { canUndo: false, canRedo: false, rootElement: "" }; 
        const rootElement = c.rootElement;
        return {
            canUndo: s.past.length > 0,
            canRedo: s.future.length > 0,
            rootElement
        }
    }, shallowEqual);

    const dispatch = useDispatch();

    const canDelete = elements.length > 0 && elements.indexOf(editor.rootElement) === -1

    const handleUndo = () => dispatch(actionUndo());

    const handleRedo = () => dispatch(actionRedo());

    const handleDelete = () => 
        dispatch(actionUpdate(
            docActionSet(elements
                .map(el => docElementRemove(component, el)))));

    return (
        <ButtonGroup>
            <Button compact key="undo" label="Undo" icon="undo" disabled={!editor.canUndo} onClick={handleUndo} />
            <Button compact key="redo" label="Redo" icon="redo" disabled={!editor.canRedo} onClick={handleRedo} />
            <Button compact key="cut" label="Cut" icon="cut" disabled />
            <Button compact key="copy" label="Copy" icon="copy" disabled />
            <Button compact key="paste" label="Paste" icon="paste" disabled />
            <Button compact key="delete" label="Delete" icon="trash" disabled={!canDelete} onClick={handleDelete} />
        </ButtonGroup>
    )
}