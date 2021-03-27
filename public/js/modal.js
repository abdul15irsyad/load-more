import { addUserForm, editUserForm } from './global.js'
import { removeErrors } from './error.js'

$('#add-user-modal').on('shown.bs.modal', () => {
    addUserForm.name.focus()
})

$('#add-user-modal').on('hidden.bs.modal', () => {
    emptyInputs(addUserForm)
    removeErrors(addUserForm)
})

$('#edit-user-modal').on('shown.bs.modal', () => {
    editUserForm.name.focus()
})

$('#edit-user-modal').on('hidden.bs.modal', () => {
    emptyInputs(editUserForm)
    removeErrors(editUserForm)
})

const emptyInputs = (form) => {
    const inputs = form.querySelectorAll('input')
    inputs.forEach(input => {
        input.value = ""
    })
}