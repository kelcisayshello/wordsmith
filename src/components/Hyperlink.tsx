import { useCallback, useState } from 'react';

// Lexical.js
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faLinkSlash } from '@fortawesome/free-solid-svg-icons';
import { ButtonSmall } from './Buttons';

// Components
import { showNotification } from '../Toolbar';

export const RegexAddHyperlink = () => {
    const [editor] = useLexicalComposerContext();
    const [notification, setNotification] = useState<string | null>(null);

    const handleAddRegexHyperlink = useCallback(() => {
        const url = window.prompt('Enter a valid URL:', '');

        // (1) check if the URL exists
        if (url) {

            // (2) compare with a regex expression if URL has http/https OR if this is a subdomain URL with a valid format
            const regexExpression = /^((https?:\/\/)([\da-z\.-]+)\.([a-z]{2,}|xn--[a-z0-9-]+)(\/.*)?|([\da-z\.-]+)\.([a-z]{2,}|xn--[a-z0-9-]+))$/i;
            if (regexExpression.test(url)) {
                editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
                showNotification('Hyperlink has been added successfully ✅', setNotification);

            // (3) report that adding the hyperlink failed
            } else {
                showNotification('Failed to add hyperlink ❌', setNotification);
                alert('Yikes . . . ! That is not a valid URL, try again.');
                handleAddRegexHyperlink();
            }
        }
    }, [editor, setNotification]);

    return (
        <>
            {notification && (
                <div className="notification-modal">{notification}</div>
            )}
            <ButtonSmall tooltip="Add Hyperlink"
                content={<FontAwesomeIcon icon={ faLink } />} color="vibrant-blue" style="outline"
                onClick={handleAddRegexHyperlink}
            />
        </>

    );
};

export const RemoveHyperlink = () => {
    const [editor] = useLexicalComposerContext();
    const [notification, setNotification] = useState<string | null>(null);

    const handleRemoveHyperlink = useCallback(() => {
        editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
        showNotification('Hyperlink has been successfully removed ✅', setNotification);
    }, [editor, setNotification]);

    return (
        <>
            {notification && (
                <div className="notification-modal">{notification}</div>
            )}
            <ButtonSmall tooltip="Remove Hyperlink"
                content={<FontAwesomeIcon icon={faLinkSlash} />} color="vibrant-blue" style="outline"
                onClick={handleRemoveHyperlink}
            />
        </>
    );
};