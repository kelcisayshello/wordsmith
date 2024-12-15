import { ButtonSpacer, ButtonDropdown, ButtonSmall } from "./Buttons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faItalic, faUnderline, faStrikethrough, faCode } from '@fortawesome/free-solid-svg-icons';

import "../css/toolbar.css"

export default function Toolbar() {
    return (
        <div className="toolbar" id="toolbar">
            <ButtonSmall tooltip="Uppercase" id="uppercase" content={<p>A</p>} color="orange" style="solid" />
            <ButtonSmall tooltip="Lowercase" id="lowercase" content={<p>a</p>} color="orange" style="solid" />
            <ButtonSmall tooltip="Capitalize" id="lowercase" content={<p>Aa</p>} color="orange" style="outline" />

            <ButtonSpacer />

            <ButtonSmall tooltip="Bold" id="bold" content={<b>B</b>} color="orange" style="outline" />
            <ButtonSmall tooltip="Italics" id="italics" content={<FontAwesomeIcon icon={faItalic} />}color="orange" style="solid" />
            <ButtonSmall tooltip="Underline" id="underline" content={<FontAwesomeIcon icon={faUnderline} />}color="orange" style="solid" />
            <ButtonSmall tooltip="Strikethrough" id="strikethrough" content={<FontAwesomeIcon icon={faStrikethrough} />}color="orange" style="solid" />
            <ButtonSmall tooltip="Code Block" id="codeblock" content={<FontAwesomeIcon icon={faCode} />}color="orange" style="solid" />

        </div>
    );
}