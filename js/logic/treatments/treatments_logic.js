const addServiceBtn = document.getElementById('add-service-btn')

const treatmentNumberInput = document.getElementById('treatment-number-input')
const treatmentInformationInput = document.getElementById('treatment-information-input')
const carNumberInput = document.getElementById('car-number-input')
const dateInput = document.getElementById('treatment-date-input')

if (addServiceBtn != null) {
    addServiceBtn.addEventListener('click', (e) => {
        e.preventDefault()
    
        const email = localStorage.getItem('email')
        const treatmentNumber = treatmentNumberInput.value
        const treatmentInformation = treatmentInformationInput.value
        const carNumber = carNumberInput.value
        const date = new Date(dateInput.value)
        
        var isValid = isInputsValid(treatmentNumber, treatmentInformation, carNumber, date)
    
        if (!isValid) {
            return
        }
    
        const treatment = {
            number : treatmentNumber,
            information : treatmentInformation,
            date : date,
            workerEmail : email, 
            carNumber : carNumber
        }
    
        if (addServiceBtn.textContent === 'Edit Service') {
            editTreatment(treatment)
        } else {
            addNewTreatment(treatment)
        }
    })
}

const isInputsValid = (treatmentNumber, treatmentInformation, carNumber, date) => {
    var isValid = true
    clearBorders()

    if (!isValidTreatmentNumber(treatmentNumber)) {
        isValid = false
        treatmentNumberInput.style.border = '1px solid red'
    }

    if (!isValidCarNumber(carNumber)) {
        isValid = false
        carNumberInput.style.border = '1px solid red'
    }

    if (treatmentInformation.length == 0) {
        isValid = false
        treatmentInformationInput.style.border = '1px solid red'
    }

    if (date == "Invalid Date") {
        isValid = false
        dateInput.style.border = '1px solid red'
    }

    return isValid
}

function clearBorders() {
    var borderColor = "#d1d3e2"

    treatmentNumberInput.style.borderColor = borderColor;
    treatmentInformationInput.style.borderColor = borderColor;
    carNumberInput.style.borderColor = borderColor;
    dateInput.style.borderColor = borderColor;
}

const addNewTreatment = async (newTreatment) => {
    const url = `/treatments`
    
    const request = {
        method: "POST",
        body: JSON.stringify(newTreatment),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const response = await fetch(url, request)

    location.reload()
    console.log("sendHttpRequest: response: " + JSON.stringify(response))
    return response
}

const editTreatment = async (newTreatment) => {
    const url = `/treatments`
    
    const request = {
        method: "PUT",
        body: JSON.stringify(newTreatment),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const response = await fetch(url, request)

    location.reload()
    console.log("sendHttpRequest: response: " + JSON.stringify(response))
    return response
}

const getTreatmentServices = function() {

    return fetch(`/treatments`)
    .then(response => response.json())
    .then(data => {
        return data
    });
}

const padTo2Digits = (num) => {
    return num.toString().padStart(2, '0');
}
  
const formatDate = (date) => {
return (
    [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
    padTo2Digits(date.getHours()),
    padTo2Digits(date.getMinutes())
    ].join(':')
);
}

const deleteTreatment = async (treatmentNumber) => {

    const url = `/treatments`
    
    const request = {
        method: "DELETE",
        body: JSON.stringify({ number : treatmentNumber}),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const response = await fetch(url, request)
    location.reload()
    console.log("sendHttpRequest: response: " + JSON.stringify(response))
    return response
}

const editData = (data) => {
    treatmentNumberInput.value = data.number
    treatmentNumberInput.readOnly = true
    treatmentInformationInput.value = data.information
    
    dateInput.value = data.date.substring(0, 16)
    carNumberInput.value = data.carNumber

    addServiceBtn.textContent = "Edit Service"
}
