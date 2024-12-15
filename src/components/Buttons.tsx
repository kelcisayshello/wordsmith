type ButtonColor = 'orange' | 'blue' | 'greyscale';
type ButtonStyle = 'solid' | 'outline';

interface ButtonProps {
    tooltip: string;
    id: string;
    content?: React.ReactNode; //optional for FontAwesome <i> icons or plain text content like "A" or "Aa", etc.
    onClick?: () => void;
    color?: ButtonColor;
    style?: ButtonStyle;
}

export function ButtonSmall({tooltip, id, content, color = "orange", style="solid"}: ButtonProps) {
    let buttonClasses = "";

    buttonClasses += `${color}-${style}`;

    return (
        <button
            title={tooltip}
            id={id}
            className={buttonClasses}
            // onClick={onlick}
        >
            {content ? content : " "}
        </button>
    );
}

export function ButtonDropdown() {
    return (
        <div>
            hey
        </div>
    );
}

export function ButtonSpacer() {
    return (
        <div className="button-spacer"></div>
    );
}