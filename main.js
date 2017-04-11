var ideaArray = []

$(document).ready(function() {
  for (var i = 0; i < localStorage.length; i++) {
		prependCard(JSON.parse(localStorage.getItem(localStorage.key(i))));
  }
})

function CardObject(title, body) {
  this.title = title;
	this.body = body;
	this.quality = "swill"
	this.id = Date.now();
}

$('.save-button').on('click', function() {
  var $title = $('#title').val()
  var $body = $('#body').val()
  var newIdea = new CardObject($title, $body)
  clearInputs()
  storeIdea(newIdea)
  prependCard(newIdea)
})



//
// $('#title', '.save-button').on('keyup', function(event) {
//   if (event.keyCode == 13) {
//     $('.save-button').click()
//   }
// })

$('.card-container').on('click', '.delete', function() {
  $(this).closest('.idea-card').remove()
  var cardID = $(this).closest('.idea-card').attr('id')
  ideaArray.forEach(function(idea, index) {
    if (cardID == idea.id) {
      ideaArray.splice(index, 1)
    }
  })
  storeIdea()
})

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

$('.card-container').on('blur', 'h2', function() {
  var cardID = $(this).closest('.idea-card').attr('id')
  var h2Text = $(this).text()
  ideaArray.forEach(function(idea) {
    if (cardID == idea.id) {
        idea.title = h2Text
    }
  })
  storeIdea()
})

$('.card-container').on('blur', 'p', function() {
  var cardID = $(this).closest('.idea-card').attr('id')
  var h2Body = $(this).text()
  ideaArray.forEach(function(idea) {
    if (cardID == idea.id) {
      idea.body = h2Body
    }
  })
  storeIdea()
})

$('.search-bar').on('keyup', function(event) {
  searchIdeas()
})

/*=======================================
>>>>>>>>    <<<<<<<<
========================================*/
function prependCard(newIdea) {
  $('.card-container').prepend(
    `<article class="idea-card" id="${newIdea.id}">
      <button type="button" class="delete"></button>
      <h2 contenteditable="true">${newIdea.title}</h2>
      <p contenteditable="true">${newIdea.body}</p>
      <div class="quality-container">
        <button type="button" class="up-vote"></button>
        <button type="button" class="down-vote"></button>
        <p class="idea-quality"><span class="quality-font">quality: </span><span class="rating">${newIdea.quality}</span></p>
      </div>
    </article>`)
}
/*=======================================
>>>>>>>>    <<<<<<<<
========================================*/
function clearInputs() {
  $('#title').val('')
  $('#body').val('')
}

function storeIdea(newIdea) {
  localStorage.setItem(newIdea.id, JSON.stringify(newIdea))
}


function getIdeas() {
  var getIdeas = localStorage.getItem('ideas') || '[]'
  var parsedIdea = JSON.parse(getIdeas)
  ideaArray = parsedIdea
}

function updateArrayQuality(thisButton, rating) {
  var cardID = thisButton.closest('.idea-card').attr('id')
  ideaArray.forEach(function(idea) {
    if (cardID == idea.id) {
      idea.quality = rating.text()
    }
    storeIdea()
  })
}

function searchIdeas() {
  var searchText = $('.search-bar').val().toLowerCase()
  ideaArray.forEach( function(idea, index) {
    idea.title = idea.title.toLowerCase()
    idea.body = idea.body.toLowerCase()
  })
  var searchResultsNeg = ideaArray.filter(function(idea) {
    return idea.title.indexOf(searchText) == -1 &&
    idea.body.indexOf(searchText) == -1 &&
    idea.quality.indexOf(searchText) == -1
  })
  var searchResults = ideaArray.filter(function(idea) {
    return idea.title.indexOf(searchText) != -1 ||
    idea.body.indexOf(searchText) != -1 ||
    idea.quality.indexOf(searchText) != -1
  })
  searchResultsNeg.forEach(function (idea, index) {
    $('#'+idea.id).hide()
  })
  searchResults.forEach(function (idea, index) {
    $('#'+idea.id).show()
  })
}
