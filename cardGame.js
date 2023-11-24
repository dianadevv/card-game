document.addEventListener('DOMContentLoaded', () =>{
    // открываем\закрываем popup
    let popup = document.querySelector('.popup');
    let crossPopup = document.querySelector('.popup__close');
    let buttonPopup = document.querySelector('.popup__button');
    let headerSettings = document.querySelector('.header__settings');

    function popupClose(){
        popup.classList.remove('open');
        popup.classList.add('close');
        document.querySelector('.container').classList.add('open')
        startGame = 0;
    }
    function popupOpen(){
        popup.classList.remove('close')
        popup.classList.add("open");
        // закрываем все остальное
        document.querySelector('.container').classList.add('close')
    }
    crossPopup.addEventListener('click', popupClose);
    buttonPopup.addEventListener('click', popupClose);
    headerSettings.addEventListener('click', () => {
        popupOpen();
        clearTimeout(timeoutTimer);
        clearTimeout(stopTimer);
    });
    
    // таймер игры
    let timeoutTimer;
    // переменная для остановки таймера
    let stopTimer;
    // переменная для считывания начала игры
    let startGame;
   
    // выбор кол-ва карт по горизонтали и вертикали
    // настройки выбора в попапе
    function settingsPopup(){
        let countofCardVertical;
        let countofCardHorisontal;

        const cardsVertical = document.querySelectorAll('.popup__vertical');
        const cardsHorisontal = document.querySelectorAll('.popup__horizontal');

        function assignEvent(massivCountofCards, selectCountofCard){
            for (const countCard of massivCountofCards){
                countCard.addEventListener('click', function(){
                    if (selectCountofCard === undefined){
                        selectCountofCard = countCard;
                        selectCountofCard.classList.add('select');
                    }
                    selectCountofCard.classList.remove('select');
                    selectCountofCard = countCard;
                    selectCountofCard.classList.add('select');
                })
            }
        }
        assignEvent(cardsVertical, countofCardVertical);
        assignEvent(cardsHorisontal, countofCardHorisontal);
    }
    settingsPopup()

    // функция удаления дочерних елементов
    function removeChild(parent){
        while (parent.firstElementChild){
            parent.removeChild(parent.firstElementChild);
        }
    }

    // заграузка и механика игры

    buttonPopup.addEventListener('click', () =>{
        // очищаю все элементы предыдущей игры
        removeChild(document.querySelector('.container'));
        // снимаю невидимость
        document.querySelector('.container').classList.remove('close');
        // разрешвем попапу закрываться по крестику
        document.querySelector('.popup__close').classList.add('pointer');

        // назначаем время игры
        let timer = document.querySelector('.header__timer');
        // если значение времени игры отрицательно или 0
        if ( document.querySelector('.input').value > 0){
            timer.textContent = document.querySelector('.input').value;
        } else {
            timer.textContent = 120;
        }

        // забираем итоговые значения кол-ва карт по горизонтали и вертикали
        let numberHorisontal;
        let numberVertical;
        let playTime = document.querySelector('.input').value;
        startGame = 0;                                   

        // учитываем условие, когда значения не выбраны
        if (document.querySelector('.popup__horizontal.select') === null && document.querySelector('.popup__vertical.select') === null){
            numberVertical = 4;
            numberHorisontal = 4;
        } else if(document.querySelector('.popup__vertical.select') === null){
            numberVertical = 4;
            numberHorisontal = document.querySelector('.popup__horizontal.select').textContent;
        } else if(document.querySelector('.popup__horizontal.select') === null){
            numberHorisontal = 4;
            numberVertical = document.querySelector('.popup__vertical.select').textContent;

        } else{
            numberHorisontal = document.querySelector('.popup__horizontal.select').textContent;
            numberVertical = document.querySelector('.popup__vertical.select').textContent;
        }
        // создаем массив из чисел, которые будем присваивать карточкам
        let MassivofRandomCount = createMassivofRandomCount(numberHorisontal, numberVertical);

        // вводим внешнюю переменную для присваивания порядкового номера
        let count = 0;
        // создаем каркас игры (карты) и присваиваем картам значения
        for (let i = 1; i <= numberHorisontal; ++i){
            let horisontalLine = createHorisontalLineofCards();
            for (let i = 1; i <= numberVertical; ++i){
                let verticalLine = createCard();
                verticalLine.number.textContent = MassivofRandomCount[count];
                count++;
                horisontalLine.append(verticalLine.card);
            }
            document.querySelector('.container').append(horisontalLine);
        }

        // вытаскиваем все карты 
        const cards = document.querySelectorAll('.card');

        // вводим переменные 
        let numberClick = 0;
        let openCard1;
        let timeout;
        const WAIT_TIME_MS =  1500;
        // кол-во открытых карт
        let openCard = 0;
        

        // назначаем каждой карте значение и вешаем event
        for (const card of cards){
            // по клику на карточку открываем ее
            card.addEventListener('click', function(){
                numberClick++
                // first child
                card.firstElementChild.classList.toggle('rotateFront');
                card.lastElementChild.classList.toggle('rotateBack');

                // если это начало игры, то квлючем таймер
                ++startGame
                if (startGame === 1){
                    // оставшееся время игры
                    let remainingTime = timer.textContent * 1000;
                    timeoutTimer = setInterval(() => {--timer.textContent}, 1000);
                //    останавливает таймер через время игры
                    stopTimer = setTimeout(() => { 
                        clearInterval(timeoutTimer);
                        // нужно открыть попап с проигрышем игры
                        // все карты открыты
                        let timeout2;
                        // открываетсчя новое окно
                    
                        timeout2 = setTimeout(() => {
                            // открываем окно с проигрышем
                            document.querySelector('.popupLoseGame').classList.remove('close');
                            document.querySelector('.popupLoseGame').classList.add('open');
                            // закрываем все остальное
                            document.querySelector('.container').classList.add('close');
                        }, 1500);

                        // вешаю обработчик событий на кнопку "Начать новую игру"
                        document.querySelector('.popupLoseGame').addEventListener('click', function(){
                            // закрываем текущий попап
                            document.querySelector('.popupLoseGame').classList.remove('open');
                            document.querySelector('.popupLoseGame').classList.add('close');
                            // открываем стартовый попап
                            popup.classList.remove('close')
                            popup.classList.add("open");
                        });
                    }, remainingTime);
                }

                if (numberClick % 2 === 1){
                    // если единственная открытая карта, то открываем ее и запоминаем
                    openCard1 = card;
                    console.log('первый клик')
                } else if (card === openCard1){
                    // если 2 клик произведен на ту же самую карту, то просто закрываем ее
                } else if (openCard1.textContent === card.textContent){
                    card.classList.add('block');
                    openCard1.classList.add('block');
                    // счет открытых пар карт
                    ++openCard;
                } else if (openCard1.textContent !== card.textContent){
                    // отключаю отзывчивость
                    settingResponceOnClick(cards);
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        openCard1.firstElementChild.classList.toggle('rotateFront');
                        openCard1.lastElementChild.classList.toggle('rotateBack');
                        card.firstElementChild.classList.toggle('rotateFront');
                        card.lastElementChild.classList.toggle('rotateBack');
                        // возвращаю отзывчивость
                        settingResponceOnClick(cards);
                    }, WAIT_TIME_MS);
                };

                // проверка на то, открыты ли все карты 
                if (openCard * 2 === numberHorisontal * numberVertical){
                    // все карты открыты
                    let timeout1;
                    // открываетсчя новое окно
                    timeout1 = setTimeout(() => {
                        clearTimeout(timeoutTimer);
                        clearTimeout(stopTimer);
                    
                        // открываем окно с победителем игры
                        document.querySelector('.popupWinGame').classList.remove('close')
                        document.querySelector('.popupWinGame').classList.add('open');
                        // закрываем все остальное
                        document.querySelector('.container').classList.add('close');
                    }, 2000);

                    // вешаю обработчик событий на кнопку "Начать новую игру"
                    document.querySelector('.popupWinGame').addEventListener('click', function(){
                        // закрываем текущий попап
                        document.querySelector('.popupWinGame').classList.remove('open');
                        document.querySelector('.popupWinGame').classList.add('close');
                        // открываем стартовый попап
                        popup.classList.remove('close')
                        popup.classList.add("open");
                    })
                }
            })
        }
        


       



        

       

        
    
       

    })
    // проходится по всем элементам и блокируе или убирает блокировку у него event на клик
    function settingResponceOnClick(massiv){
        for (const elem of massiv){
            elem.classList.toggle('blockEventList');
        }
    }
    // создаем div горизонтальный, куда будем вкладывать каточки (горизонтальная линия карт)
    function createHorisontalLineofCards(){
        let wrap = document.createElement('div');
        wrap.classList.add('wrap');
        return wrap;
    }

    // создаем карточку
    function createCard(){
        let card = document.createElement('div');
        let frontofCard = document.createElement('div');
        let backofCard = document.createElement('div');
        let number = document.createElement('span');

        // назначаю стили
        card.classList.add('card');
        frontofCard.classList.add('front');
        backofCard.classList.add('back');

        // вкладываю
        backofCard.append(number);
        card.append(frontofCard);
        card.append(backofCard);
        return{
            card,
            frontofCard,
            backofCard,
            number
        }
    }

    // создаю перемешанный массив из чисел
    function createMassivofRandomCount(number1, number2){
        const amountofNumbers = number1*number2/2;
        let MassivofCount = Array.from({length: amountofNumbers}, (_, i) => i + 1);
        let massiv = MassivofCount.flatMap(i => [i,i]);
        let shuffle = function (arr){
            for (let i = arr.length - 1; i > 0; i--){
                let tmp = arr[i];
                let rnd = Math.floor(Math.random()*(i+1));
                arr[i] = arr[rnd];
                arr[rnd] = tmp;
            }
            return arr;
        }
        let MassivofRandomCount = shuffle(massiv);
        return MassivofRandomCount;
    }
})






