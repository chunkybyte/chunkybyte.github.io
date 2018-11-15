var DataService = (() => ({
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
    },
    get: (key) => {
        return JSON.parse(localStorage.getItem(key));
    },
    hasProperty: (propertyName) => {
        return localStorage.hasOwnProperty(propertyName);
    }
}))();

export default DataService;