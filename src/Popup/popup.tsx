import React from 'react'
import ReactDOM from 'react-dom/client'
import './popup.scss'

const popupDomLocation = ReactDOM.createRoot(document.getElementById('popup-root'))


function closePopup() {
    popupDomLocation.render(<></>)
}
function triggerPopup(content: JSX.Element, specialType?: "warning") {
    const popupFinal =
        <div className="popup-background">
            <div className={`popup-container ${specialType === "warning" ? "warning" : ""}`}>
                <div className="popup-exit" onClick={closePopup}>✖</div>
                {content}
            </div>
        </div>

    popupDomLocation.render(popupFinal)
}

export default {
    triggerPopup, closePopup
}