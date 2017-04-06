var ideaArray = []

$(document).ready(function() {
    prependCard()
})

$('.save-button').on('click', function() {
    var $title = $('#title').val()
    var $body = $('#body').val()
    // var $quality = $('.rating').val()
    var $id = Date.now()
    var newIdea = new CardObject($id, $title, $body)
    clearInputs()
    ideaArray.push(newIdea)
    console.log('newIdeaPushed', ideaArray);
    storeIdea()
    prependCard()
})

function prependCard() {
    $('.card-container').html('');
    getIdeas()
    console.log("getIdeasArray", ideaArray);
    ideaArray.forEach(function(idea) {
    $('.card-container').prepend(`<article class="idea-card" id="${idea.id}">
      <button type="button" class="delete"></button>
      <h2 contenteditable="true">${idea.title}</h2>
      <p contenteditable="true">${idea.body}</p>
      <div class="quality-container">
        <button type="button" class="up-vote"></button>
        <button type="button" class="down-vote"></button>
        <p class="idea-quality"><span class="quality-font">quality: </span><span class="rating">${idea.quality}</span></p>
      </div>
    </article>`)
        console.log(idea);
    })
}

function CardObject(id, title, body) {
    this.id = id
    this.title = title
    this.body = body
    this.quality = "swill"
}

function clearInputs() {
    $('#title').val('')
    $('#body').val('')
}

$('.card-container').on('click', '.delete', function() {
    $(this).closest('.idea-card').remove()
    var cardID = $(this).closest('.idea-card').attr('id')
    ideaArray.forEach(function(idea, index) {
        if (cardID == idea.id) {
            ideaArray.splice(index, 1)
            console.log('test');
        }
        storeIdea();
    })
})

function storeIdea() {
    var stringifiedIdea = JSON.stringify(ideaArray)
    localStorage.setItem('ideas', stringifiedIdea)
}

function getIdeas() {
    var getIdeas = localStorage.getItem('ideas') || '[]'
    var parsedIdea = JSON.parse(getIdeas)
    ideaArray = parsedIdea;
    console.log('parsedIdeas', ideaArray);
}

$('.card-container').on('click', '.up-vote', function() {
    var rating = ($(this).siblings("p").children(".rating"))
    var thisButton = $(this)
    switch (rating.text()) {
        case 'swill':
            rating.text('plausible')
            updateArrayQuality(thisButton, rating);
            break;
        case 'plausible':
            rating.text('genius')
            updateArrayQuality(thisButton, rating)
            break;
        case 'genius':
            break
    }
})

$('.card-container').on('click', '.down-vote', function() {
    var rating = ($(this).siblings("p").children(".rating"))
    var thisButton = $(this)
    switch (rating.text()) {
        case 'genius':
            rating.text('plausible')
            updateArrayQuality(thisButton, rating)
            break;
        case 'plausible':
            rating.text('swill')
            updateArrayQuality(thisButton, rating)
            break;
        case 'swill':
            break
    }
})

function updateArrayQuality(thisButton, rating) {
  var cardID = thisButton.closest('.idea-card').attr('id');
  console.log(cardID)
  ideaArray.forEach(function(idea) {
    if (cardID == idea.id) {
      console.log('got it')
        idea.quality = rating.text()
        console.log(ideaArray);
    }
    storeIdea();
  })
}

$('.card-container').on('blur', 'h2', function() {
    var cardID = $(this).closest('.idea-card').attr('id')
    var h2Text = $(this).text()
    ideaArray.forEach(function(idea) {
        if (cardID == idea.id) {
            idea.title = h2Text
        }
        storeIdea();
    })
})

$('.card-container').on('blur', 'p', function() {
    var cardID = $(this).closest('.idea-card').attr('id')
    var h2Body = $(this).text()
    ideaArray.forEach(function(idea) {
        if (cardID == idea.id) {
            idea.body = h2Body
        }
        storeIdea();
    })
})

$('.search-bar').on('keyup', function() {
  var searchText = $('.search-bar').val().toLowerCase();
  $('.idea-card').each(function() {
    var cardText = $(this).text().toLowerCase();
    if (cardText.indexOf(searchText) != -1) {
      $(this).show()
    } else {
      $(this).hide()
    }
  })
})
