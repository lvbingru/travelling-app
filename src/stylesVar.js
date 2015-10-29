var config = {
    'dark': '#303030',
    'dark-mid': '#96969b',
    'dark-light': '#dbe0e3',
    'dark-lighter': '#e7eaeb',

    'brand-primary': '#0087fa',
    'bg-gray': '#f4f5f6',
    'bg-primary': '#0087fa'
}

module.exports = function(key) {
    return config[key];
}
