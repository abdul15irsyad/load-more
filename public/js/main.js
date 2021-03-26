console.log('learning load more concept by abdul15irsyad :)')
let apiBaseUrl = `http://localhost:3009`
let page = 1, limit = 3
// users
let usersList = document.querySelector('.users-list')
let userTemplate = document.querySelector('template.user-template')
// form
let addUserForm = document.querySelector('#add-user-form')
let editUserForm = document.querySelector('#edit-user-form')
// load more
let loadMoreButton = document.querySelector('.btn-load-more')

document.addEventListener('DOMContentLoaded', async () => {
    await loadUsers(page, limit)
    // add user form handle submit
    addUserForm.addEventListener('submit', e => {
        e.preventDefault()
        addUser()
    })
    // edit user form handle submit
    editUserForm.addEventListener('submit', e => {
        e.preventDefault()
        editUser()
    })
    // load more
    loadMoreButton.addEventListener('click', e => {
        e.preventDefault()
        loadMore()
    })
})

let loadUsers = async (page = 1, limit = 3) => {
    let response = await getUser(`${apiBaseUrl}/api/v1/user?limit=${limit}&sort=desc&sortKey=createdAt&page=${page}`)
    if (response.nextPage == null) loadMoreButton.style.display = 'none'
    else loadMoreButton.style.display = 'block'
    response.docs.forEach(user => {
        // column container
        let columnContainer = document.createElement('div')
        columnContainer.classList.add('col-lg-4', 'col-md-6', 'col-12', 'my-2')
        // clone user template
        let userContainer = userTemplate.content.cloneNode(true);
        userContainer.querySelector('.user-name').textContent = user.name
        userContainer.querySelector('.user-username').textContent = user.username
        userContainer.querySelector('.user-email').textContent = user.email
        userContainer.querySelector('.btn-edit').setAttribute('data-id', user._id)
        userContainer.querySelector('.btn-edit-password').setAttribute('data-id', user._id)
        userContainer.querySelector('.btn-delete').setAttribute('data-id', user._id)
        // push to dom
        columnContainer.append(userContainer)
        columnContainer.style.display = 'none'
        usersList.append(columnContainer)
        columnContainer.style.display = 'block';
        columnContainer.style.transition = 'opacity 5s linear';
        // reflow
        columnContainer.getBoundingClientRect();
        // it transitions!
        columnContainer.style.opacity = 1;
    })
    // edit button take user id
    let editButtons = document.querySelectorAll('.btn-edit')
    editButtons.forEach(editButton => {
        editButton.addEventListener('click', async () => {
            let id = editButton.getAttribute('data-id')
            let user = await getUser(`${apiBaseUrl}/api/v1/user/${id}`)
            editUserForm.id.value = user._id
            editUserForm.name.value = user.name
            editUserForm.username.value = user.username
            editUserForm.email.value = user.email
        })
    })
    // delete button take user id
    let deleteButtons = document.querySelectorAll('.btn-delete')
    deleteButtons.forEach(deleteButton => {
        deleteButton.addEventListener('click', async () => {
            let id = deleteButton.getAttribute('data-id')
            await deleteUser(id)
            usersList.innerHTML = ''
            page = 1
            loadUsers(page, limit)
        })
    })
}

let getUser = async url => {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => response.data)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(error.response)
            })
    })
}

let deleteUser = async id => {
    return new Promise((resolve, reject) => {
        axios.delete(`${apiBaseUrl}/api/v1/user/${id}`)
            .then(response => response.data)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(error.response)
            })
    })
}

let addUser = () => {
    let formInputs = {
        name: addUserForm.name.value,
        username: addUserForm.username.value,
        email: addUserForm.email.value,
        password: addUserForm.password.value,
    }
    axios.post(`${apiBaseUrl}/api/v1/user`, formInputs)
        .then(() => {
            $('#add-user-modal').modal('hide')
            usersList.innerHTML = ''
            page = 1
            loadUsers(page, limit)
        })
        .catch(error => {
            if (errorsForm = error.response.data.errors) {
                let errorAlerts = addUserForm.querySelectorAll('.error')
                // remove all alerts
                errorAlerts.forEach(errorAlert => {
                    errorAlert.classList.remove('active')
                })
                // show exist errors
                errorsForm.forEach(error => {
                    let errorAlert = addUserForm.querySelector(`.error.error-${error.param}`)
                    errorAlert.innerHTML = error.msg
                    errorAlert.classList.add('active')
                })
            }
        })
}

let editUser = () => {
    let id = editUserForm.id.value
    let formInputs = {
        name: editUserForm.name.value,
        username: editUserForm.username.value,
        email: editUserForm.email.value,
    }
    axios.patch(`${apiBaseUrl}/api/v1/user/${id}`, formInputs)
        .then(() => {
            $('#edit-user-modal').modal('hide')
            usersList.innerHTML = ''
            page = 1
            loadUsers(page, limit)
        })
        .catch(error => {
            if (errorsForm = error.response.data.errors) {
                let errorAlerts = editUserForm.querySelectorAll('.error')
                // remove all alerts
                errorAlerts.forEach(errorAlert => {
                    errorAlert.classList.remove('active')
                })
                // show exist errors
                errorsForm.forEach(error => {
                    let errorAlert = editUserForm.querySelector(`.error.error-${error.param}`)
                    errorAlert.innerHTML = error.msg
                    errorAlert.classList.add('active')
                })
            }
        })
}

$('#add-user-modal').on('shown.bs.modal', () => {
    addUserForm.name.focus()
})

$('#add-user-modal').on('hidden.bs.modal', () => {
    addUserForm.name.value = ""
    addUserForm.username.value = ""
    addUserForm.email.value = ""
    addUserForm.password.value = ""
    let errorAlerts = addUserForm.querySelectorAll('.error')
    // remove all alerts
    errorAlerts.forEach(errorAlert => {
        errorAlert.classList.remove('active')
    })
})

$('#edit-user-modal').on('shown.bs.modal', () => {
    editUserForm.name.focus()
})

$('#edit-user-modal').on('hidden.bs.modal', () => {
    editUserForm.name.value = ""
    editUserForm.username.value = ""
    editUserForm.email.value = ""
    let errorAlerts = editUserForm.querySelectorAll('.error')
    // remove all alerts
    errorAlerts.forEach(errorAlert => {
        errorAlert.classList.remove('active')
    })
})

let loadMore = async () => {
    page = page + 1
    await loadUsers(page, limit)
    window.scrollTo(0, document.body.scrollHeight);
}