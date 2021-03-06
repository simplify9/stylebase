import * as React from "react";

import { BoxFont } from "../../types";
import { toCssFont } from "../../cssUtils";
import { getFontProvider } from "../../webFontUtils";
import { Title } from "../../../uiShell/controls/Title";

type Props = Omit<BoxFont, "size"> & {
    style?: React.CSSProperties
    className?: string
    onClick?: () => void
}

export const FontSwatch:React.SFC<Props> = ({ onClick, style:passedStyle, className, children, ...font }) => {

    React.useEffect(() => {
        const p = getFontProvider(font.family.provider);
        if (p) p.download([{
            family: font.family,
            variants: [{ weight: font.weight, italic: font.italic }]
        }])
    }, [font.weight, font.family, font.italic]);
 
    const genStyle = toCssFont(font);

    const style = {
        ...passedStyle,
        ...genStyle
    }

    return (
        <Title onClick={onClick} className={className} style={style}>
            {font.family.name}
        </Title>
    );
}