import * as React from "react";

import { PropEditorRenderProps, MapDataType } from "../../doc/docModels";
import { PropEditor } from "../PropEditor";
import { PropFolder } from "../PropFolder";

interface Props extends PropEditorRenderProps {
    
}

export const MapPropEditor:React.SFC<Props> = (props) => {

    const value = props.value || {}

    const mapType = props.propType as MapDataType;

    const handlePropChange = React.useCallback((propName: string, propValue: any) => {
        
        props.onChange(props.propName, {
            ...value,
            [propName]: propValue
        })
    }, [value]);

    return (
        <PropFolder 
            assigned={props.value && Object.keys(props.value).length > 0}
            name={props.propName} 
            indent
            renderSummary={({ }) => (<div />)}>
            
            {Object.keys(mapType.properties).map(propName => {
                const desc = mapType.properties[propName]
                return (
                    <PropEditor {...props} 
                        key={propName} 
                        path={[...props.path, propName ]}
                        propType={desc} 
                        propName={propName}
                        value={value[propName]} 
                        onChange={handlePropChange} />
                )
            })}
            
        </PropFolder>
    )
}