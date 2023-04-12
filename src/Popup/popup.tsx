import React from 'react'
import ReactDOM from 'react-dom/client'
import './popup.scss'

const popupDomLocation = ReactDOM.createRoot(document.getElementById('popup-root'))

function closePopup() {
    popupDomLocation.render(<></>)
}


function triggerPopup(content: JSX.Element, specialType?: "warning", handleClose?: () => void) {


    const popupFinal =
    <div className="popup-background" >
            <div className={`popup-container ${specialType === "warning" ? "warning" : ""}`}>
                <div className="popup-exit" 
                    onClick={() => {
                        closePopup()
                        if (handleClose) {handleClose}
                    }}
                >✖</div>
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
     * @param handleClose A callback function that is ran when the popup is closed by the user pressing the `x` button.
     */
    triggerPopup: (
        content: JSX.Element, 
        specialType?: "warning",
        handleClose?: () => void
    ) => void,
    /**
     * Closes the current popup.
     */
    closePopup: () => void,
}

export default {
    triggerPopup, closePopup
} as popup_exports