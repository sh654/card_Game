// Js Code 
const cardObjectDefinitions = [
    {id:1, imagePath:'/images/card-KingHearts.png'},
    {id:2, imagePath:'/images/card-JackClubs.png'},
    {id:3, imagePath:'/images/card-QueenDiamonds.png'},
    {id:4, imagePath:'/images/card-AceSpades.png'},
]
const aceId = 4

const cardBackImgPath = '/images/card-back-Blue.png'

const cardContainerElem = document.querySelector('.card-container')

let cards = []

const playGameButtonElem = document.getElementById('playGame')

const collapsedGridAreaTemplate = '"a a" "a a"' // This method will collapse the grid initially of 4 cells to single large cells 

const cardCollectionCellClass = ".card-pos-a" //here we chosse our 1st cell to contain all stack elements ie cards after collapsedGridAreaTemplate is used

const numCards = cardObjectDefinitions.length
let cardPositions = [] // Global variable that stores an array of card position within the grid 

let gameInProgress = false
let shufflingInProgress = false
let cardsRevealed = false

// updateStatusElement(currentGameStatusElem, "block", winColor, "Hit!! - Well Done!! :)")

const currentGameStatusElem = document.querySelector('current-status')
const scoreContainerElem = document.querySelector('.header-score-container')
const scoreElem = document.querySelector('.score')
const roundContainerElem = document.querySelector('.header-round-container')
const roundElem = document.querySelector('.round')

const winColor = "green"// If user select correct card text in green color
const loseColor = "red"
const primaryColor = "black"

let roundNum = 0
let maxRounds = 4
let score = 0



loadGame()

/* 
 Now we have to create a function that allows to take user choice than it will reward if user chooses correct card and no points for wrong card 
*/
function chooseCards(card)
{
    if(canChooseCards)
    {
        evaluateCardChoice(card, cum)
    }
}

function calculateScoreToAdd(roundNum)
{
    if(roundNum == 1)
    {
        return 100
    }
    else if(roundNum == 2)
    {
        return 100
    }
    else if(roundNum == 3)
    {
        return 25
    }
    else 
    {
        return 10
    }
}

function calculateScore(){
    const scoreToAdd = calculateScoreToAdd(roundNum)
    score = score + scoreToAdd
}


function updateScore()
{
    calculateScore()
}

function updateStatusElement(elem, display, color, innerHtml)
{
    elem.style.display = display
    if(arguments.length > 2)
    {
        elem.style.color = color
        elem.innerHtml = innerHtml
    }
}

function outputChoiceFeedback(hit)
{
    if(hit)
    {
        updateStatusElement(currentGameStatusElem, "block", winColor, "Hit!! - Well Done!! :)")
    }
    else
    {
        updateStatusElement(currentGameStatusElem, "block", loseColor, "Missed!! :(")
    }
}



function evaluateCardChoice(card) // This method is responsible for evaluating whether the card is ace of spades or not 
{
    if(card.id == aceId)
    {
        updateScore()
        outputChoiceFeedback(true)
    }
    else
    {
        outputChoiceFeedback(false)
    }
}

function canChooseCards() // it make sure choose card functionality is not performed while shuffle is done for the cards
{
    return gameInProgress == true && !shufflingInProgress && !cardsRevealed 
    // This says that if the game is in process and the shuffling process is not in progress and the cards are not in the process of being revealed expression returns true . When expression is true user is able to choose a card  when false no functionality performed when card is clicked 

}

// Load Game and start Game
function loadGame(){
    createCards()

    cards = document.querySelectorAll('.card')

    playGameButtonElem.addEventListener('click', ()=>startGame())

}

function startGame(){
    initializeNewGame()
    startRound()

}

function initializeNewGame(){
    score = 0
    roundNum = 0 

    shufflingInProgress = false
    updateStatusElement(scoreContainerElem, "flex")
    updateStatusElement(roundContainerElem, "flex")

    
}
function startRound(){   //Definition of startRound of the game
    initializeNewRound()
    collectCards()
    flipCards(true) 
    ShuffleCards()
}
function initializeNewRound(){
    roundNum++
    playGameButtonElem.disabled = true

    gameInProgress = true
    shufflingInProgress = true
    cardsRevealed = false

    updateStatusElement(currentGameStatusElem, "block", primaryColor, "Shffling....")
}





function collectCards(){
    transformGridArea(collapsedGridAreaTemplate) // when cards collected to stack it will transform the grid cell size  
    addCardsToGridAreaCell(cardCollectionCellClass)
}

function transformGridArea(areas){
    cardContainerElem.style.gridTemplateAreas = areas  // Responsible for making cell a spread on overall grid while stacking
}
function addCardsToGridAreaCell(cellPositionClassName){
    const cellPositionElem = document.querySelector(cellPositionClassName)

    cards.forEach((card, index) => {
        addChildElement(cellPositionElem, card)
    })
}
// Now whenever users click on start they should see that the cards are stacked on one another 
// And position centrally within the grid of the stacked cards 

function flipCard(card, flipToBack)
{
    const innerCardElem = card.firstChild

    if(flipToBack && !innerCardElem.classList.contains('flip-it'))
    {
        innerCardElem.classList.add('flip-it')
    }
    else if(innerCardElem.classList.contains('flip-it'))
    {
        innerCardElem.classList.remove('[flip-it')
    }
}

function flipCards(flipToBack)
{ // we pass flipToback Paramter to flip the cards when they are taken for stacking or shuffling 
    cards.forEach((card, index) =>{
        setTimeout(() =>{
            flipCard(card, flipToBack)
        }, index * 100)
    })
}

