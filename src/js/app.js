// onclick circle show different tab & content
const prevStep = document.querySelector('.prev');
const steps = document.querySelectorAll('.step');
const nextStep = document.querySelector('.next');

const stepsLength = steps.length;
let currentStep = 1;

const apiUrl = 'https://bootcamp-2022.devtest.ge/api'

nextStep.addEventListener('click', async function() {
    if(fillData()) {
        currentStep++;

        if (currentStep > stepsLength) {

            // open questionnaire
            document.querySelector('.page2').classList.remove('active'); // hide questionnaire
            document.querySelector('.page3').classList.add('active'); // show submit page

            // submit questionnaire
            const submitBtn = document.querySelector('.btn-3');

            submitBtn.addEventListener('click', async function() {
                document.querySelector('.page3').classList.remove('active');

                try {
                    // send data
                    await sendApplication();

                    // show "thank you", wait 3 sec and redirect
                    document.querySelector('.page4').classList.add('active');

                    // redirect
                    setTimeout(() => {
                        window.location = 'index.html';
                    }, 3000);

                } catch (e) {
                    console.log('error', e);
                }
            });

        }

        updateSteps();
    }
});

document.querySelector('.back-btn').addEventListener('click', function(e) {
    e.preventDefault()
    currentStep = 4
    updateSteps()
    document.querySelector('.page3').classList.remove('active'); // hide questionnaire
    document.querySelector('.page2').classList.add('active'); // show submit page
})

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

let skills = []

function getSkills() {
    let url = `${apiUrl}/skills`;

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
            } else {
                data[element.id] = element.value;
            }
        }

        if(element.id === 'email') {
            if(!isEmail(element.value)) {
                errors[element.id] = 'Email is not correct';
            } else {
                data[element.id] = element.value;
            }
        }

        if(element.id === 'phone') {
            if(element.value.length > 0) {
                if(!isPhone(element.value)) {
                    errors[element.id] = 'Phone is not correct';
                } else {
                    data[element.id] = element.value;
                }
            }
        }

        if(element.id === 'skills') {
            if(!selectedSkills.length) {
                errors[element.id] = 'Select skill';
            } else {
                data[element.id] = selectedSkills;
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

                data[element.name] = value;
            }
        }

        if(element.id === 'vaccinated_when' || element.id === 'devtalk_topic' || element.id === 'something_special') {
            if(!element.value.length) {
                errors[element.id] = 'This field is required';
            } else {
                data[element.id] = element.value;
            }
        }

        if(element.type === 'date') {
            if(!element.value.length) {
                errors[element.id] = 'This field is required';
            } else {
                data[element.id] = element.value;
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


// send application data
const data = { token: '2efa049a-ed33-4bde-b469-e8a685dafd47' };

async function sendApplication() {
    return fetch('https://bootcamp-2022.devtest.ge/api/application', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}


// change pages
const btnStartQuestionnaire = document.querySelector('.btn-1');
const btnSubmittedApplication = document.querySelector('.btn-2');

btnStartQuestionnaire.addEventListener('click', function() {
    document.querySelector('.page1').classList.remove('active');
    document.querySelector('.page2').classList.add('active');
});

btnSubmittedApplication.addEventListener('click', function() {
    document.querySelector('.page1').classList.remove('active');
    document.querySelector('.page5').classList.add('active');
});

// get application data

async function getApplications() {
    const fetchApplicationsUrl = `${apiUrl}/applications?token=${data.token}`;

    const response = await fetch(fetchApplicationsUrl);
    const applications = await response.json();

    if(!skills.length) {
        const skillsResponse = await getSkills()
        skills = await skillsResponse.json()
    }

    applications.forEach(application => {
        document.querySelector('.first_name').textContent = application.first_name;
        document.querySelector('.last_name').textContent = application.last_name;
        document.querySelector('.email').textContent = application.email;
        document.querySelector('.phone').textContent = application.phone;

        // How would you prefer to work?
        let workPreference = application.work_preference;
        if (workPreference === 'from_office') {
            document.querySelector('.from_office').checked = true;
        } else if (workPreference === 'from_home') {
            document.querySelector('.from_home').checked = true;
        } else if (workPreference === 'hybrid') {
            document.querySelector('.hybrid').checked = true;
        }


        // Did you have covid 19? :(
        let hadCovid = application.had_covid;
        if (hadCovid === true) {
            document.querySelector('.had_covid_yes').checked = true;
        } else if (hadCovid === false) {
            document.querySelector('.had_covid_no').checked = true;
        }


        // When did you have covid 19?
        document.querySelector('.had_covid_at').setAttribute("value", application.had_covid_at);

        // Have you been vaccinated?
        let vaccinated = application.vaccinated;
        if (vaccinated === true) {
            document.querySelector('.vaccinated_yes').checked = true;
        } else if (vaccinated === false) {
            document.querySelector('.vaccinated_no').checked = true;
        }

        // When did you get your last covid vaccine?
        document.querySelector('.vaccinated_at').setAttribute("value", application.vaccinated_at);


        // Skills
        const { skills: selectedSkills } = application

        let skillsHtml = ''
        selectedSkills.forEach(selected => {
            const skill = skills.find(skill => selected.id === skill.id)
            skillsHtml += `<div class="row">
                        <div class="col">${skill.title}</div>
                        <div class="col">Years of experience: <span class="">${selected.experience}</span></div>
                    </div>`
        });

        document.querySelector(".skills").innerHTML = skillsHtml

        // Would you attend Devtalks and maybe also organize your own?
        let willOrganizeDevtalk = application.will_organize_devtalk;
        if (willOrganizeDevtalk === true) {
            document.getElementById('will_organize_devtalk_yes').checked = true;
        } else if (willOrganizeDevtalk === false) {
            document.getElementById('will_organize_devtalk_no').checked = true;
        }

        // What would you speak about at Devtalk?
        document.querySelector('.devtalk_topic').textContent = application.devtalk_topic;

        // Tell us something special?
        document.querySelector('.something_special').textContent = application.something_special;

    });
}

getApplications();