type ButtonColor = 'orange' | 'blue' | 'red';
type ButtonStyle = 'solid' | 'outline';

interface ButtonProps {
    tooltip: string;
    id: string;
    content?: React.ReactNode; //optional for FontAwesome <i> icons or plain text content like "A" or "Aa", etc.
    onClick?: () => void;
    color?: ButtonColor;
    style?: ButtonStyle;
    disabled?: boolean;
    classString?: string;
}

export function ButtonSmall({tooltip, id, content, color = "orange", style="solid", onClick, disabled, classString = ""}: ButtonProps) {
    let buttonClasses = "";

    buttonClasses += `${color}-${style}`;

    return (
        <button
            title={tooltip}
            aria-label={tooltip}
            id={id}
            className={buttonClasses + classString}
            onClick={onClick}
            disabled={disabled}
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