var config = {
    'brand-primary': '#0087fa',
    'dark': '#303030',
    'dark-light-slight': '#9c9b97',
    'dark-mid': '#96969b',
    'dark-light': '#dbe0e3',
    'dark-lighter': '#e7eaeb',
    'white': '#ffffff',
    'green': '#34be9a',
    'green-light': '#92c056',
    'blue': '#0087fa',
    'blue-light': '#61a9da',
    'red': '#ee5a2f',
    'orange': '#f2b658'
}

module.exports = function(key) {
    return config[key];
}