// (function() {

    

//     let numberClick = 0;
//     let openCard1;

//     // вытаскиваю все кнопки
//     let buttons = document.querySelectorAll('.button');

//     // прохожусь по кнопкам и навешиваю им event(ы)
//     const putEventListener = () => {
//     for (const button of buttons){
//         button.addEventListener('click', function(){
//             ++numberClick;
//             console.log(numberClick);
//         });
//         button.addEventListener('click', function(){
//             if (numberClick % 2 === 1){
//                 console.log('нечетное');
//                 // записываю данныую кнопку в новую переменную
//                 openCard1 = button;
//                 console.log(openCard1);
//                 button.classList.toggle('list-group-item-success');
//             } else if (button.textContent === openCard1.textContent){
//                 button.classList.toggle('list-group-item-success');
//             } else if (button.textContent !== openCard1.textContent){
//                 button.classList.remove('list-group-item-success');
//                 openCard1.classList.remove('list-group-item-success');
//             }
//         });

//     }
//     }
//     putEventListener()

// })();










    
    // понять почему не работает

    // let countofCardVertical;
    // let countHorisontal;
    // let countVertical;
    // let countofCardHorisontal;

    // const cardsVertical = document.querySelectorAll('.popup__vertical');
    // const cardsHorisontal = document.querySelectorAll('.popup__horizontal');

    // function assignEvent(massivCountofCards, selectCountofCard){
    //     for ( const countCard of massivCountofCards){
    //         countCard.addEventListener('click', function(){
    //             if (selectCountofCard === undefined){
    //                 selectCountofCard = countCard;
    //                 selectCountofCard.classList.add('select');
    //             }
    //             selectCountofCard.classList.remove('select');
    //             selectCountofCard = countCard;
    //             selectCountofCard.classList.add('select');
    //         })
    //     }
    // }

    // assignEvent(cardsVertical, countofCardVertical);
    // assignEvent(cardsHorisontal, countofCardHorisontal);

    // // buttonPopup.addEventListener('click', createMassivofRandomCount(countofCardVertical.textContent, countofCardHorisontal.textContent));
    // buttonPopup.addEventListener('click', pip);
    // function pip(){
    //     console.log(countofCardVertical.textContent);
    //     console.log(countofCardHorisontal.textContent);
    // }

    // // перемешанный массив из чисел
    // function createMassivofRandomCount(numberVertical, numberHorisontal){
    //     console.log(numberVertical);
    //     console.log(numberHorisontal);
    //     // проверка наличия значений
    //     // let numberVertical;
    //     // let numberHorisontal;

    //     if (numberVertical === undefined && numberHorisontal === undefined){
    //         numberVertical = 4;
    //         numberHorisontal = 4;
    //     } else if(numberVertical === undefined){
    //         numberVertical = 4;
    //     } else if(numberHorisontal === undefined){
    //         numberHorisontal = 4;
    //     }
    //     // else {
    //     //     numberVertical = countofCardVertical.textContent;
    //     //     numberHorisontal = countofCardHorisontal.textContent;
    //     // }
    //     console.log(numberVertical);
    //     console.log(numberHorisontal);

    // }















