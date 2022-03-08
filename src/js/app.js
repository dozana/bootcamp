// onclick circle show different tab & content
const prevStep = document.querySelector('.prev');
const steps = document.querySelectorAll('.step');
const nextStep = document.querySelector('.next');

const stepsLength = steps.length;
let currentStep = 1;

nextStep.addEventListener('click', async function() {
    if(fillData()) {
        currentStep++;

        if (currentStep > stepsLength) {
            currentStep = stepsLength;
        }

        updateSteps();
    }
});

prevStep.addEventListener('click', function()  {
    if(fillData()) {
        currentStep--;

        if (currentStep < 1) {
            currentStep = 1;

            return false;
        }

        updateSteps();
    }
});

function updateSteps () {
    for (let i = 1; i <= stepsLength; i++) {
        ['step', 'tab','content'].forEach(item => {
            if(i === currentStep) {
                document.querySelector(`.${item}${i}`).classList.add('active');
            } else {
                document.querySelector(`.${item}${i}`).classList.remove('active');
            }
        });
    }
}


// Show per form on click circle
steps.forEach(step => {
    step.addEventListener('click', function() {
        const { index } = this.dataset;
        currentStep = Number(index);

        updateSteps();
    });
});


// get skills from api
let skills = [];

function getSkills() {
    let url = 'https://bootcamp-2022.devtest.ge/api/skills';
    return fetch(url);
}

async function renderSkills() {
    try {
        const res = await getSkills();
        skills = await res.json();
        let skillsOption = '<option value="" disabled selected>Skills</option>';

        skills.forEach(skill => {
            let optionSegment = `<option value="${skill.id}">${skill.title}</option>`;
            skillsOption += optionSegment;
        });

        let skillsList = document.getElementById('skills');
        skillsList.innerHTML = skillsOption;
    } catch (e) {
        console.log('error', e);
    }
}

renderSkills().catch(e => console.log('e', e));


// Add programming skills and experience duration in years
let selectedSkills = [];
const viewRecords = document.querySelector('.skills-table');

document.querySelector('.add-programming-language').addEventListener('click', function(e) {
    e.preventDefault();
    resetErrors();
    const skillId = Number(document.querySelector('#skills').value);
    if(!skillId) {
        return false;
    }

    const experience = Number(document.querySelector('#years').value);
    if(!experience) {
        errors['years'] = 'Experience is required';
        drawErrors();
        return false;
    }

    // add only unique skill
    const found = selectedSkills.find(selected => selected.id === skillId);

    if(!found) {
        selectedSkills.push({
            id: skillId,
            experience
        });

        document.querySelector('#years').value = '';
        drawRecords();
    } else {
        errors['skills'] = 'This skill is already added';
        drawErrors();
    }

});

function drawRecords() {
    viewRecords.innerHTML = '';

    selectedSkills.forEach(item => {
        const skill = skills.find(skill => skill.id === item.id);
        const tr = document.createElement('tr');

        const td1 = document.createElement('td'); // skills
        const td2 = document.createElement('td'); // experience duration in years
        const td3 = document.createElement('td'); // delete icon

        const link = document.createElement('a');
        link.className = 'delete-record';
        link.innerHTML = '<i class="fa fa-times-circle-o " aria-hidden="true"></i>';

        // delete record
        link.addEventListener('click', (e) => {
            e.preventDefault();
            deleteRecord(item.id);
        });

        const text1 = document.createTextNode(skill.title);
        const text2 = document.createTextNode(`years of experience: ${item.experience}`);
        const text3 = link;

        td1.appendChild(text1);
        td2.appendChild(text2);
        td3.appendChild(text3);

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);

        viewRecords.appendChild(tr);
    });
}


// Delete skills and experience duration record
function deleteRecord(id) {
    selectedSkills = selectedSkills.filter(selected => selected.id !== id);
    drawRecords();
}


// input field validation and targeting if empty
const forms = document.querySelectorAll('.form');

const fillData = () => {
    const form = forms[currentStep - 1];
    resetErrors();
    const elements = form.elements;
    let prevRadioBtnName = '';

    for(let element of elements) {
        if(element.id === 'first_name' || element.id === 'last_name') {
            if(element.value.length < 2 ) {
                errors[element.id] = 'This field must be minimum two character';
            }
        }

        if(element.id === 'email') {
            if(!isEmail(element.value)) {
                errors[element.id] = 'Email is not correct';
            }
        }

        if(element.id === 'phone') {
            if(element.value.length > 0) {
                if(!isPhone(element.value)) {
                    errors[element.id] = 'Phone is not correct';
                }
            }
        }

        if(element.id === 'skills') {
            if(!selectedSkills.length) {
                errors[element.id] = 'Select skill';
            }
        }

        if(element.type === 'radio' && element.name !== prevRadioBtnName) {
            prevRadioBtnName = element.name;
            const checked = document.querySelector(`input[type="radio"][name=${element.name}]:checked`);
            if(!checked) {
                errors[element.id] = "This field is required";
            } else {
                let value = checked.value;

                if(value.toLowerCase() === 'true') {
                    value = true;
                } else if(value.toLowerCase() === 'false') {
                    value = false;
                }
            }
        }

        if(element.id === 'vaccinated_when' || element.id === 'devtalk_topic' || element.id === 'something_special') {
            if(!element.value.length) {
                errors[element.id] = 'This field is required';
            }
        }

        if(element.type === 'date') {
            if(!element.value.length) {
                errors[element.id] = 'This field is required';
            }
        }
    }

    if(Object.keys(errors).length) {
        drawErrors();
        return false;
    }

    return true;
}


// draw, set and reset errors
let errors = {};

const drawErrors = () => {
    Object.keys(errors).forEach(key => {
        const error = errors[key];
        setErrorFor(key, error);
    })
}

function setErrorFor(id, message) {
    const input = document.querySelector(`#${id}`)
    const field = input.parentElement; // .field

    let span = field.querySelector('span');
    if(!span) {
        span = field.parentElement.querySelector('span')
    }

    span.innerText = message; // add error message inside span

    field.className = 'field error'; // add error class
}

const resetErrors = () => {
    errors = [];
    document.querySelectorAll('form span').forEach(span => span.innerHTML = '');
    document.querySelectorAll('form .field').forEach(field => {
        field.classList.remove('error');
    });
}


// rules for email and phone input fields
const email = document.getElementById('email');
const phone = document.getElementById('phone');

function isEmail(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

function isPhone(str) {
    const regexPhoneNumber = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im; // +995593123456

    if (str.match(regexPhoneNumber)) {
        return true;
    } else {
        return false;
    }
}