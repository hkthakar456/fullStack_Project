import clsx from "clsx";
import "./Button.css";

function Button({

    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    disabled = false,
    type = "button",
    onClick,

}) {

    return (

        <button

            type={type}

            disabled={disabled}

            onClick={onClick}

            className={clsx(

                "btn",
                `btn-${variant}`,
                `btn-${size}`,
                fullWidth && "btn-full"

            )}

        >

            {children}

        </button>

    );

}

export default Button;