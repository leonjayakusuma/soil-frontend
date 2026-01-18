import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// import { AuthField } from "../Auth/AuthField";
import Button from "@mui/material/Button";
import { theme } from "@/App";
import { DeleteDialog } from "./DeleteDialog";
import { useNavigate } from "react-router-dom";
// import { logoutUser } from "@/Auth";
// import { useContext } from "react";
import { usePopup } from "@/shared/Popup";
import { useAuthStore } from "@/store";
// import { ProfileInfo } from "@shared/types";

interface ProfileReadModeProps {
    username: string;
    email: string;
    // pswd: string;
    // setPswd: React.Dispatch<React.SetStateAction<string>>;
    dateJoined: string;
    // profileInfo: ProfileInfo;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
This component is responsible for displaying the user's profile in read mode. It includes 
display fields for the username, email, and date joined.

It receives several props including setIsEditing and setIsChangingPassword, 
which are functions to set the state of whether the user is editing the profile or changing 
the password.

It also receives the username, email, password, and dateJoined state variables 
along with their corresponding state setting functions.

It uses the useNavigate hook from 'react-router-dom' to programmatically navigate 
to different routes, and the useCart custom hook to access the state of the cart items.
 */
const ProfileReadMode = ({
    username,
    email,
    // pswd,
    // setPswd,
    dateJoined,
    // profileInfo,
    setIsEditing,
}: ProfileReadModeProps) => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);
    const popup = usePopup()!;

    // console.log(username);
    // console.log(profileInfo);

    async function handleLogout() {
        const result = await logout();
        if (result.success) {
            popup(result.message || "Successfully logged out");
            navigate("/");
        } else {
            popup(result.message || "Something went wrong trying to logout");
        }
    }
    return (
        <Box
            display={"flex"}
            flexDirection={"column"}
            rowGap={"30px"}
            width={"100%"}
            mt={"50px"}
            color="black"
            fontSize={"20px"}
            fontWeight={"bold"}
        >
            <Typography
                component="h2"
                fontSize={"inherit"}
                fontWeight={"inherit"}
            >
                Username:{" "}
                <span className="font-normal text-[#3c3c3c]">{username}</span>
            </Typography>
            <Typography
                component="h2"
                fontSize={"inherit"}
                fontWeight={"inherit"}
            >
                Email:{" "}
                <span className="font-normal text-[#3c3c3c]">{email}</span>
            </Typography>
            {/* <AuthField
                readOnly
                fullWidth
                setValue={setPswd}
                label="Password"
                type="password"
                value={pswd}
            /> */}
            <Typography
                component="h2"
                fontSize={"inherit"}
                fontWeight={"inherit"}
            >
                Date Joined:{" "}
                <span className="font-normal text-[#3c3c3c]">{new Date(dateJoined).toLocaleDateString()}</span>
            </Typography>
            <Button
                fullWidth
                variant="contained"
                sx={{
                    fontSize: theme.fontSize(0.8),
                    fontWeight: "600",
                }}
                onClick={() => navigate("/personalInfo")}
            >
                Personal Information
            </Button>
            <hr
                style={{
                    height: theme.fontSize(0.1),
                    borderRadius: "100%",
                    border: "none",
                    backgroundColor: theme.palette.secondary[400],
                }}
            />
            <Button
                fullWidth
                variant="contained"
                sx={{
                    fontSize: theme.fontSize(0.8),
                    fontWeight: "600",
                }}
                onClick={() => setIsEditing(true)}
            >
                Edit
            </Button>
            <Button
                fullWidth
                variant="contained"
                sx={{
                    fontSize: theme.fontSize(0.8),
                    fontWeight: "600",
                }}
                color="secondary"
                onClick={() => {
                    navigate("/changePswd");
                }}
            >
                Change Password
            </Button>
            <Button
                fullWidth
                variant="contained"
                sx={{
                    fontSize: theme.fontSize(0.8),
                    fontWeight: "600",
                }}
                color="secondary"
                // untested
                onClick={handleLogout}
            >
                Log out
            </Button>
            <hr
                style={{
                    height: theme.fontSize(0.1),
                    borderRadius: "100%",
                    border: "none",
                    backgroundColor: theme.palette.secondary[400],
                }}
            />
            <DeleteDialog logout={handleLogout}></DeleteDialog>
        </Box>
    );
};

export default ProfileReadMode;
