import {
    // useEffect,
    useState,
    useLayoutEffect,
    // useMemo,
    useEffect,
} from "react";
import { Container, Typography, Stack } from "@mui/material";
// import { AuthField } from "@/components/Auth";
// import { DeleteDialog } from "@/components/Profile";
import {
    getSOILInfo,
    // setSOILItem
} from "@/SoilInfo";
import { useNavigate } from "react-router-dom";
// import { UserInfo } from "@/Auth";
import ProfileEditMode from "./ProfileEditMode";
import ProfileReadMode from "./ProfileReadMode";
// import { useCart } from "@/App";
import { getProfileInfo, updateBasicUserInfo } from "@/api";
// import { ProfileInfo } from "@shared/types";

/**

This component renders the user's profile page. It includes three child components: 
ProfileEditMode, ProfileChangePswd, and ProfileReadMode, which are responsible for 
editing the user's profile, changing the user's password, and displaying the user's 
profile in read mode, respectively.

The saveUserLocalStorage function is used to update the user's information in local storage. 
It finds the user in the users array using the email address, replaces the user's information 
with the new information, and updates the local storage.

This component uses the useNavigate hook from 'react-router-dom' to programmatically navigate 
to different routes, and the useCart custom hook to access the state of the cart items.

*/
export default function ProfilePage() {
    const navigate = useNavigate();
    const userInfo = getSOILInfo().userInfo;


    useLayoutEffect(() => {
        const isLoggedIn = !!userInfo;
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, []); // Empty dependancy array as it causes navigational issues

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [dateJoined, setDateJoined] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        getProfileInfo().then((data) => {
            if (!data.data) {
                throw new Error(data.msg);
            }
            setUsername(data.data.name);
            setEmail(data.data.email);
            setDateJoined(data.data.dateJoined);
        }).catch((error) => console.error(error));
    }, []);



    function handleSaveProfileData(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        updateBasicUserInfo(username, email);
        setIsEditing(false);
    }


    return (
        <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
        >
            {/* <DeleteDialog></DeleteDialog> */}
            <Container maxWidth="sm">
                <Stack
                    direction="column"
                    alignItems="center"
                    p={2}
                    borderRadius={2}
                    bgcolor="white"
                >
                    <Typography variant="h3" component="h1" color={"black"}>
                        Profile
                    </Typography>
                    {isEditing ? (
                        <ProfileEditMode
                            username={username}
                            setUsername={setUsername}
                            email={email}
                            setEmail={setEmail}
                            setIsEditing={setIsEditing}
                            handleSaveProfileData={handleSaveProfileData}
                        />
                    ) : (
                        <ProfileReadMode
                            username={username}
                            email={email}
                            // pswd={pswd}
                            // setPswd={setPswd}
                            dateJoined={dateJoined}
                            // profileInfo={profileInfo}
                            setIsEditing={setIsEditing}
                        />
                    )}
                </Stack>
            </Container>
        </Stack>
    );
}
