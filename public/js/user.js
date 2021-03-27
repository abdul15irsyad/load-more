import { removeErrors, showErrors } from './error.js'
import { apiBaseUrl, addUserForm, editUserForm, usersList, page, limit } from './global.js'

let getUser = url => {
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

const addUser = ({ }, callback) => {
    const formInputs = {
        name: addUserForm.name.value,
        username: addUserForm.username.value,
        email: addUserForm.email.value,
        password: addUserForm.password.value,
    }
    axios.post(`${apiBaseUrl}/api/v1/user`, formInputs)
        .then(async () => {
            $('#add-user-modal').modal('hide')
            usersList.innerHTML = ''
            page.setCurrent(page.getCurrent() > page.maxLoad ? page.maxLoad : page.getCurrent())
            for (let i = 1; i <= page.getCurrent(); i++) {
                await callback(i, limit)
            }
        })
        .catch(error => {
            const errorsForm = error.response.data.errors
            if (errorsForm) {
                removeErrors(addUserForm)
                showErrors(addUserForm, errorsForm)
            }
        })
}

const editUser = ({ }, callback) => {
    const id = editUserForm.id.value
    const formInputs = {
        name: editUserForm.name.value,
        username: editUserForm.username.value,
        email: editUserForm.email.value,
    }
    axios.patch(`${apiBaseUrl}/api/v1/user/${id}`, formInputs)
        .then(async () => {
            $('#edit-user-modal').modal('hide')
            usersList.innerHTML = ''
            page.setCurrent(page.getCurrent() > page.maxLoad ? page.maxLoad : page.getCurrent())
            for (let i = 1; i <= page.getCurrent(); i++) {
                await callback(i, limit)
            }
        })
        .catch(error => {
            if (errorsForm = error.response.data.errors) {
                removeErrors(editUserForm)
                showErrors(editUserForm, errorsForm)
            }
        })
}

const deleteUser = ({ id }, callback) => {
    axios.delete(`${apiBaseUrl}/api/v1/user/${id}`)
        .then(async () => {
            usersList.innerHTML = ''
            page.setCurrent(page.getCurrent() > page.maxLoad ? page.maxLoad : page.getCurrent())
            for (let i = 1; i <= page.getCurrent(); i++) {
                await callback(i, limit)
            }
        })
        .catch(error => {
            console.log(error.response)
        })
}

export { getUser, addUser, editUser, deleteUser }