// To randomize the position of cards while shuffling new function is shuffleCards
function ShuffleCards()
{
    const id = setInterval(shuffle, 12) // ie after every 12 ms shuffle will be executeded
    let shuffleCount = 0

    function shuffle()
    {
        randomizeCardPositions()

        if(shuffleCount == 500)
        {
            clearInterval(id)
            dealCards() // executed when shuffleCount = 500
        }
        else
        {
            shuffleCount++;
        }
    }
}

function randomizeCardPositions()
{
    const random1 = Math.floor(Math.random() * numCards) + 1

    const random2 = Math.floor(Math.random() * numCards) + 1

    const temp = cardPositions[random1 - 1] // Then we can use this above two random numbers to swap the positions for relevant cards within the cardPositions array

    //This creates shuffle like effect for our 4 cards 
    cardPositions[random1 - 1] = cardPositions[random2 - 1]
    cardPositions[random2 - 1] = temp 
}

// Thia dealCards method will restore the grid to contain 4 grid cells and add each card back to they original position to grid 
function dealCards()
{
    addCardsToAppropriateCell()
    const areasTemplate = returnGridAreasMappedToCardPos()
    //This will return grid area template value containing a new positional configuration  

    transformGridArea(areasTemplate)
}
function returnGridAreasMappedToCardPos(){
    let firstPart = ""
    let secondPart =""
    let areas = ""

    cards.forEach((card, index) => {
        if(cardPositions[index] == 1)
        {
            areas = areas + "a "
        }
        else if(cardPositions[index] == 2)
        {
            areas = areas + "b "
        }
        else if (cardPositions[index] == 3)
        {
            areas = areas + "c "
        }
        else if (cardPositions[index] == 4)
        {
            areas = areas + "d "
        }
        if (index == 1 )
        {
            firstPart = areas.substring(0, areas.length - 1 )
            areas = "";
        }
        else if (index == 3)
        {
            secondPart = areas.substring(0, areas.length - 1)
        }
    })

    return `"${firstPart}" "${secondPart}"`
}
function addCardsToAppropriateCell()
{
    cards.forEach((card) => {
        addCardToGridCell(card)
    })
}

function createCards(){
    cardObjectDefinitions.forEach((cardItem)=>{
        createCard(cardItem)
    })
}



function createCard(cardItem){  //responsible to create card dynamically 
 
    // create div element that make up a card 
    const cardElem = createElement('div')
    const cardInnerElem = createElement('div')
    const cardFrontElem = createElement('div')
    const cardBackElem = createElement('div')

    // create front and back elements for a card 
    const cardFrontImg = createElement('img')
    const cardBackImg = createElement('img')

    // add class and id to card Elements
    addClassToElement(cardElem, 'card')
    addIdToElement(cardElem, cardItem.id) // comes from cardObjectDefinitions array mentioned above 

    // add class to inner card elements 
    addClassToElement(cardInnerElem, 'card-inner')

    // add class to front card element
    addClassToElement(cardFrontElem, 'card-front')

    // add class to back card element 
    addClassToElement(cardBackElem, 'card-back') 

    // add src attributes and appropriate value to img element - back of card 
    addSrcToImageElem(cardBackImg, cardBackImgPath)

    // add source attribute and appropriate value to img element - front of card 
    addSrcToImageElem(cardFrontImg, cardItem.imagePath)

    // assign class to back image elememts elements of back of card 
    addClassToElement(cardBackImg, 'card-img')

    // assign class to back image elememts elements of front of card 
    addClassToElement(cardFrontImg, 'card-img')

    // add front image element as child element to front card element
    addChildElement(cardFrontElem, cardFrontImg)

    // add back image element as child element to back card element
    addChildElement(cardBackElem, cardBackImg)

    // add front card elements as child element to inner card element 
    addChildElement(cardInnerElem, cardFrontElem)

    // add front card elements as child element to inner card element 
    addChildElement(cardInnerElem, cardBackElem)

    // add Inner card elements as child elements to card element
    addChildElement(cardElem, cardInnerElem)

    //Initialize card Position 
    // add card element as child element to appropriate grid cell 
    addCardToGridCell(cardElem)

    // Now lets call intialize card position method from create card method so each initial position of card established when the game is first loaded through relevant card element id  
    initializeCardPositions(cardElem) 

}

function initializeCardPositions(card)
{
    cardPositions.push(card.id)
}

// Now resuable function responsible for creating Html Element 
function createElement(elemType){
    return document.createElement(elemType)
} 
function addClassToElement(elem, className){
    elem.classList.add(className)
}
function addIdToElement(elem, id){
    elem.id = id
}
function addSrcToImageElem(imgElem, src){
    imgElem.src = src
}
function addChildElement(parentElem, childElem){
    parentElem.appendChild(childElem)
}
function addCardToGridCell(card){
    const cardPositionClassName = mapCardIdToGridCell(card)

    const cardPosElem = document.querySelector(cardPositionClassName)

    addChildElement(cardPosElem, card)
}
function mapCardIdToGridCell(card){ // method is used to add all card to grid cells 
    // we wnat to add this card as child element to 1st position of grid using if statement 
    if(card.id == 1){
        return '.card-pos-a' // add to 1st position of grid denoted by div element ie card-pos-a
    }
    if(card.id == 2){
        return '.card-pos-b'
    }
    if(card.id == 3){
        return '.card-pos-c'
    }
    if(card.id == 4){
        return '.card-pos-d'
    }
}