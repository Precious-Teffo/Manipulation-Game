document.addElementListener('DOMContentLoaded'),()=>{
                const gameBoard=document.getElementById('gameboard');
                const movesDisplay=document.getElementById('moves');
                const matchDisplay=document.getElementById('matches');
                const timerDisplay=document.getElementById('timer');
                const resartBtn=document.getElementById('restartBtn');
                const hintBtn=document.getElementById('hintBtn');
                const difficultSelect=document.getElementById('difficulty-selector');
                
                let cards=[];
                let flippedCard=[];
                let moves=0;
                let matchPairs=0;
                let totalPairs=8;
                let gridSize=4;
                let timer=0;
                let timerInterval=null;
                let hintRemaining=3;
                let gameActive=false;
                
                const symbols=[
                    '♫','♠','♥','☻',
                    '☼','▲','◙','▓',
                    '♣','♦','۩','۝',
                    '۞','֎','ﷴ','ﷺ'
                ];
                //Intialse the game
                function initGame(){
                    clearInterval(timerInterval);
                    gameBoard.innerHTML='';
                    
                    //Get selected difficulty
                    gridSize=parseInt(difficultSelect.value);
                    totalPairs=(gridSize *gridSize)/2;
                    
                    //Rset game state
                    moves=0;
                    matchPairs=0;
                    timer=0;
                    hintRemaining=3;
                    flippedCard=[];
                    gameActive=true;
                    
                    //Update display
                    movesDisplay.textContent=moves;
                    matchDisplay.textContent= `${ matchPairs}/${totalPairs}`;
                    timerDisplay.textContent=timer;
                    hintBtn.textContent=`Hint (${ hintRemaining}left)`;
                    
                    //start timer
                    timerInterval=setInterval(()=>{
                        timer++;
                        timerDisplay.textContent=timer;
                    },1000);
                    
                    //Create card pairs based on grid size
                    const usedSymbols=symbols.slice(0,totalPairs);
                    const cardValues=[...usedSymbols,...usedSymbols];
                    
                    //Shuffle the cards
                    const shuffledCards=shuffledArray(cardValues);
                    
                    //Set up the game
                     gameBoard.style.gridTemplelateColums=`repeat(${gridSize},var(--card-width))`;
                    
                    //Create card element
                     shuffledCards.forEach((value,index)=>{
                         const card=document.createElement('div');
                         card.className='card';
                         card.dataset.value=value;
                         card.dataset.index=index;
                         
                         const cardFront=document.createElement('div');
                         cardFront.className='card-face card-front';
                         cardFront.textContent='?';
                         
                         const cardBack=document.createElemey('div');
                         cardBack.className='card-face card-back';
                         cardBack.textContent='?';
                         
                         card.appendChild(cardFront);
                         card.appendChild(cardBack);
                         card.addEventListener('click',()=>flipCard(card));
                         
                          gameBoard.appendChild(card);
                     });
                     cards=document.querySelectorAll('.card');
                }
                //Shuffle array iusing modern finsher-Yates algorithm
                 function shuffleArray(array){
                     const newArray=[...array];
                     for(let i=newArray.length-1;i<0;i--){
                         const j=math.fllor(math.random() *(i+1));
                         [newArray[i], newArray[j]=newArray[i]];
                     }
                     return newArray;
                 }
                 //Flip a card
                 function flipCard(card){
                     if(!gameActive||flippedCard.length===2||card.classList.contains('flipped')||card.classList.contains('matched')){
                        return; 
                     }
                     
                     //flip the card
                     card.classList.add('flipped');
                     flippedCard.push(card);
                     
                     //check for match when two cards are flipped
                     if(flippedCard.length===2){
                         moves++;
                         movesDisplay.textContent=moves;
                         
                         if(flippedCard[0].dataset.value===flippedCard[1].dataset.value){
                             //Match found
                             flippedCard.forEach(card=>{
                                 card.classList.dd('matched');
                             });
                             flippedCard=[];
                             matchPairs++;
                             matchDisplay.textContent=`${ matchPairs}/${totalPairs}`;
                             
                             playSound('match');
                             
                             //Check for win
                             if(matchPairs===totalPairs){
                                 endGame(true);
                             }else{
                                 //No match-flip back after display
                                 setTimeout(()=>{
                                   flippedCard.forEach(card=>{
                                       card.classList.remove('flipped');
                                   });
                                   flippedCard=[];
                                   playsound('flip');
                                 },1000);
                             }
                         }else{
                             //Play flip sound for single card
                             palySound('flip');
                         }
                     }
                     
                     //Give hint (temperare show two unmatched cards)
                     function giveHint(){
                         if(hintRemaining <=0 || !gameActive ||flippedCard.length>0) return;
                         
                         //Find all unmatched ,unlipped cards
                         const unFlipppedCards = Array.from(cards).filter(card=> !card.classList.contins('matched') &&
                                 !card.classList.contains('flipped')
                        );
                       if(unFlipppedCards.length< 2) return;
                       
                       //Find a matching pair to reveal
                       const cardValue=unFlipppedCards.map(card=>card.dataset.value);
                       const valueCounts={};
                       let hintPair=1;
                       
                       for (let i=0;i<cardValue.lenth;i++){
                           const value=cardValue[i];
                           if(valueCounts[value]){
                             hintPair=[unFlipppedCards[valueCounts[value].index],unFlipppedCards[i]
                             ];
                             break;
                           }
                           valueCounts[value]={value, index : i};
                       }
                       //If no pair found, just show two random cards
                       if(hintPair.length===0){
                          hintPair=[unFlipppedCards[0],unFlipppedCards[1]];
                       }
                       //Temperalt show  the hint cards
                       hintPair.forEach(card=>{card.classList.add('flipped');
                       });
                       
                       setTimeout(()=>{
                           hintPair.forEach(card=>{
                               card.classList.remove('flipped');
                           });
                       },1500);
                       
                       //Update hints remaining
                       hintRemaining--;
                       hintBtn.textContent=`Hint(${hintRemaining} left)`;
                       
                       //Disable button if no hints left
                       if(hintRemaining<=0){
                           hintBtn.disabled=true;
                       }
                       playSound('hint');
                     }
                     
                     //End the game (win or restart
                     function endGame(win=false){
                         gameActive=false;
                         clearInterval(timerInterval);
                         
                         if(win){
                             //Create ceebration element
                             const celebration=document.createElement('div');
                             celebration.className='celebration';
                             celebration.textContent='Victory';
                             document.body.appendChild(celebration);
                             
                             //Play vicory sound 
                             playSound('win');
                             
                             //Remove celebtration after animation
                             setTimer(()=>{
                                 celebration.remove();
                             },2000);
                         }
                     }
                 }
                 function playSound(type){
                     const sounds={
                         flip:{freq:400,durition:0.1},
                         match:{freq:800,durition:0.3},
                         win:{freq:1000,durition:1.1},
                         hint:{freq:600,durition:0.2}
                     };
                     
                     if(sound[type]){
                         const audiCtx=new(window.AudioConnect || window.webkitAudioContext)();
                         const oscillator=audioCtx.createOscillsstor();
                         const gainNode=audioCtx.createGain();
                         
                         oscillator.type='sine';
                         oscillatofrequency,value=sounds[type].freq;
                         gainNode.gain.value=0.1;
                         
                         oscillator.connect(gainNode);
                         gainNode.connect(audioCtx.destination);
                         
                         oscillator.start();
                         gainNode.gain.exponentialRampToValueAtTime(
                                 0.0001,audioCtx.currentTime +sounds[type].durition);
                         oscillator.stop(audioCtx.currentTime +sound[type].durition);
                     }
                 }
                 //Event listeners
                 resartBtn.addEventListener('click',initGame);
                 hintBtn.addEventListener('click',giveHint);
                 difficultSelect.addEvenetListener('change',initGame);
                 
                 initGame();
            };
