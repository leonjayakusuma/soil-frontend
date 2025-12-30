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
    // function saveUserLocalStorage(
    //     oldUserObject: UserInfo,
    //     newUserObject: UserInfo,
    // ) {
    //     const userToUpdateIndex = users.findIndex(
    //         (user: UserInfo) => user.email === oldUserObject.email,
    //     );
    //     console.log(userToUpdateIndex);
    //     if (userToUpdateIndex !== -1) {
    //         users[userToUpdateIndex] = newUserObject;
    //     }
    //     setSOILItem("user", newUserObject);
    //     setOldUserObject(newUserObject);
    //     setSOILItem("users", users);
    // }

    const navigate = useNavigate();
    const userInfo = getSOILInfo().userInfo;
    // const [cartItems] = useCart();


    // console.log(getSOILInfo())

    useLayoutEffect(() => {
        const isLoggedIn = !!userInfo;
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, []); // Empty dependancy array as it causes navigational issues

    // const user = useMemo(() => getSOILInfo().userInfo, []);
    // const users = useMemo(() => getSOILInfo().users, []);
    // const [profileInfo, setProfileInfo] = useState<ProfileInfo | undefined>(undefined);
    // const defaultUsername = profileInfo?.name ?? "";
    // const defaultEmail = profileInfo?.email ?? "";
    // const dateJoined = profileInfo?.dateJoined ?? "";
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [dateJoined, setDateJoined] = useState("");
    // const [id, setPswd] = useState(defaultId);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // const accessToken = userInfo?.accessToken ? userInfo.accessToken : "";
        // console.log(accessToken);
        getProfileInfo().then((data) => {
            if (!data.data) {
                throw new Error(data.msg);
            }
            // setProfileInfo(data.data);
            setUsername(data.data.name);
            setEmail(data.data.email);
            setDateJoined(data.data.dateJoined);
        }).catch((error) => console.error(error));
    }, []);


    // const [oldUserObject, setOldUserObject] = useState<ProfileInfo>({
    //     name: defaultUsername,
    //     email: defaultEmail,
    //     id: id,
    //     dateJoined
    // });

    function handleSaveProfileData(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // const newUserObject: UserInfo = {
        //     name: username,
        //     email,
        //     pswd,
        //     dateJoined,
        //     cart: cartItems,
        // };
        // saveUserLocalStorage(oldUserObject, newUserObject);
        updateBasicUserInfo(username, email);
        setIsEditing(false);
    }

    // In the initial rendering, don't show anything if logged out
    // if (user === undefined) {
    //     return <></>;
    // }

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
