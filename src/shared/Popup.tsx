import { Snackbar } from "@mui/material";
import { createContext, useContext, useState } from "react";

/**
 * Popup context which allows to show a popup message
 */

const PopupCtx = createContext<((msg: string) => void) | null>(null);

export const usePopup = () => useContext(PopupCtx);

export const PopupProvider = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    function popup(msg: string) {
        setMessage(msg);
        setOpen(true);
    }

    function close() {
        setOpen(false);
    }

    return (
        <PopupCtx.Provider value={popup}>
            {children}
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={open}
                message={message}
                autoHideDuration={3000}
                onClose={close}
                onClick={close}
                sx={{
                    userSelect: "none",
                }}
            />
        </PopupCtx.Provider>
    );
};
