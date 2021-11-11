let player_list = [];
let player_index = 0;
let flipCards = [];
let ai;
let questionAnswered =0;
let totalQuestions = 0;
let isMultiPlayer = false;


class Question{
    constructor(questionString){

        this.questionString = questionString;
        this.answer = "";
        this.value = 0;
        }
}

class Category{
    constructor(name){
        this.name = name;
        this.questions = [];
    }

    addQuestion(question)
    {
        this.questions.push(question);
    }

    printQuestion(){
        console.log(this.name);
        this.questions.forEach(question => console.log(`${question.questionString}`));
    }
}

class Player{
    constructor(name){
        this.name = name;
        this.points = 0;
        this.element;
        this.turn = false;
    }

  
}

class AiPlayer extends Player{
    constructor(name){
        super("Sawyer");
        this.name = name;
        this.points = 0;
        this.flipCards = [];
        this.currentFlipCard;
        this.element;
        this.turn = false;
    }

    pickFlipCard(){

        let randomNum =  Math.floor(Math.random() * (totalQuestions - questionAnswered));
        let chosenCard = ai.flipCards[randomNum];

        this.currentFlipCard = chosenCard;

        console.log("All flip Cards");
        console.log(this.flipCards);
        
        console.log("Flip card before time out");
        console.log(this.currentFlipCard);

        setTimeout(function(){
            chosenCard.classList.toggle("flip-card-inner");
            
    
        },5000);
        
        setTimeout(this.insertAnswer.bind(this),10000);

    }

    insertAnswer(){
        
        console.log("In the insert");
        

        let randomChanceOfCorrectAnswer = Math.ceil(Math.random() *4);
        console.log(randomChanceOfCorrectAnswer);
        
        
      

        
        console.log(`${this.currentFlipCard} the value `);
        let textArea = this.currentFlipCard.querySelector(".flip-card-back").querySelector("textarea");
        let answer = this.currentFlipCard.querySelector(".flip-card-back").dataset.answer;
        let questionString  = this.currentFlipCard.querySelector(".flip-card-back").querySelector("div").textContent;
        let valueOfQuestion = this.currentFlipCard.querySelector(".flip-card-front").textContent;


     

        let question = new Question(questionString);
        question.answer = answer;
        question.value = valueOfQuestion;

    
        if (randomChanceOfCorrectAnswer === 3)
        {
            textArea.value = answer;
        }
        else{

            textArea.value = "blank";
        }

        verifyAnswer(this.currentFlipCard,question,this);
        

        
     

      

    }


    createAiElement(){

        

    //player_list.push(player);

    let aiGrid = document.createElement("div");

    let aiElement = document.createElement("div");
    aiElement.classList.add("ai");

    let ainameElement = document.createElement("div");
    ainameElement.textContent = this.name;

    let aiscoreElement = document.createElement("div");
    aiscoreElement.classList.add("score");
  

    aiElement.append(ainameElement);
    aiElement.append(aiscoreElement);

    this.element = aiGrid;


    aiGrid.append(aiElement);
    document.body.append(aiGrid);

    }
  
    
}


function createGrid(hasAI){
    let flexGrid = document.createElement("div");
    flexGrid.classList.add("flex-grid");



    document.body.append(flexGrid);


    if(hasAI){
        
        console.log("In the if");
        ai = new AiPlayer("Sunny");
        ai.createAiElement();
        player_list.push(ai);
    }

    else{
        console.log("not created");
    }


    get3Categories().then(([category1,category2,category3]) => {
        let allcategories = [category1, category2, category3];

        allcategories.forEach(category => createRowElement(category))

        
        
        //startGame();
    })


   

    
}


function createRowElement(quizData) {
    let randomCategory = new Category(quizData.clues[0].category.title);

    
    console.log(randomCategory);

    for (let qIndex = 0; qIndex < 5; qIndex++) {
        let currentClue = quizData.clues[qIndex];
        let que = new Question(currentClue.question);
        que.answer = currentClue.answer;
        que.value = currentClue.value;
        randomCategory.addQuestion(que);
        totalQuestions +=1;


    }

    randomCategory.printQuestion();
    let flexGrid = document.querySelector(".flex-grid");
    let categoryDiv = createCategoryList(randomCategory);

    flexGrid.append(categoryDiv);

    if (ai == null || ai == undefined) {

        console.log("AI doesn't exist!");
    }
    else {
        ai.flipCards = Array.from(document.querySelectorAll(".flip-card"));
        console.log(ai.flipCards);


    }

    return flexGrid;
}

