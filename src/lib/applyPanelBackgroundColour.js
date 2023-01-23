document.location.search
    .substr(1)
    .split("&")
    .forEach(pair => {
        const [key, value] = pair.split("=");
        if (key === "theme") {
            const stylesheet = document.styleSheets[0];
            stylesheet.cssRules[0].style.backgroundColor = value === "dark" ? "#1e1e1e" : "#ffffff";
        }
    });
