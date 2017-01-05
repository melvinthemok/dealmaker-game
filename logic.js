var game = {
  round: 1,
  noRounds: Math.ceil(Math.random() * 3) + 2,
  score: {
    player1: 0,
    player2: 0
  },
  isOver: function () {
    if (game.round > game.noRounds) {
      return true
    } else {
      return false
    }
  }
}

var quote1 = {
  quotes: {
    'Knowledge is power.': 'Francis Bacon',
    'An investment in knowledge pays the best interest.': 'Benjamin Franklin',
    'Knowledge will give you power, but character, respect.': 'Bruce Lee',
    'Real knowledge is to know the extent of one\'s ignorance.': 'Confucius',
    'Risk comes from not knowing what you are doing.': 'Warren Buffett',
    'Knowledge speaks, but wisdom listens.': 'Jimi Hendrix'
  },
  quotePicker: function () {
    var result
    var count = 0
    for (var i in quote1.quotes) {
      if (Math.random() < 1 / ++count) {
        result = i
      }
    }
    return result
  }
}

var quote2 = {
  quotes: {
    'The buyer is entitled to a bargain. The seller is entitled to a profit. So there is a fine margin in between where the price is right.': 'Conrad Hilton',
    'There is no victory at bargain basement prices.': 'Dwight D. Eisenhower',
    'Let us never negotiate out of fear. But let us never fear to negotiate.': 'John F. Kennedy',
    'Negotiation means getting the best of your opponent.': 'Marvin Gaye',
    'When the final result is expected to be a compromise, it is often prudent to start from an extreme position.': 'John Maynard Keynes'
  },
  quotePicker: function () {
    var result
    var count = 0
    for (var i in quote2.quotes) {
      if (Math.random() < 1 / ++count) {
        result = i
      }
    }
    return result
  }
}

function Secret (cat, effect, change, desc) {
  this.cat = cat
  this.effect = effect
  this.change = change
  this.desc = desc
}

var revPos = new Secret('cash', true, Math.random() < 0.5 ? 5 : 10, 'Revenue for the latest quarter exceeded expectations.')
var profPos = new Secret('cash', true, Math.random() < 0.5 ? 5 : 10, 'The latest quarter\'s profits exceeded expectations.')
var revNeg = new Secret('cash', false, Math.random() < 0.5 ? 5 : 10, 'Revenue for the latest quarter fell below expectations.')
var profNeg = new Secret('cash', false, Math.random() < 0.5 ? 5 : 10, 'The latest quarter\'s profits fell below expectations.')
var techPos = new Secret('tech', true, Math.random() < 0.5 ? 5 : 15, 'The Target is on the verge of a major technological breakthrough.')
var techNeg = new Secret('tech', false, Math.random() < 0.5 ? 5 : 15, 'The Target just discovered a leak of its trade secrets to a fierce competitor.')
var retainPos = new Secret('staff', true, Math.random() < 0.5 ? 5 : 10, 'All key employees have agreed to stay if the Target is acquired.')
var ipPos = new Secret('staff', true, Math.random() < 0.5 ? 5 : 10, 'The intellectual property in all employees\' works was assigned to the Target.')
var retainNeg = new Secret('staff', false, Math.random() < 0.5 ? 5 : 10, 'Many key employees will leave if the Target is acquired.')
var ipNeg = new Secret('staff', false, Math.random() < 0.5 ? 5 : 10, 'A number of employees still own intellectual property vital to the Target\'s business.')
var suitPos = new Secret('legal', true, Math.random() < 0.5 ? 10 : 15, 'A costly lawsuit against the Target will finally be settled.')
var regPos = new Secret('legal', true, Math.random() < 0.5 ? 5 : 10, 'Satisfied with the Target\'s cooperation, the regulator will drop its investigations in the Target.')
var hackPos = new Secret('legal', true, Math.random() < 0.5 ? 5 : 10, 'Rumours that the Target was hacked are unfounded.')
var suitNeg = new Secret('legal', false, Math.random() < 0.5 ? 10 : 15, 'The Target will be sued for infringing the intellectual property of a powerful conglomerate.')
var regNeg = new Secret('legal', false, Math.random() < 0.5 ? 5 : 10, 'The regulator is expected to levy a heavy fine on the Target for data breaches.')
var hackNeg = new Secret('legal', false, Math.random() < 0.5 ? 5 : 10, 'The Target has just been hacked, with all its customers\'s passwords compromised.')
var bidPos = new Secret('bid', true, Math.random() < 0.5 ? 5 : 20, 'There are multiple competitive bids for the Target.')
var bidNeg = new Secret('bid', false, Math.random() < 0.5 ? 5 : 20, 'Despite rumours, there are no other bidders for the Target.')

