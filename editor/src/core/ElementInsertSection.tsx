import * as React from "react";

import { SearchField } from "../uiShell/controls/SearchField";
import { ComponentUri } from "./doc/docModels";
import { ComponentCard } from "./ComponentCard";
import { useDocLibState } from "./doc/docLibHooks";
import { PanelBody } from "../uiShell/panel/PanelBody";
import { Title } from "../uiShell/controls/Title";

interface Props {
    
}

const defaultRenderer = (componentUri: ComponentUri) => <div />;

export const ElementInsertSection:React.SFC<Props> = (props) => {
    const { libs, editorExtensions } = useDocLibState(s => s);
    const [value, setValue] = React.useState("");

    return (
        <>
            <div key="l3" className="scale-2 row-indent-2 palette-3">
                <Title>Assets</Title>
            </div>
            <div key="search" className="scale-3 row palette-4">
                <SearchField 
                    className="stretch"
                    value={value} 
                    onChange={setValue} 
                    placeholder="Filter ..." />
            </div> 

            <PanelBody key="body" className="column bg-dotted">
                {
                    Object.keys(libs.byName).map(libName => {
                        const lib = libs.byName[libName];
                        const editorExt = editorExtensions.byName[libName]
                        return (
                            
                                Object.keys(lib.components).map(compName => {

                                    const component = (editorExt? editorExt.componentCards[compName]: undefined) || defaultRenderer;
                                    return <ComponentCard 
                                        key={compName} 
                                        defaultProps={{}}
                                        componentUri={{ lib: libName, component: compName }}
                                        renderComponent={component} />;
                                })
                            
                        );
                    }) 
                }
            </PanelBody>
            
        </>
    );
}