
import * as React from "react";
import { classes } from "../utils";

type ParentHood = { nested?: boolean }

const parentHood = React.createContext<ParentHood>({ });

interface Props {
    style?: React.CSSProperties
    className?: string
    tabIndex?: number
    onClick?: () => void
    //onFocus?: () => void
    //onBlur?: () => void
}

export const InputArea:React.SFC<Props> = React.forwardRef<any, Props>((props, ref) => {

    const { nested } = React.useContext(parentHood);

    return (
        <div ref={ref} 
             
            className={classes(nested ?  "row" : "input-area", props.className)} 
            style={props.style}
            
            onClick={props.onClick}>

            <parentHood.Provider value={{ nested: true }}>

                {props.children}

            </parentHood.Provider>

        </div>
    );
})

