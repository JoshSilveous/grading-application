import React from 'react'
import ReactDOM from 'react-dom/client'
import './popup.scss'

const popupDomLocation = ReactDOM.createRoot(document.getElementById('popup-root'))


function closePopup() {
    popupDomLocation.render(<></>)
}

function triggerPopup(content: JSX.Element, specialType?: "warning") {
    const popupFinal =
        <div className="popup-background" >
            <div className={`popup-container ${specialType === "warning" ? "warning" : ""}`}>
                <div className="popup-exit" onClick={closePopup}>✖</div>
                {content}
            </div>
        </div>

    popupDomLocation.render(popupFinal)
}

interface popup_exports {
    /**
     * Creates a blocking popup on the screen. Overrides other popups.
     * @param content The content to hold within the popup.
     * @param specialType `"warning"` will make the popup tinted red.
     */
    triggerPopup: (content: JSX.Element, specialType?: "warning") => void,
    /**
     * Closes the current popup.
     */
    closePopup: () => void,
}

export default {
    triggerPopup, closePopup
} as popup_exports