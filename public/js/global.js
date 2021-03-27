const apiBaseUrl = `http://localhost:3000`
// search
const searchForm = document.querySelector('#search-form')
const searchInput = searchForm.querySelector('input[name="search"]')
const searchResult = document.querySelector('.search-result')
const resultTotalDocs = searchResult.querySelector('.total-docs')
const resultQuery = searchResult.querySelector('.query')
const query = {
    value: searchForm.search.value,
    getValue: function () { return this.value },
    setValue: function (v) { this.value = v },
}
const resetButton = searchResult.querySelector('.btn-reset')
// users
const usersList = document.querySelector('.users-list')
const userTemplate = document.querySelector('template.user-template')
// form
const addUserForm = document.querySelector('#add-user-form')
const editUserForm = document.querySelector('#edit-user-form')
// load more
const loadMoreButton = document.querySelector('.btn-load-more')

const limit = 3
const maxDataLoad = 20
// page state
const page = {
    maxLoad: Math.round(maxDataLoad / limit),
    current: 1,
    getCurrent: function () { return this.current },
    setCurrent: function (c) { this.current = c },
    increament: function () { this.current++ },
}

export {
    apiBaseUrl,
    usersList,
    userTemplate,
    searchForm,
    searchInput,
    searchResult,
    resultQuery,
    resultTotalDocs,
    resetButton,
    addUserForm,
    editUserForm,
    loadMoreButton,
    page,
    limit,
    query
}