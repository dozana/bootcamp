// onclick circle show different tab & content
const prevStep = document.querySelector('.prev');
const steps = document.querySelectorAll('.step');
const nextStep = document.querySelector('.next');

const stepsLength = steps.length;
let currentStep = 1;

nextStep.addEventListener('click', function() {
    currentStep++;

    if (currentStep > stepsLength) {
        currentStep = stepsLength;
    }

    updateSteps();
});

prevStep.addEventListener('click', function()  {
    currentStep--;

    if (currentStep < 1) {
        currentStep = 1;

        return false;
    }

    updateSteps();
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

    const skillId = Number(document.querySelector('#skills').value);
    if(!skillId) {
        return false;
    }

    const experience = Number(document.querySelector('#years').value);
    if(!experience) {
        return false;
    }

    selectedSkills.push({
        id: skillId,
        experience
    });

    document.querySelector('#years').value = '';
    drawRecords();
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