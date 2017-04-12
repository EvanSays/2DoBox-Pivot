var ideaArray = []

$(document).ready(prependOnStart)

$('.save-button').on('click', saveButton, saveButtonDisable)
$('.card-container').on('click', '.delete', deleteCard)
$('.card-container').on('click', '.up-vote', changeQualityUp)
$('.card-container').on('click', '.down-vote', changeQualityDown)
$('.card-container').on('blur', 'h2', titlePersist)
$('.card-container').on('blur', 'p', bodyPersist)

//
// $('#title', '.save-button').on('keyup', function(event) {
//   if (event.keyCode == 13) {
//     $('.save-button').click()
//   }
// })
// $('.card-container').on('click', '.delete', function() {
//   $(this).closest('.idea-card').remove()
//   var cardID = $(this).closest('.idea-card').attr('id')
//   ideaArray.forEach(function(idea, index) {
//     if (cardID == idea.id) {
//       ideaArray.splice(index, 1)
//     }
//   })
//   storeIdea()
// })

// function qualitys() {
//   var quality = ["swill", "plausible", "genius"]
//   counter = 0;
//   var increase = counter < quality.length ? (
//   console.log(quality[counter]),
//   counter++ )
//   :(
//   console.log(quality[counter]));
//   console.log(counter)
// }





function bodyPersist() {
  var cardID = $(this).closest('.idea-card').attr('id')
  var h2Body = $(this).text()
  var retrieveObject = localStorage.getItem(cardID)
  console.log(retrieveObject);
  var parsedObject = JSON.parse(retrieveObject)
  console.log(parsedObject);
  parsedObject.body = h2Body;
  console.log(parsedObject);
  var stringifiedObject = JSON.stringify(parsedObject)
  console.log(stringifiedObject);
  localStorage.setItem(cardID, stringifiedObject)
}


// come back to this and change!!!!!!!
$('.search-bar').on('keyup', function(event) {
  searchIdeas()
})

/*=======================================
>>>>>>>>    <<<<<<<<
========================================*/

/*=======================================
>>>>>>>> CALLBACK FUNCTIONS <<<<<<<<
========================================*/
function prependOnStart() {
  for (var i = 0; i < localStorage.length; i++) {
    prependCard(JSON.parse(localStorage.getItem(localStorage.key(i))));
  }
}

function CardObject(title, body) {
  this.title = title;
  this.body = body;
  this.id = Date.now();
  this.quality = "swill"
}

function clearInputs() {
  $('#title').val('')
  $('#body').val('')
}

function prependCard(newIdea) {
  console.log(newIdea.id)
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

function saveButton() {
  console.log("save button!!");
  var $title = $('#title').val()
  var $body = $('#body').val()
  var newIdea = new CardObject($title, $body)
  console.log(newIdea);
  clearInputs()
  storeIdea(newIdea)
  prependCard(newIdea)
}

function storeIdea(newIdea) {
  localStorage.setItem(newIdea.id, JSON.stringify(newIdea))
}


function getIdeas() {
  var getIdeas = localStorage.getItem('ideas') || '[]'
  var parsedIdea = JSON.parse(getIdeas)
  ideaArray = parsedIdea
}

function deleteCard() {
  $(this).closest('.idea-card').remove()
  var cardID = $(this).closest('.idea-card').attr('id')
  localStorage.removeItem(cardID);
}

function changeQualityUp() {
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
}

function changeQualityDown() {
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
}

function titlePersist() {
  var cardID = $(this).closest('.idea-card').attr('id')
  var text = $(this).text()
  var thisTitle = "title"
  retrieveObjectStorage(cardID, text, thisTitle)
}

function bodyPersist() {
  var cardID = $(this).closest('.idea-card').attr('id')
  var text = $(this).text()
  var thisBody = "body"
  retrieveObjectStorage(cardID, text, thisBody)
}

function retrieveObjectStorage(cardID, text, key) {
  var parsedObject = JSON.parse(localStorage.getItem(cardID))
  parsedObject[key] = text;
  localStorage.setItem(cardID, JSON.stringify(parsedObject))
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

$('#title, #body').on('input',saveButtonEnable)



// saveButtonStatus();

function saveButtonEnable() {
  var titleInput = $('#title').val();
  var bodyInput = $('#body').val();
     if (titleInput !== "" && bodyInput !== "") {
      $('.save-button').attr("disabled", false)
    }
  }

function saveButtonDisable(){
console.log("its disabled")
  var titleInput = $('#title').val();
  var bodyInput = $('#body').val();
     if (titleInput === "" && bodyInput === "") {
      $('.save-button').attr("disabled", true)
    }
}


function searchIdeas() {
  var searchText = $('.search-bar').val().toLowerCase()
  ideaArray.forEach(function(idea, index) {
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
  searchResultsNeg.forEach(function(idea, index) {
    $('#' + idea.id).hide()
  })
  searchResults.forEach(function(idea, index) {
    $('#' + idea.id).show()
  })
}
