import { getAllTags } from "@/Items";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

/**
This component handles the display and selection of tags. It includes a function to handle 
tag clicks and updates the selected tags state based on user interaction.
 */
export function Tags({
    tags,
    setTags,
}: {
    tags: string[];
    setTags: (newTags: string[]) => void;
}) {
    function handleTagClick(tag: string) {
        if (tags.includes(tag)) {
            setTags(tags.filter((t) => t !== tag));
        } else {
            setTags([...tags, tag]);
        }
    }

    const allTags = getAllTags();

    return (
        <Stack direction="row" flexWrap="wrap" my={0.5}>
            {allTags.map((tag) => (
                <Chip
                    key={tag}
                    label={tag}
                    onClick={() => handleTagClick(tag)}
                    color={tags.includes(tag) ? "primary" : "default"}
                    variant={tags.includes(tag) ? "outlined" : "filled"}
                    sx={{
                        m: 0.2,
                    }}
                />
            ))}
        </Stack>
    );
}
