// remove all alerts
const removeErrors = (form) => {
    const errorAlerts = form.querySelectorAll('.error')
    errorAlerts.forEach(errorAlert => {
        errorAlert.classList.remove('active')
    })
}

// show exist errors
const showErrors = (form, errorsForm) => {
    errorsForm.forEach(error => {
        const errorAlert = form.querySelector(`.error.error-${error.param}`)
        errorAlert.innerHTML = error.msg
        errorAlert.classList.add('active')
    })
}

export { removeErrors, showErrors }