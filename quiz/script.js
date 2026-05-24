let quizContainer = document.querySelector('.quizcontainer')
let score = document.querySelector('.score')
let flag = document.querySelector('.flag')
let img = document.querySelector('.flag img')
let options = document.querySelector('.options')
let result = document.querySelector('.result')

// GLOBAL GAME STATES
let currentScore = 0; 
let countriesData = []; 
score.innerText = `Score: ${currentScore}`;

// FETCH THE DATA ONCE WHEN THE PAGE LOADS
fetch('https://restcountries.com/v3.1/all?fields=name,flags')
.then(function(res){
    return res.json()
})
.then(function(data){
    countriesData = data;  
    nextQuestion(); // Start the first round!       
})
.catch(function(err){
    console.log(err,"error")
})

// FUNCTION TO LOAD A NEW FLAG AND OPTIONS
function nextQuestion() {
    result.innerText = "";
    
    // 1. Pick the random country safely right when the question loads
    let ran = Math.floor(Math.random() * countriesData.length);
    let country = countriesData[ran];
    
    // 2. Display the flag using fast-loading PNG
    img.src = country.flags.png; 
    
    // Filter out the correct answer to build the wrong choices list
    let filtered = countriesData.filter(function(item){
        return item.name.common !== country.name.common;
    });
    
    // Gather our 4 options
    let choices = [country.name.common];
    for (let i = 0; i < 3; i++) {
        let randomWrongIndex = Math.floor(Math.random() * filtered.length);
        choices.push(filtered[randomWrongIndex].name.common);
    }
    
    // Shuffle options
    choices.sort(function() { return Math.random() - 0.5; });

    // Clear old buttons and draw the new ones
    options.innerHTML = "";
    choices.forEach(function(choiceText) {
        let btn = document.createElement('button');
        btn.innerText = choiceText;
        
        // Pass the precise current 'country.name.common' into the listener
        btn.addEventListener('click', function() {
            checkAnswer(btn, country.name.common);
        });
        
        options.appendChild(btn);
    });
}

// THE CHECK ANSWER FUNCTION
function checkAnswer(selectedButton, correctName) {
    if (selectedButton.innerText === correctName) {
        result.innerText = "Correct! 🎉";
        result.style.color = "lightgreen";
        selectedButton.style.backgroundColor = "green";
        currentScore += 10;
        score.innerText = `Score: ${currentScore}`;
    } else {
        result.innerText = `Wrong! It was ${correctName} ❌`;
        result.style.color = "#ff6b6b";
        selectedButton.style.backgroundColor = "red";
    }
    
    // Freeze all option buttons immediately
    let allButtons = options.querySelectorAll('button');
    allButtons.forEach(function(btn) {
        btn.disabled = true;
        btn.style.cursor = "default";
    });

    // Wait 2 seconds, THEN safely generate a new country
    setTimeout(function() {
        nextQuestion();
    }, 1000); 
}