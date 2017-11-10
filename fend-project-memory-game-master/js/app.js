'use strict'
/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
$(function () {
    var steps = [];//存储上次点击的节点
    var className = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt',
        'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
    var stepNum = 0;//存储匹配多少次
    var setInter = '';
    var timeNum = 0;
    $('body').on('click', '.card:not(.match)', function () {
        var dom = $(this);
        openCard(dom);
        match(dom);
    });
    $('body').on('click', '.restart', function () {
        $('.layer').fadeOut();
        init();
    });
    //初始化，得到重新开始游戏功能
    var init = function () {
        timeNum=0;
        steps = [];
        stepNum = 0;
        $('.score-panel .moves').text(stepNum);
        $('.stars .fa').removeClass().addClass('fa fa-star');
        var domArray = $('.card .fa').removeClass().addClass('fa');
        var numArray = getRandom();
        var className2 = className.concat(className);
        $('.card').removeClass().addClass('card');
        for (let i = 0, j = domArray.length; i < j; i++) {
            let x = numArray[i];
            domArray.eq(x).addClass(className2[i]);
        }
        setInter=setInterval(function () {
            $('.time').text(timeNum);
            timeNum++;
        },1000)
    };
    var getRandom = function () {
        var N = 16;
        var arr = [];
        var ranArr = [];
        for (let i = 0; i < N; i++) {
            arr[i] = i;
        }
        do {
            var index = Math.floor(Math.random() * arr.length);
            var flag = true;
            ranArr.push(arr[index]);
            arr.splice(index, 1);
            if (arr.length == 0) {
                flag = false;
            }
        } while (flag);
        return ranArr;
    };
    var match = function (dom) {
        steps.push(dom);
        var length = steps.length;
        if (length > 1) {
            var beforDom = $(steps[0]);
            if (beforDom.is(dom)) {
                console.log(steps.length, 1)
                steps.pop();
            } else {
                console.log(steps.length, 2)
                getStart();
                if (getCardStyle(dom.children('.fa')) == getCardStyle(beforDom.children('.fa'))) {
                    steps = [];
                    setTimeout(function () {
                        matchSuccess(beforDom);
                        matchSuccess(dom);
                        gameSuccess();
                    }, 300);
                } else {
                    steps = [];
                    setTimeout(function () {
                        matchFaile(beforDom);
                        matchFaile(dom);
                    }, 300);
                }
            }
        }
    };
    var gameSuccess = function () {
        var doms = $('.card');
        for (let i = 0, j = doms.length; i < j; i++) {
            if (!doms.eq(i).hasClass('match')) {
                console.log('game false');
                return false;
            }
        }
        console.log('game success');
        setTimeout(function () {
            $('.layer').fadeIn();
            clearInterval(setInter);
        }, 1500);
        return true;
    }
    var matchSuccess = function (dom) {
        dom.addClass('rubberBand animated');
        dom.addClass('match');
        dom.removeClass('open show');
        dom.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            dom.removeClass('rubberBand animated');
        });
    };
    var matchFaile = function (dom) {
        dom.addClass('animated shake');
        dom.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            dom.removeClass('animated shake open show');
        });
    }
    //rubberBand
    var closeCard = function (dom) {
        console.log('cao');
        dom.addClass('flipInY animated');
        dom.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            dom.removeClass('flipInY animated');
            dom.removeClass('open show');
        });
    };
    var openCard = function (dom) {
        dom.addClass('open show flipInY animated');
        dom.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            dom.removeClass('flipInY animated');
        });
    };
    var getCardStyle = function (dom) {
        var nameArray = dom.prop("className").split(' ');
        return nameArray[1];
    };
    var getStart = function () {
        stepNum++;
        $('.score-panel .moves').text(stepNum);
        $('.layer .stepNum').text(stepNum);
        if (stepNum < 9) {
            $('.layer .starNum').text(3);
        } else if (stepNum < 14) {
            $('.stars .fa').eq(2).removeClass('fa-star').addClass('fa-star-o');
            $('.layer .starNum').text(2);
        } else {
            $('.stars .fa').eq(1).removeClass('fa-star').addClass('fa-star-o')
            $('.layer .starNum').text(3);
        }
    }
    getStart();
    init();
});