function getmyCategory(){
    let randomNumber = Math.floor(Math.random() * 300)
    console.log(`Random category number ${randomNumber}`);

    //Category 23 has less than 3

    return fetch(`https://jservice.kenzie.academy/api/clues?category=${randomNumber}`)
    .then(response=> response.json())
    .then(quizData =>{
        if(quizData.clues.length < 5){

            console.log("Begin infinity");
            return getmyCategory();

        }
        else{
            return quizData;
        }
    })
}

function get3Categories(){
    return Promise.all([getmyCategory(),getmyCategory(),getmyCategory()])

}



function createCategoryList(category){

    let column = document.createElement("div");
    column.classList.add("col");

    let row = document.createElement("div");
    row.classList.add("row");

    row.textContent = category.name;
   

    column.append(row);

    category.questions.forEach(question => {

        let questionRow = document.createElement("div");
        questionRow.classList.add("row");
        //questionRow.textContent = question.questionString;

        let flipCard = makeFlipCard(question);

        createClickFlipEvent(flipCard);

        

        flipCards.push(flipCard);
        questionRow.append(flipCard);
        column.append(questionRow);
              
    });

    

    return column;
}



function makeFlipCard(question) {
    let flipCard = document.createElement("div");
    flipCard.classList.add("flip-card");

    let flipCard_inner = document.createElement("div");
    flipCard_inner.classList.add("flip-card-inner");
    //let checkForClick = document.createElement("input");
    
    //checkForClick.type = "checkbox";
    

    let flipCardFront = document.createElement("div");
    flipCardFront.classList.add("flip-card-front");

    flipCardFront.textContent = question.value;

    let flipCardBack = document.createElement("div");
    flipCardBack.classList.add("flip-card-back");

    

    let textArea = document.createElement("textarea");
    let questionDiv = document.createElement("div");
    let answerButton = document.createElement("button");
    answerButton.textContent = "Submit";
    answerButton.classList.add("button");


    flipCardBack.dataset.answer = question.answer;
    flipCardBack.dataset.question = question.questionString;
    flipCardBack.dataset.value  = question.value;

    questionDiv.textContent = question.questionString;
    

    flipCardBack.append(questionDiv);
    flipCardBack.append(textArea);
    flipCardBack.append(answerButton);

    


    answerButton.addEventListener("click",function(){


        verifyAnswer(flipCard,question,player_list[0])
    });
    

    flipCard_inner.append(flipCardFront);
    flipCard_inner.append(flipCardBack);

    //flipCard.append(checkForClick);

    flipCard.append(flipCard_inner);
    return flipCard;
}

function createClickFlipEvent(flipCard) {
    
     flipCard.addEventListener("click", function () {
        let clickedElement = event.target;
        let parent = clickedElement.closest(".flip-card");
        //parent.classList.toggle("click"); 

        let flipCardInn = flipCard.querySelector(".flip-card-inner")
        
        console.log(clickedElement.className + "Click flip");
        
        if(clickedElement.className === "flip-card-front"){

            console.log("On the back if " + flipCard.classList);
            
           
            flipCard.classList.toggle("flip-card-inner");
            
            
        }

        else if(clickedElement.className === "flip-card-inner flip-card"){

            console.log("Inner flip")
        }
        else{

         
        }
 

    }); 
}




function verifyAnswer(flipCard,question,player)
{

    

    let flipCardInn = flipCard.querySelector(".flip-card-inner");
    let flipCardBack = flipCard.querySelector(".flip-card-back");

    let userAnswer = flipCardBack.querySelector("textarea");
    flipCardInn.classList.toggle("flip-card");


    let playerScore = player.element.querySelector(".score");
    let verification = false;

    question.value = parseInt(question.value);
    
    if(userAnswer.value.toLowerCase() === question.answer.toLowerCase() || userAnswer.value === "answer"){
        console.log("Answer is right!")

        verification = true;

        flipCardBack.innerHTML = "";
        flipCardBack.textContent = "Correct!";
        player.points += question.value;
        playerScore.textContent = player.points;
        console.log(question.value);
        console.log(player.points);
        
        if(isMultiPlayer){
            deleteFlipCard(flipCard);
                
        }

        if(player instanceof AiPlayer){
            console.log(player);
            ai.pickFlipCard();
        }
    }
   
    else{
        console.log(`${question.value} Question Points`);
        console.log(`${player.points} Player Points`);
        flipCardBack.innerHTML = "";
        flipCardBack.textContent = "WRONG!";
        player.points -= question.value;
        playerScore.textContent = player.points;
        if(isMultiPlayer === true){

         
            deleteFlipCard(flipCard);
            changeTurn(player);
        }

    }

    

    flipCard.classList.toggle("flip-card-inner");

    questionAnswered +=1;

 
    

    if (questionAnswered === totalQuestions){
        createGameOverPage();
        
    } 

    if(userAnswer.value.toLowerCase() === "answerall"){

        createGameOverPage();

    }

   

}