var info = {
  allSecrets: [revPos, profPos, revNeg, profNeg, techPos, techNeg, retainPos, ipPos, retainNeg, ipNeg, suitPos, regPos, hackPos, suitNeg, regNeg, hackNeg, bidPos, bidNeg],
  selectSecrets: [],
  targetSecret: undefined,
  targetSecretButtonIndex: undefined,
  randoSec: function () {
    var x, y, z
    for (z = info.allSecrets.length; z; z--) {
      x = Math.floor(Math.random() * z)
      y = info.allSecrets[z - 1]
      info.allSecrets[z - 1] = info.allSecrets[x]
      info.allSecrets[x] = y
    }
    // var chosen
    // for (var i = 0; i < 5; i++) {
    //   chosen = info.allSecrets[Math.floor(Math.random() * info.allSecrets.length)]
    //   info.selectSecrets.push(chosen)
    //   info.allSecrets.splice(info.allSecrets.indexOf(chosen), 1)
    // }
    info.selectSecrets.push(info.allSecrets[0])
    info.selectSecrets.push(info.allSecrets[1])
    info.selectSecrets.push(info.allSecrets[2])
    info.selectSecrets.push(info.allSecrets[3])
    info.selectSecrets.push(info.allSecrets[4])
  },
  actVal: 100,
  estVal: 100,
  calcActVal: function () {
    info.selectSecrets.forEach(function (element) {
      if (element.effect === true) {
        info.actVal += element.change
      } else if (element.effect === false) {
        info.actVal -= element.change
      }
    })
    return info.actVal
  },
  calcEstVal: function () {
    if (info.targetSecret.effect === true) {
      info.estVal += info.targetSecret.change
    } else if (info.targetSecret.effect === false) {
      info.estVal -= info.targetSecret.change
    }
    return info.estVal
  },
  intervalID: undefined,
  seconds: 16,
  player: 1,
  noRequests: undefined,
  noDeclines: undefined,
  actionReducer: function () {
    if (info.seconds === 0 && info.player === 1 && info.noRequests > 0) {
      info.noRequests -= 1
      $('#noRequests').html(info.noRequests)
    } else if (info.seconds === 0 && info.player === 2 && info.noDeclines > 0) {
      info.noDeclines -= 1
      $('#noDeclines').html(info.noDeclines)
    }
  },
  isTimeForDeal: function () {
    if (info.noRequests === 0 && info.player === 1) {
      clearInterval(info.intervalID)
      return true
    }
    else {
      return false
    }
  },
  disclose: function () {
    if (info.isTimeForDeal() === false) {
      clearInterval(info.intervalID)
      $('#secrets').hide()
      $('#secrets').off('click')
      $('.addChoices').hide()
      $('.board h1').text('Target discloses that...')
      info.targetSecret = info.selectSecrets[info.targetSecretButtonIndex]
      $('.reveal').html(info.targetSecret.desc)
      info.calcEstVal()
      if (info.targetSecret.effect === true) {
        $('#estVal').html('Estimated Target value = <span style="color:#6eed0c">$' + info.estVal + ' million</span>')
      } else if (info.targetSecret.effect === false) {
        $('#estVal').html('Estimated Target value = <span style="color:#ff4842">$' + info.estVal + ' million</span>')
      }
      $('#yesAnnounce').show()
      $('#secrets button').eq(info.targetSecretButtonIndex).hide()
      info.targetSecretButtonIndex = undefined
    }
  },
  updateTime: function () {
    clearInterval(info.intervalID)
    info.intervalID = setInterval(info.updateTime, 1000)
    info.seconds -= 1
    if (info.seconds < 0) {
      info.seconds = 16
    }
    if (info.seconds >= 10) {
      $('#infoTimer').html('0:' + info.seconds)
    } else {
      $('#infoTimer').html('0:0' + info.seconds)
    }
    info.actionReducer()
    info.isTimeForDeal()
    if (info.isTimeForDeal() === true) {
      $('#info').hide()
      var key2 = quote2.quotePicker()
      $('#messageMid h1').html(key2)
      $('#messageMid h5').html(quote2.quotes[key2])
      $('#messageMid').show()
      $('body').css('background', 'url(img/pre-bargain.jpg) no-repeat center center fixed')
      $('body').css('background-size', 'cover')
    }
    if (info.seconds === 0 && info.noDeclines === 0 && info.targetSecretButtonIndex !== undefined && info.player === 2) {
      info.disclose()
    }
  },
  snideMsgs: {
    'Investor is surprised by Target\'s reticence.': 2,
    'Investor finds Target\'s diffidence curious.': 2,
    'Investor\'s eyebrows are raised.': 2,
    'Investor is starting to feel like this is a waste of time.': 2,
    'Investor scratches head and lets out a thoughtful whistle.': 2,
    'Investor is mildly peeved by Target\'s many secrets.': 1,
    'Investor wonders what Target has to hide.': 1,
    'Investor can\'t imagine what Target is concealing.': 1,
    'Investor is confused by Target\'s guarded posture.': 1,
    'Investor is visibly annoyed.': 1,
    'Investor loses patience at Target\'s stonewalling tactics.': 0,
    'Investor can\'t understand Target\'s lack of goodwill.': 0,
    'Investor is offended by Target\'s lack of candour.': 0,
    'Investor regrets having agreed to this meeting at all.': 0,
    'Investor lets fly a string of curses.': 0
  },
  snideMsgPicker: function () {
    var result
    var count = 0
    for (var i in info.snideMsgs) {
      if (info.snideMsgs[i] === info.noDeclines && Math.random() < 1 / ++count) {
        result = i
      }
    }
    return result
  }
}

