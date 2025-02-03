function toggleTheme() {
    var currentTheme = journey.theme;
    if (currentTheme == 'dark') {
        journey.theme = 'light';
    } else {
        journey.theme = 'dark';
    }
}

function themeIcon() {
    var currentTheme = journey.theme;
    if (currentTheme == 'dark') {
        return 'fa-sun';
    } else {
        return 'fa-moon';
    }
}

function themeLabel() {
    var currentTheme = journey.theme;
    if (currentTheme == 'dark') {
        return 'Light';
    } else {
        return 'Dark';
    }
}
