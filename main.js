$(document).ready(prependOnStart)

$('.save-button').on('click', saveButton)
                .on('click', saveButtonDisable);
$('.card-container').on('click', '.delete', deleteCard);

$('.card-container').on('blur', 'h2', titlePersist);
$('.card-container').on('blur', 'p', bodyPersist);





///how can i pass event to callback function js
$("#title, #body").keypress(function(e) {
  if (e.which == 13) {
    console.log("ENTER")
		$('.save-button').click()
	}
});


function CardObject(title, body) {
  this.id = Date.now();
  this.title = title;
  this.body = body;
  this.qualities = ['swill', 'plausible', 'genius', 'maniac']
  this.index = 0
  this.quality = this.qualities[this.index]
}




///i need to get local storage and increment the quality then cahnge the page and save.
$('.card-container').on('click', '.up-vote', increaseIndex);
$('.card-container').on('click', '.down-vote', decreaseIndex);

function increaseIndex(){
  var cardID = ($(this).closest('.idea-card').attr('id'))
  var data = getObjectData(cardID)
  if (data[2] == data[1].length-1) { return;}
    data[2]++;
    data[0].quality = data[1][data[2]]
    data[0].index = data[2]
    localStorage.setItem(cardID, JSON.stringify(data[0]))
    $(this).siblings("p").children(".rating").text(data[1][data[2]])

}
function decreaseIndex(){
  var cardID = ($(this).closest('.idea-card').attr('id'))
  var data = getObjectData(cardID)
  if (data[2] == 0) { return;}
    data[2]--;
    data[0].quality = data[1][data[2]]
    data[0].index = data[2]
    localStorage.setItem(cardID, JSON.stringify(data[0]))
    $(this).siblings("p").children(".rating").text(data[1][data[2]])
}

var getObjectData = function(cardID) {
  var parsedObject = JSON.parse(localStorage.getItem(cardID))
  var qualityList = parsedObject.qualities
  var index = parsedObject.index
  var quality = parsedObject.quality
  return [parsedObject, qualityList, index, quality]
}


function getDataIndex(thisButton) {
  var index =$(thisButton ).closest('.idea-card').attr('data-index')
    return index
}
function getDataQualities(thisButton) {
var list =  $(thisButton).closest('.idea-card').attr('data-list')
    return list
}


function bodyPersist() {
  var cardID = $(this).closest('.idea-card').attr('id')
  var h2Body = $(this).text()
  var retrieveObject = localStorage.getItem(cardID)
  var parsedObject = JSON.parse(retrieveObject)
  parsedObject.body = h2Body;
  var stringifiedObject = JSON.stringify(parsedObject)
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


function clearInputs() {
  $('#title').val('')
  $('#body').val('')
}

function prependCard(newIdea) {
  console.log(newIdea.id)
  $('.card-container').prepend(
    `<article class="idea-card" id="${newIdea.id}" data-index="${newIdea.index}" data-list="${newIdea.qualities}">
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
  var $title = $('#title').val()
  var $body = $('#body').val()
  var newIdea = new CardObject($title, $body)
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

// function changeQualityUp() {
//   var rating = ($(this).siblings("p").children(".rating"))
//   var thisButton = $(this)
//   switch (rating.text()) {
//     case 'swill':
//       rating.text('plausible')
//       updateArrayQuality(thisButton, rating);
//       break;
//     case 'plausible':
//       rating.text('genius')
//       updateArrayQuality(thisButton, rating)
//       break;
//     case 'genius':
//       break
//   }
// }
//
// function changeQualityDown() {
//   var rating = ($(this).siblings("p").children(".rating"))
//   var thisButton = $(this)
//   switch (rating.text()) {
//     case 'genius':
//       rating.text('plausible')
//       updateArrayQuality(thisButton, rating)
//       break;
//     case 'plausible':
//       rating.text('swill')
//       updateArrayQuality(thisButton, rating)
//       break;
//     case 'swill':
//       break
//   }
// }

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