var bargain = {
  intervalID: undefined,
  seconds: 16,
  player: 1,
  noOffers: 3,
  offer: 0,
  actionReducer: function () {
    if (bargain.seconds === 0 && bargain.player === 1 && bargain.noOffers > 0) {
      bargain.noOffers -= 1
      $('#noOffers').html(bargain.noOffers)
    }
  },
  isRoundOver: function () {
    if (bargain.noOffers === 0 && bargain.player === 1) {
      $('#messageEnd h2').html('Investor loses this round.<br><br>Wasted a lot of time, Investor.<br>')
      $('#offer').off('click')
      game.score.player1 -= 1
      game.round += 1
      clearInterval(bargain.intervalID)
      return true
    } else if (bargain.seconds === 0 && bargain.player === 2) {
      $('#messageEnd h2').html('Target loses this round.<br><br>Wasted a lot of time, Target.<br>')
      $('#offer').off('click')
      game.score.player2 -= 1
      game.round += 1
      clearInterval(bargain.intervalID)
      return true
    } else {
      return false
    }
  },
  updateTime: function () {
    clearInterval(bargain.intervalID)
    bargain.intervalID = setInterval(bargain.updateTime, 1000)
    bargain.seconds -= 1
    if (bargain.seconds < 0) {
      bargain.seconds = 16
    }
    if (bargain.seconds >= 10) {
      $('#bargainTimer').html('0:' + bargain.seconds)
    } else {
      $('#bargainTimer').html('0:0' + bargain.seconds)
    }
    bargain.actionReducer()
    bargain.isRoundOver()
    if (bargain.isRoundOver() === true) {
      $('#bargain').hide()
      $('#messageEnd').show()
      $('body').css('background', 'url(img/game-over.jpg) no-repeat center center fixed')
      $('body').css('background-size', 'cover')
    }
  },
  snideMsgs: {
    'Target scoffs at Investor\'s derisory offer.': [140, 80],
    'Target bursts out laughing.': [140, 80],
    'Target regrets having agreed to this meeting at all.': [140, 80],
    'Target\'s patience is wearing thin.': [80, 20],
    'Target wonders if Investor is deliberately stalling.': [80, 20],
    'Target\'s is growing tired of Investor\'s games.': [80, 20],
    'The offer is within Target\'s ballpark, but not quite there yet.': [20, -20],
    'Target needs just a little more to seal the deal.': [20, -20],
    'Target invites Investor to make a slightly better offer.': [20, -20],
    'Target requires a bigger show of commitment from Investor.': [-20, -140],
    'Target believes Investor\'s offer is too low.': [-20, -140],
    'Target hopes to receive a better offer from Investor.': [-20, -140]
  },
  snideMsgPicker: function () {
    var result
    var count = 0
    for (var i in bargain.snideMsgs) {
      if (info.actVal - bargain.offer < bargain.snideMsgs[i][0] && info.actVal - bargain.offer >= bargain.snideMsgs[i][1] && Math.random() < 1 / ++count) {
        result = i
      }
    }
    return result
  }
}
