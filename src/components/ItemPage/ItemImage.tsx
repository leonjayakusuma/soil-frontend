/**
 * The ImgDiv component is a functional component that receives an 'imgPath' prop and renders an image.
 * The 'imgPath' prop is a string that represents the path to the image file.
 * The image is styled with a border radius of 10px, a width of 100%, and an object-fit property set to 'cover'.
 * This ensures that the image will scale to fit its container while maintaining its aspect ratio, and that it will be displayed with rounded corners.
 */

import { Item } from "@/types";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import placeholderImage from "@/assets/landscape-placeholder.svg";

export function ItemImage({ data }: { data: Item }) {
    const mainImagePath = data?.imgUrl && data.imgUrl != '' 
        ? data.imgUrl 
        : `/itempics/${data?.id}.jpg`;
    
    // Generate image paths for carousel (using placeholder image for additional images)
    const imagePaths = [
        mainImagePath,
        placeholderImage,
        placeholderImage,
        placeholderImage,
        placeholderImage,
        placeholderImage,
    ];

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [windowStartIndex, setWindowStartIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    
    // Number of thumbnails visible in the window
    const visibleThumbnails = 3;
    const thumbnailWidth = { xs: 50, md: 70 };
    const thumbnailSpacing = 8; // gap between thumbnails

    const handleThumbnailClick = (index: number) => {
        setSelectedImageIndex(index);
        // Auto-scroll window to keep selected thumbnail visible while maintaining exactly 3 visible
        const maxStartIndex = Math.max(0, imagePaths.length - visibleThumbnails);
        if (index < windowStartIndex) {
            setWindowStartIndex(Math.min(index, maxStartIndex));
        } else if (index >= windowStartIndex + visibleThumbnails) {
            const newStartIndex = index - visibleThumbnails + 1;
            setWindowStartIndex(Math.min(Math.max(0, newStartIndex), maxStartIndex));
        }
    };

    const slideWindow = (direction: 'left' | 'right') => {
        const maxStartIndex = Math.max(0, imagePaths.length - visibleThumbnails);
        if (direction === 'left') {
            setWindowStartIndex(prev => Math.max(0, prev - 1));
        } else {
            setWindowStartIndex(prev => Math.min(maxStartIndex, prev + 1));
        }
    };

    // Ensure windowStartIndex is always valid to show exactly 3 thumbnails
    const maxStartIndex = Math.max(0, imagePaths.length - visibleThumbnails);
    
    // Clamp windowStartIndex to ensure we always show exactly 3 thumbnails
    useEffect(() => {
        if (windowStartIndex > maxStartIndex) {
            setWindowStartIndex(maxStartIndex);
        }
    }, [imagePaths.length, windowStartIndex, maxStartIndex]);
    
    const clampedWindowStartIndex = Math.min(windowStartIndex, maxStartIndex);
    
    const canSlideLeft = clampedWindowStartIndex > 0;
    const canSlideRight = clampedWindowStartIndex < maxStartIndex;

    return (
        <Box
            sx={{
                width: { xs: "240px", md: "350px" },
                minWidth: { xs: "240px" },
                flexShrink: 0,
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            {/* Main Image */}
            <Box
                sx={{
                    width: "100%",
                    height: { xs: "240px", md: "350px" },
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <ImgDiv imgPath={imagePaths[selectedImageIndex]} />
            </Box>

            {/* Carousel with Sliding Window */}
            {imagePaths.length > 1 && (
                <Box 
                    sx={{ 
                        position: "relative", 
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {/* Left Arrow */}
                    {imagePaths.length > visibleThumbnails && (
                        <LeftArrow slideWindow={slideWindow} canSlideLeft={canSlideLeft} />
                    )}

                    {/* Sliding Window Container */}
                    <SlidingWindowContainer
                        visibleThumbnails={visibleThumbnails}
                        thumbnailWidth={thumbnailWidth}
                        thumbnailSpacing={thumbnailSpacing}
                        windowStartIndex={clampedWindowStartIndex}
                        carouselRef={carouselRef}
                        imagePaths={imagePaths}
                        selectedImageIndex={selectedImageIndex}
                        handleThumbnailClick={handleThumbnailClick} 
                    />

                    {/* Right Arrow */}
                    {imagePaths.length > visibleThumbnails && (
                        <RightArrow slideWindow={slideWindow} canSlideRight={canSlideRight} />
                    )}
                </Box>
            )}
        </Box>
    );
}

const LeftArrow = ({ slideWindow, canSlideLeft }: { slideWindow: (direction: "left" | "right") => void, canSlideLeft: boolean } ) => {
    return <IconButton
        onClick={() => slideWindow('left')}
        disabled={!canSlideLeft}
        sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
            },
            "&:disabled": {
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                opacity: 0.5,
            },
            width: { xs: "40px", md: "55px" },
            height: { xs: "40px", md: "55px" },
            marginRight: 0,
            transition: "all 0.2s ease",
        }}
    >
        <ChevronLeft fontSize="large" />
    </IconButton>;
}

const RightArrow = ({ slideWindow, canSlideRight }: { slideWindow: (direction: "left" | "right") => void, canSlideRight: boolean } ) => {
    return <IconButton
        onClick={() => slideWindow('right')}
        disabled={!canSlideRight}
        sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
            },
            "&:disabled": {
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                opacity: 0.5,
            },
            width: { xs: "40px", md: "55px" },
            height: { xs: "40px", md: "55px" },
            marginLeft: 0,
            transition: "all 0.2s ease",
        }}
    >
        <ChevronRight fontSize="large" />
    </IconButton>;
}

const SlidingWindowContainer = ({ visibleThumbnails, thumbnailWidth, thumbnailSpacing, windowStartIndex, carouselRef, imagePaths, selectedImageIndex, handleThumbnailClick }: { visibleThumbnails: number, thumbnailWidth: { xs: number; md: number; }, thumbnailSpacing: number, windowStartIndex: number, carouselRef: React.RefObject<HTMLDivElement>, imagePaths: string[], selectedImageIndex: number, handleThumbnailClick: (index: number) => void } ) => {
    // Calculate exact width to fit exactly 3 thumbnails
    const containerWidth = {
        xs: visibleThumbnails * thumbnailWidth.xs + (visibleThumbnails - 1) * thumbnailSpacing,
        md: visibleThumbnails * thumbnailWidth.md + (visibleThumbnails - 1) * thumbnailSpacing
    };
    
    return <Box
        sx={{
            position: "relative",
            width: {
                xs: `${containerWidth.xs}px`,
                md: `${containerWidth.md}px`
            },
            overflow: "hidden",
            flexShrink: 0,
        }}
    >
        <Stack
            direction="row"
            spacing={`${thumbnailSpacing}px`}
            sx={{
                transform: `translateX(-${windowStartIndex * (thumbnailWidth.md + thumbnailSpacing)}px)`,
                transition: "transform 0.3s ease-in-out",
                // Use 899px to avoid conflict with Material-UI's md breakpoint at 900px
                "@media (max-width: 899px)": {
                    transform: `translateX(-${windowStartIndex * (thumbnailWidth.xs + thumbnailSpacing)}px)`,
                },
            }}
            ref={carouselRef}
        >
            {imagePaths.map((imgPath, index) => (
                <ThumbnailImage
                    key={index}
                    imgPath={imgPath}
                    index={index}
                    isSelected={selectedImageIndex === index}
                    onClick={() => handleThumbnailClick(index)}
                    thumbnailWidth={thumbnailWidth} />
            ))}
        </Stack>
    </Box>;
}

function ImgDiv({ imgPath }: { imgPath: string }) {
    const [imgError, setImgError] = useState(false);
    const [imgSrc, setImgSrc] = useState(imgPath);

    useEffect(() => {
        setImgSrc(imgPath);
        setImgError(false);
    }, [imgPath]);

    const handleError = () => {
        setImgError(true);
        setImgSrc(placeholderImage);
    };

    return (
        <img 
            src={imgError ? placeholderImage : imgSrc} 
            alt="item picture" 
            onError={handleError}
            style={{
                borderRadius: "10px",
                width: "100%",
                height: "100%",
                objectFit: "cover"
            }} 
        />
    );
}

function ThumbnailImage({ 
    imgPath, 
    index, 
    isSelected, 
    onClick,
    thumbnailWidth 
}: { 
    imgPath: string; 
    index: number; 
    isSelected: boolean; 
    onClick: () => void;
    thumbnailWidth: { xs: number; md: number };
}) {
    const [imgError, setImgError] = useState(false);
    const [imgSrc, setImgSrc] = useState(imgPath);

    useEffect(() => {
        setImgSrc(imgPath);
        setImgError(false);
    }, [imgPath]);

    const handleError = () => {
        setImgError(true);
        setImgSrc(placeholderImage);
    };

    return (
        <Box
            onClick={onClick}
            sx={{
                minWidth: { xs: `${thumbnailWidth.xs}px`, md: `${thumbnailWidth.md}px` },
                width: { xs: `${thumbnailWidth.xs}px`, md: `${thumbnailWidth.md}px` },
                height: { xs: `${thumbnailWidth.xs}px`, md: `${thumbnailWidth.md}px` },
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
                border: isSelected 
                    ? "2px solid" 
                    : "2px solid transparent",
                borderColor: isSelected 
                    ? "primary.main" 
                    : "transparent",
                transition: "all 0.2s ease",
                opacity: isSelected ? 1 : 0.7,
                flexShrink: 0,
                "&:hover": {
                    opacity: 1,
                    transform: "scale(1.05)",
                },
            }}
        >
            <img
                src={imgError ? placeholderImage : imgSrc}
                alt={`Thumbnail ${index + 1}`}
                onError={handleError}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            />
        </Box>
    );
}
