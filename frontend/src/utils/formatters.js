export const formatViews = (views) => {

    return new Intl.NumberFormat("en", {

        notation: "compact",

        maximumFractionDigits: 1,

    }).format(views);

};

export const formatDate = (date) => {

    return new Date(date).toLocaleDateString("en-US", {

        day: "numeric",
        month: "short",
        year: "numeric",

    });

};

export const formatSubscribers = (count) => {

    return new Intl.NumberFormat("en", {

        notation: "compact",

        maximumFractionDigits: 1,

    }).format(count);

};

export const formatDuration = (seconds) => {

    const hrs = Math.floor(seconds / 3600);

    const mins = Math.floor((seconds % 3600) / 60);

    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {

        return `${hrs}:${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;

    }

    return `${mins}:${String(secs).padStart(2,"0")}`;

};