// JavaScript file intended to contain DOM manipulation code, referenced later in HTML file

$(function () {

  // Function to reset variables and DOM and to call functions at the start of each round

  function initialize () {

    info.allSecrets = [revPos, profPos, revNeg, profNeg, techPos, techNeg, retainPos, ipPos, retainNeg, ipNeg, suitPos, regPos, hackPos, suitNeg, regNeg, hackNeg, bidPos, bidNeg]
    info.selectSecrets = []
    info.targetSecret = undefined
    info.targetSecretButtonIndex = undefined
    info.actVal = 100
    info.estVal = 100
    info.intervalID = undefined
    info.seconds = 16
    info.player = 1
    info.noRequests = 6
    info.noDeclines = 3

    info.randoSec()
    info.calcActVal()

    // Update score

    $('.investorScore').html(game.score.player1)
    $('.targetScore').html(game.score.player2)

    // DOM manipulation and CSS update for main gameplay area

    $('.btw h2').css('color', '#ffa00d')
    $('.btw').removeClass('col-md-offset-8')
    $('.board h1').text('Choose something, Investor')
    $('#secrets').show()
    $('#secretInstruct').css('margin-top', '250px')
    $('#secrets button').show()

    // Reset numbers of requests, rejections and Estimated Value displayed in DOM

    $('#noRequests').html(info.noRequests)
    $('#noDeclines').html(info.noDeclines)
    $('#estVal').html('Estimated Target value = $' + info.estVal + ' million')

    // Reset background image

    $('body').css('background', 'url(img/cover.jpg) no-repeat center center fixed')
    $('body').css('background-size', 'cover')

    // Update of buttons linked to the reset secret data points

    for (var i = 0; i < info.selectSecrets.length; i++) {
      $('#secrets button').eq(i).text(info.selectSecrets[i].cat)
      $('#buttonCol button').eq(i).text(info.selectSecrets[i].cat)
      if (info.selectSecrets[i].effect === true) {
        $('#secrets button').eq(i).addClass('btn-success')
        $('#buttonCol button').eq(i).addClass('btn-success')
        $('#buttonDesc h3').eq(i).html('Increase by <span style="color:#6eed0c">$' + info.selectSecrets[i].change + ' million</span>')
      } else if (info.selectSecrets[i].effect === false) {
        $('#secrets button').eq(i).addClass('btn-danger')
        $('#buttonCol button').eq(i).addClass('btn-danger')
        $('#buttonDesc h3').eq(i).html('Reduce by <span style="color:#ff4842">$' + info.selectSecrets[i].change + ' million</span>')
      }
    }

    // Function to be attached to secret data point button click handler

    function setUpBoardButtons () {
      if (info.isTimeForDeal() === false && info.noRequests > 0) {

        // Player turn change

        info.player = 2

        // Finding button index for selected button

        info.targetSecretButtonIndex = $(this).index()

        // Turning off button click handler

        $('#secrets button').off('click')

        // Reduce number of requests remaining

        info.noRequests -= 1
        $('#noRequests').html(info.noRequests)

        // Display Target choices to disclose or reject secret data point request

        $('.addChoices').show()

        // Timer reset for Target turn next

        info.seconds = 16
        clearInterval(info.intervalID)
        info.updateTime()
        $('.btw').addClass('col-md-offset-8')
        $('.btw h2').css('color', '#0ddeff')

        // If no more rejections remaining, hide the disclose button

        if (info.noDeclines === 0) {
          $('#no').hide()
        }
      }
    }

    // Walk away click handler

    $('.go').on('click', function () {

      // Turning off click handlers, resetting CSS and clearing interval

      clearInterval(bargain.intervalID)
      $('#info').hide()
      $('#bargain').hide()
      $('#secrets button').off('click')
      $('#secrets button').removeClass('btn-success')
      $('#buttonCol button').removeClass('btn-success')
      $('#secrets button').removeClass('btn-danger')
      $('#buttonCol button').removeClass('btn-danger')
      $('#yes').off('click')
      $('#no').off('click')
      $('#yesContinue').off('click')
      $('#noContinue').off('click')
      $('#messageMid').hide()
      $('#offer').off('click')

      // Update game score and round counter

      game.score.player1 -= 3
      game.score.player2 -= 3
      game.round += 1

      // Display message at end of round

      if ($(this).closest('.target').length > 0) {
        $('#messageEnd h2').html('Both players lose this round after Target walked away.<br><br>')
      } else if ($(this).closest('.investor').length > 0) {
        $('#messageEnd h2').html('Both players lose this round after Investor walked away.<br><br>')
      }
      $('#messageEnd').show()
      $('body').css('background', 'url(img/game-over.jpg) no-repeat center center fixed')
      $('body').css('background-size', 'cover')
    })

    // Set up secret data point button click handler

    $('#secrets button').on('click', setUpBoardButtons)

    // Disclose button click handler

    $('#yes').on('click', info.disclose)

    // Function to be attached to reject button click handler

    function setUpRejectButton () {
      if (info.isTimeForDeal() === false && info.noDeclines > 0) {
        $('#no').off('click')
        clearInterval(info.intervalID)
        info.noDeclines -= 1
        $('#noDeclines').html(info.noDeclines)
        $('.board h1').text('Target denies request')
        $('.stonewall').text(info.snideMsgPicker())
        $('#secrets').off('click')
        $('#secrets').hide()
        $('.addChoices').hide()
        $('#noAnnounce').show()
      }
    }

    // Set up reject button click handler

    $('#no').on('click', setUpRejectButton)

    // Continue button click handler after disclosure

    $('#yesContinue').on('click', function () {

      // Player turn change

      info.player = 1

      // DOM manipulation and CSS update for main gameplay area

      $('#yesAnnounce').hide()
      $('#secrets').show()
      $('#secrets button').on('click', setUpBoardButtons)
      $('.board h1').text('Choose something, Investor')
      $('.btw h2').css('color', '#ffa00d')
      $('.btw').removeClass('col-md-offset-8')

      // Timer reset for Investor turn next

      info.seconds = 16
      clearInterval(info.intervalID)
      info.updateTime()

      // If all secret data points disclosed, move on to second quote

      if (!$('#secrets button:visible').length) {
        clearInterval(info.intervalID)
        $('#info').hide()
        $('body').css('background', 'url(img/pre-bargain.jpg) no-repeat center center fixed')
        $('body').css('background-size', 'cover')
        var key2 = quote2.quotePicker()
        $('#messageMid h1').html(key2)
        $('#messageMid h5').html(quote2.quotes[key2])
        $('#messageMid').show()
      }
    })

    // Continue button click handler after rejection

    $('#noContinue').on('click', function () {

      // Player turn change

      info.player = 1

      // DOM manipulation and CSS update for main gameplay area

      $('#noAnnounce').hide()
      $('#secrets button').on('click', setUpBoardButtons)
      $('#secrets').show()
      $('#no').on('click', setUpRejectButton)
      $('.board h1').text('Choose something, Investor:')
      $('.btw').removeClass('col-md-offset-8')
      $('.btw h2').css('color', '#ffa00d')

      // Timer reset for Investor turn next

      info.seconds = 16
      clearInterval(info.intervalID)
      info.updateTime()
    })

    // Hide cover page

    $('#intro').hide()

    // Start from Target secret instructions in subsequent rounds

    $('#secretInstruct').show()
  }

  // Click handler for cover page play button

  $('#play').on('click', initialize)

  // DOM manipulation to and from main instructions page

  $('#instruct').on('click', function () {
    $('#intro').hide()
    $('#mainInstruct').show()
  })

  $('#back').on('click', function () {
    $('#mainInstruct').hide()
    $('#intro').show()
  })

  // DOM manipulation for display of Target secret instructions

  $('#showSecInstr').on('click', function () {
    console.log('Starting round ' + game.round + ' of ' + game.noRounds)
    $('#panel').hide()
    $('#secretInstructions').show()
    $('#secretInstruct').addClass('col-md-6 col-md-offset-3')
    $('#secretInstruct').css('margin-top', '50px')

    // Disclosure of Actual Value to Target

    if (info.actVal > 100) {
      $('#showActVal h2').html('Target\'s Actual Value is <span style="color:#6eed0c">$' + info.actVal + ' million</span>')
    } else if (info.actVal === 100) {
      $('#showActVal h2').html('Target\'s Actual Value is $' + info.actVal + ' million.')
    } else if (info.actVal < 100) {
      $('#showActVal h2').html('Target\'s Actual Value is <span style="color:#ff4842">$' + info.actVal + ' million</span>')
    }
    $('#showActVal').show()
  })

  // DOM manipulation from Target secret instructions to first quote

  $('#start').on('click', function () {
    $('#secretInstruct').hide()
    var key = quote1.quotePicker()
    $('#quote1 h1').html(key)
    $('#quote1 h5').html(quote1.quotes[key])
    $('#quote1').show()
  })

  // Proceed to secret data point request phase (phase 1)

  $('#proceed').on('click', function () {
    info.updateTime()
    $('#quote1').hide()
    $('#info').show()
  })

  $('#infoToBargain').on('click', function () {

    // Reset timers, player turn and offers

    clearInterval(info.intervalID)
    info.seconds = 0
    bargain.intervalID = undefined
    bargain.seconds = 16
    bargain.player = 1
    bargain.noOffers = 3
    bargain.offer = 0

    // DOM manipulation, timer start and turning off click handlers to avoid multiple calls in later rounds

    $('#secrets button').off('click')
    $('#secrets button').removeClass('btn-success')
    $('#buttonCol button').removeClass('btn-success')
    $('#secrets button').removeClass('btn-danger')
    $('#buttonCol button').removeClass('btn-danger')
    $('#yes').off('click')
    $('#no').off('click')
    $('#yesContinue').off('click')
    $('#noContinue').off('click')
    $('#messageMid').hide()
    $('.board h1').text('Make an offer, Investor')
    $('#offer').on('click', setUpOfferButton)
    $('#offer').show()
    $('#noOffers').html(bargain.noOffers)
    $('#bargain').show()
    bargain.updateTime()
    $('.btw').removeClass('col-md-offset-8')

    // Update Estimated Value

    if (info.estVal > 100) {
      $('#estValAgain').html('Estimated Target value = <span style="color:#6eed0c">$' + info.estVal + ' million</span>')
    } else if (info.estVal == 100) {
      $('#estValAgain').html('Estimated Target value = $' + info.estVal + ' million')
    } else if (info.estVal < 100) {
      $('#estValAgain').html('Estimated Target value = <span style="color:#ff4842">$' + info.estVal + ' million</span>')
    }
  })

  // Range slider DOM manipulation depending on input value

  $('#slider').on('change', function () {
    if ($('#slider').val() < 100) {
      $('#dollars').css('color', '#ff4842')
    } else if ($('#slider').val() == 100) {
      $('#dollars').css('color', '#ffffff')
    } else if ($('#slider').val() > 100) {
      $('#dollars').css('color', '#6eed0c')
    }
  })

  // Function to be attached to offer button click handler

  function setUpOfferButton () {

    // Player turn update

    bargain.player = 2

    // Taking offer value from range slider input value

    bargain.offer = $('#slider').val()

    // Turning off offer button click handler

    $('#offer').off('click')
    $('#offer').hide()

    // Update offer value

    if (bargain.offer > info.estVal) {
      $('.board h1').html('Investor offers <span style="color:#6eed0c">$' + bargain.offer + ' million</span>')
    } else if (bargain.offer == info.estVal) {
      $('.board h1').html('Investor offers $' + bargain.offer + ' million')
    } else if (bargain.offer < info.estVal) {
      $('.board h1').html('Investor offers <span style="color:#ff4842">$' + bargain.offer + ' million</span>')
    }

    // Update remaining number of offers

    bargain.noOffers -= 1
    $('#noOffers').html(bargain.noOffers)

    // Display Target choices

    $('.addChoices').show()

    // Update timer for Target turn next

    bargain.seconds = 16
    bargain.updateTime()
    $('.btw').addClass('col-md-offset-8')
    $('.btw h2').css('color', '#0ddeff')
  }

  // Offer acceptance button click handler

  $('#accept').on('click', function () {

    // Timer reset, turning off offer click handler and hiding main gameplay area

    clearInterval(bargain.intervalID)
    $('#offer').off('click')
    $('#bargain').hide()

    // Display end of round message and updating scores

    switch (true) {
      case (bargain.offer == info.actVal + 5):
        $('#messageEnd h2').html('Both players win this round.<br><br>Investor paid only <span style="color:#6eed0c">$5 million</span> over Target\'s Actual Value.<br><br>')
        game.score.player1 += 1
        game.score.player2 += 1
        game.round += 1
        break
      case (bargain.offer == info.actVal - 5):
        $('#messageEnd h2').html('Both players win this round.<br><br>Investor paid only <span style="color:#ff4842">$5 million</span> less than Target\'s Actual Value.<br><br>')
        game.score.player1 += 1
        game.score.player2 += 1
        game.round += 1
        break
      case (bargain.offer == info.actVal):
        $('#messageEnd h2').html('Both players win this round.<br><br>Investor paid exactly Target\'s Actual Value.<br><br>')
        game.score.player1 += 1
        game.score.player2 += 1
        game.round += 1
        break
      case (bargain.offer < info.actVal - 5):
        $('#messageEnd h2').html('Investor wins this round.<br><br>Investor paid <span style="color:#ff4842">$' + (info.actVal - bargain.offer) + ' million</span> less than Target\'s Actual Value.<br><br>')
        game.score.player1 += 1
        game.round += 1
        break
      case (bargain.offer > info.actVal + 5):
        $('#messageEnd h2').html('Target wins this round.<br><br>Investor paid <span style="color:#6eed0c">$' + (bargain.offer - info.actVal) + ' million</span> more than Target\'s Actual Value.<br><br>')
        game.score.player2 += 1
        game.round += 1
        break
    }
    $('#messageEnd').show()
    $('body').css('background', 'url(img/game-over.jpg) no-repeat center center fixed')
    $('body').css('background-size', 'cover')
  })

  // Offer rejection button click handler

  $('#reject').on('click', function () {

    // Player turn change

    bargain.player = 1

    if (bargain.isRoundOver() === false) {

      // If round is not over, show rejection message

      clearInterval(bargain.intervalID)
      $('.board h1').text('Target rejects Investor\'s offer')
      $('.stonewallAgain').text(bargain.snideMsgPicker())
      $('#haggle').hide()
      $('#offer').off('click')
      $('.addChoices').hide()
      $('#noAnnounceAgain').show()
    } else if (bargain.isRoundOver() === true) {

      // If round is over, display end of round message

      $('#bargain').hide()
      $('#messageEnd h2').html('Players failed to strike a deal.<br><br>')
      $('#messageEnd').show()
      $('body').css('background', 'url(img/game-over.jpg) no-repeat center center fixed')
      $('body').css('background-size', 'cover')
    }
  })

  // Reset main gameplay area for next offer to be made after Target rejection

  $('#noContinueAgain').on('click', function () {
    $('#noAnnounceAgain').hide()
    $('#haggle').show()
    $('#offer').on('click', setUpOfferButton)
    $('#offer').show()
    $('.board h1').text('Investor to make offer')
    bargain.seconds = 16
    bargain.updateTime()
    $('.btw').removeClass('col-md-offset-8')
    $('.btw h2').css('color', '#ffa00d')
  })

  // Next round restart button click handler

  $('#restart').on('click', function () {

    // Reset timers, variables, click handlers and CSS

    clearInterval(info.intervalID)
    clearInterval(bargain.intervalID)
    bargain.seconds = 0
    info.targetSecret = undefined
    info.targetSecretButtonIndex = undefined
    $('.go').off('click')
    $('#secrets button').off('click')
    $('#secrets button').removeClass('btn-success')
    $('#buttonCol button').removeClass('btn-success')
    $('#secrets button').removeClass('btn-danger')
    $('#buttonCol button').removeClass('btn-danger')
    $('#yes').off('click')
    $('#no').off('click')
    $('#yesContinue').off('click')
    $('#noContinue').off('click')
    $('#messageMid').hide()
    if (game.isOver() === false) {

      // Function called to reset state and DOM manipulation for start of next round

      initialize()
      clearInterval(info.intervalID)
      clearInterval(bargain.intervalID)
      $('#messageEnd').hide()
      $('#showActVal').hide()
      $('#secretInstructions').hide()
      $('#panel').show()
      $('#secretInstruct').show()
      $('.addChoices').hide()
    } else if (game.isOver() === true) {

      // If game is over, display final outcome

      if (game.score.player1 > game.score.player2 && game.score.player1 > 0) {
        $('#messageEnd h2').html('Nicely played! Investor wins with a score of <span style="color:#6eed0c">' + game.score.player1 + '</span> against Target\'s score of <span style="color:#ff4842">' + game.score.player2 + '</span>')
      } else if (game.score.player2 > game.score.player1 && game.score.player2 > 0) {
        $('#messageEnd h2').html('Well played! Target wins with a score of <span style="color:#6eed0c">' + game.score.player2 + '</span> against Investor\'s score of <span style="color:#ff4842">' + game.score.player1 + '</span>')
      } else if (game.score.player1 === game.score.player2 && game.score.player1 > 0) {
        $('#messageEnd h2').html('Both players are equally matched, with a score of <span style="color:#6eed0c">' + game.score.player1 + '</span>')
      } else if (game.score.player1 < 0 && game.score.player2 < 0) {
        $('#messageEnd h2').html('Abysmal. Both players lose with Investor scoring <span style="color:#ff4842">' + game.score.player1 + '</span> and Target scoring <span style="color:#ff4842">' + game.score.player2 + '</span>')
      }
      $('#messageEnd').css('margin-top', '240px')
      $('#messageEnd button').hide()
    }
  })
})