function deleteFlipCard(flipCard) {
    let indexOfCurrentCard = ai.flipCards.indexOf(flipCard);

    console.log("Deleted flip card");
    console.log(ai.flipCards.splice(indexOfCurrentCard, 1));
}

function changeTurn(player){

    let isAi = player instanceof AiPlayer;
    let turnTitleElement = document.querySelector(".turn")
    player_index += 1;

        if(player_index >= player_list.length){
            player_index = 0;
        }
    if(player.turn){
        

        player.turn  = false;
        
       
        if(isAi){
            
            console.log("Not the Ai's turn");
            turnTitleElement.textContent = `${player_list[player_index].name}'s turn!`;
            player_list[player_index].turn = true;

        }
        else{

            console.log("Ai's turn");
            turnTitleElement.textContent = `${player_list[player_index].name}'s turn!`;
            player_list[player_index].turn = true;
            ai.pickFlipCard();
        }
        console.log(player.turn);
    }
    


  
}

function createGameOverPage(){
    let main = document.querySelector("main");
    let turnH1 = document.querySelector(".turn");
    let mainh1 = document.createElement("h1")
    let mainScoreElement = document.createElement("div");

    let grid = document.querySelector(".flex-grid");
    let player = document.querySelector(".player");
    let ai = document.querySelector(".ai");

    main.innerHTML = "";
    grid.innerHTML="";
    turnH1.innerHTML = "";
    player.innerHTML = "";
    player.classList.remove("player");
    if(isMultiPlayer){

        ai.innerHTML = "";
        ai.classList.remove("ai");
    }

    
    
    
    let highestScore = -Infinity;

    main.append(mainh1);
    main.append(mainScoreElement);

    player_list.forEach(player => {

        let playerDiv = document.createElement("div");
        let nameElement = document.createElement("h1");
        let scoreElement = document.createElement("div");


        nameElement.textContent = player.name;
        scoreElement.textContent = player.points;

        playerDiv.append(nameElement);
        playerDiv.append(scoreElement);

        if(player.points > highestScore){
            highestScore = player.points;
            mainh1.textContent = `The WINNER IS ${player.name}!!! WITH 
            ${player.points} POINTS!!!!!!`;
            
        }
        main.append(playerDiv);

      
        
    })

    let resetButton = document.createElement("button");
    resetButton.textContent = "Play again?!"
    resetButton.addEventListener("click",function(){

        
        main.innerHTML = "";
        player_list = [];
        player_index = 0;
        flipCards = [];
        ai = null;
        questionAnswered =0;
        totalQuestions = 0;
        isMultiPlayer = false;


        createStartPage();

        
    })
    main.append(resetButton)


    


}

function createPlayer(){

    let player = new Player("Player 1");

    player_list.push(player);

    let playerGrid = document.createElement("div");

    let playerElement = document.createElement("div");
    playerElement.classList.add("player");

    let nameElement = document.createElement("div");
    nameElement.textContent = player.name;

    let scoreElement = document.createElement("div");
    scoreElement.classList.add("score");
    player.turn = true;
  

    playerElement.append(nameElement);
    playerElement.append(scoreElement);

    player.element = playerElement;


    playerGrid.append(playerElement);
    document.body.append(playerGrid);

    let turnH1 = document.querySelector(".turn");
    turnH1.style.display = "block";
    turnH1.textContent = `${player.name}'s turn!`;



}

function createStartPage(){
    let main = document.querySelector("main");

    let singlePlayerButton = document.createElement("button");
    let multiPlayerButton = document.createElement("button");

    singlePlayerButton.textContent = "Single Player";
    multiPlayerButton.textContent = "Multiplayer";
    
    singlePlayerButton.addEventListener("click",function(){
        main.innerHTML = "";
        createPlayer();
        createGrid(false);
    })

    multiPlayerButton.addEventListener("click",function(){
        main.innerHTML = "";
        
        createPlayer();
        isMultiPlayer = true;
        createGrid(true);
      


    })

    main.append(singlePlayerButton);
    main.append(multiPlayerButton);
}



createStartPage();




//createPlayer();

//createGrid();



