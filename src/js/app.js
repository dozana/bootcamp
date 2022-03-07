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
    for(let i = 1; i <= stepsLength; i++) {
        ['step', 'tab','content'].forEach(item => {
            if(i === currentStep) {
                document.querySelector(`.${item}${i}`).classList.add('active');
            } else {
                document.querySelector(`.${item}${i}`).classList.remove('active');
            }
        });
    }
}