import { getUser, addUser, editUser, deleteUser } from './user.js'
import {
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
    query,
} from './global.js'
import './modal.js'

console.log('learning load more concept')

document.addEventListener('DOMContentLoaded', async () => {
    await loadUsers(page.getCurrent(), limit, query.getValue())
    // input search
    searchInput.addEventListener('change', e => {
        query.setValue(e.target.value)
    })
    // search form handle submit
    searchForm.addEventListener('submit', e => {
        e.preventDefault()
        searchUser()
    })
    // reset search
    resetButton.addEventListener('click', async e => {
        e.preventDefault()
        searchResult.style.display = 'none'
        page.setCurrent(1)
        query.setValue('')
        searchInput.value = ''
        usersList.innerHTML = ''
        await loadUsers(page.getCurrent(), limit, query.getValue(), false)
    })
    // add user form handle submit
    addUserForm.addEventListener('submit', e => {
        e.preventDefault()
        addUser({}, loadUsers)
    })
    // edit user form handle submit
    editUserForm.addEventListener('submit', e => {
        e.preventDefault()
        editUser({}, loadUsers)
    })
    // load more
    loadMoreButton.addEventListener('click', e => {
        e.preventDefault()
        loadMore()
    })
})

const searchUser = async () => {
    usersList.innerHTML = ''
    resultQuery.textContent = `"${query.getValue()}"`
    searchResult.style.display = 'block'
    page.setCurrent(1)
    await loadUsers(page.getCurrent(), limit, query.getValue(), true)
}

const loadUsers = async (page, limit, query = '', searchStatus = false, sortKey = 'updatedAt') => {
    const response = await getUser(`${apiBaseUrl}/api/v1/user?limit=${limit}&sort=desc&sortKey=${sortKey}&page=${page}&query=${query}`)
    loadMoreButton.style.display = response.hasNextPage ? 'block' : 'none'
    if (searchStatus) resultTotalDocs.textContent = response.totalDocs
    // user not found
    if (response.docs.length == 0) {
        // column container
        const columnContainer = document.createElement('div')
        columnContainer.classList.add('col-lg-12', 'col-12', 'my-2')
        const emtpyContainer = document.createElement('div')
        emtpyContainer.classList.add('alert', 'alert-warning', 'text-center', 'empty')
        emtpyContainer.innerHTML = 'Opps, user not found!'
        // push to dom
        columnContainer.append(emtpyContainer)
        usersList.append(columnContainer)
    } else {
        response.docs.forEach(user => {
            // column container
            const columnContainer = document.createElement('div')
            columnContainer.classList.add('col-lg-4', 'col-md-6', 'col-12', 'my-2')
            // clone user template
            const userContainer = userTemplate.content.cloneNode(true);
            const editButton = userContainer.querySelector('.btn-edit')
            const deleteButton = userContainer.querySelector('.btn-delete')
            userContainer.querySelector('.user-name').textContent = user.name
            userContainer.querySelector('.user-username').textContent = user.username
            userContainer.querySelector('.user-email').textContent = user.email
            userContainer.querySelector('.btn-edit').setAttribute('data-id', user._id)
            userContainer.querySelector('.btn-edit-password').setAttribute('data-id', user._id)
            userContainer.querySelector('.btn-delete').setAttribute('data-id', user._id)
            // push to dom
            columnContainer.append(userContainer)
            usersList.append(columnContainer)
            // edit button handler
            editButton.addEventListener('click', async e => {
                const id = editButton.getAttribute('data-id')
                const user = await getUser(`${apiBaseUrl}/api/v1/user/${id}`)
                editUserForm.id.value = user._id
                editUserForm.name.value = user.name
                editUserForm.username.value = user.username
                editUserForm.email.value = user.email
            })
            // delete button handler
            deleteButton.addEventListener('click', e => {
                const id = deleteButton.getAttribute('data-id')
                deleteUser({ id }, loadUsers)
            })
        })
    }
}

const loadMore = async () => {
    page.increament()
    await loadUsers(page.getCurrent(), limit, query.getValue())
    window.scrollTo({ behavior: "smooth", top: document.body.scrollHeight });
}