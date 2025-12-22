/**
 * The ImgDiv component is a functional component that receives an 'imgPath' prop and renders an image.
 * The 'imgPath' prop is a string that represents the path to the image file.
 * The image is styled with a border radius of 10px, a width of 100%, and an object-fit property set to 'cover'.
 * This ensures that the image will scale to fit its container while maintaining its aspect ratio, and that it will be displayed with rounded corners.
 */
export function ImgDiv({ imgPath }: { imgPath: string }) {
    return (
        <>
            <img src={imgPath} alt="item picture" style={{
                borderRadius: "10px",
                width: "100%",
                objectFit: "cover"
            }} />
        </>
    );
}
