import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { theme } from "@/App";
import { deleteLoggedInUser } from "@/api";
import { useState } from "react";
import { usePopup } from "@/shared/Popup";

/**
This component renders a dialog box for deleting the logged-in user's account. It includes 
a title, content text, and action buttons for confirmation and cancellation.

The component receives a logout prop, which is a function to log out the user.

The state of whether the dialog is open is managed using the useState hook. The handleClickOpen 
function is used to open the dialog, and the handleClose function is used to close the dialog.

The handleAccDelete function is used to delete the logged-in user's account. It calls the 
deleteLoggedInUser function, closes the dialog, and logs out the user.
 */
export function DeleteDialog({ logout }: { logout: () => void }) {
    const [open, setOpen] = useState(false);
    const popup = usePopup()!;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // UNTESTED
    async function handleAccDelete() {
        if (await deleteLoggedInUser()) {
            handleClose();
            logout();
        } else {
            popup("something went wrong trying to delete user.")
        }
    }

    return (
        <>
            <Button
                fullWidth
                variant="contained"
                sx={{ fontSize: theme.fontSize(0.8), fontWeight: "600" }}
                color="error"
                onClick={handleClickOpen}
            >
                Delete Account
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Do you want to delete your account?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deleting this account means you will not be able to
                        access this account anymore.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleAccDelete}
                        sx={{ color: "red", width: "250px" }}
                    >
                        Yes, I want to delete my account and understand the
                        consequences
                    </Button>
                    <Button onClick={handleClose} autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
