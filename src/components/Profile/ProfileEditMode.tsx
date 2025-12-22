import Box from "@mui/material/Box";
import { AuthField } from "../Auth/AuthField";
import Button from "@mui/material/Button";
import { Stack } from "@mui/material";

/**
This component is responsible for handling the user's profile edit. It includes form fields 
for the username and email. The form fields are rendered using the AuthField component.

The component receives several props including handleSaveProfileData, which is the function 
to handle the profile data form submission, and setUsername and setEmail, which are functions 
to set the state of the username and email.

The component also receives the username and email state variables.
 */
interface ProfileEditModeProps {
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    handleSaveProfileData: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ProfileEditMode({
    username,
    setUsername,
    email,
    setEmail,
    setIsEditing,
    handleSaveProfileData,
}: ProfileEditModeProps) {
    return (
        <Box
            display="flex"
            flexDirection="column"
            component="form"
            onSubmit={handleSaveProfileData}
            width="100%"
            mt="50px"
            rowGap="30px"
            color="black"
        >
            <AuthField
                fullWidth
                setValue={setUsername}
                label="Username"
                type="text"
                value={username}
            />
            <AuthField
                fullWidth
                setValue={setEmail}
                label="Email"
                type="email"
                value={email}
            />
            <Stack
                direction="row"
                justifyContent="center"
                alignItems={"center"}
            >
                <Button
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: "30px",
                        fontSize: "18px",
                        fontWeight: "600",
                        mx: "10px",
                    }}
                    onClick={() => {
                        setIsEditing(false);
                    }}
                >
                    Back
                </Button>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                        mt: "30px",
                        fontSize: "18px",
                        mx: "10px",
                        fontWeight: "600",
                    }}
                >
                    Save
                </Button>
            </Stack>
        </Box>
    );
}
