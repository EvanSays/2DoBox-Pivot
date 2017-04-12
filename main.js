$(document).ready(prependOnStart)

$('.save-button').on('click', saveButton)
  .on('click', saveButtonDisable);
$('#title, #body').on('input', saveButtonEnable);
$('.card-container').on('click', '.delete', deleteCard);
$('.card-container').on('blur', 'h2', titlePersist);
$('.card-container').on('blur', 'p', bodyPersist);
$('.card-container').on('click', '.up-vote', increaseIndex);
$('.card-container').on('click', '.down-vote', decreaseIndex);
$('#search').on('keyup', searchCards);

/*=======================================
>>>>>>>>  ON START  <<<<<<<<
========================================*/
function clearInputs() {
  $('#title').val('')
  $('#body').val('')
}

function prependOnStart() {
  for (var i = 0; i < localStorage.length; i++) {
    prependCard(JSON.parse(localStorage.getItem(localStorage.key(i))));
  }
}

/*=======================================
>>>>>>>> OBJECT CONSTRUCTOR FUNCTION <<<<<<<<
========================================*/
function CardObject(title, body) {
  this.id = Date.now();
  this.title = title;
  this.body = body;
  this.qualities = ['None', 'Low', 'Normal', 'High', 'Critical']
  this.index = 2
  this.quality = this.qualities[this.index]
}

function prependCard(newIdea) {
  $('.card-container').prepend(
    `<article class="idea-card" id="${newIdea.id}" data-index="${newIdea.index}" data-list="${newIdea.qualities}">
      <button type="button" class="delete"></button>
      <h2 contenteditable="true">${newIdea.title}</h2>
      <p contenteditable="true">${newIdea.body}</p>
      <div class="quality-container">
        <button type="button" class="up-vote"></button>
        <button type="button" class="down-vote"></button>
        <p class="idea-quality"><span class="quality-font">Importance: </span><span class="rating">${newIdea.quality}</span></p>
      </div>
    </article>`)
}


/*=======================================
>>>>>>>>  IMPORTANCE VALUE CHANGER  <<<<<<<<
========================================*/
function increaseIndex() {
  var cardID = ($(this).closest('.idea-card').attr('id'))
  var data = getObjectData(cardID)
  if (data[2] == data[1].length - 1) {
    return;
  }
  data[2]++;
  data[0].quality = data[1][data[2]]
  data[0].index = data[2]
  localStorage.setItem(cardID, JSON.stringify(data[0]))
  $(this).siblings("p").children(".rating").text(data[1][data[2]])

}

function decreaseIndex() {
  var cardID = ($(this).closest('.idea-card').attr('id'))
  var data = getObjectData(cardID)
  if (data[2] == 0) {
    return;
  }
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

/*=======================================
>>>>>>>>  LOCAL STORAGE  <<<<<<<<
========================================*/

function bodyPersist() {
  var cardID = $(this).closest('.idea-card').attr('id')
  var h2Body = $(this).text()
  var retrieveObject = localStorage.getItem(cardID)
  var parsedObject = JSON.parse(retrieveObject)
  parsedObject.body = h2Body;
  var stringifiedObject = JSON.stringify(parsedObject)
  localStorage.setItem(cardID, stringifiedObject)
}

function retrieveObjectStorage(cardID, text, key) {
  var parsedObject = JSON.parse(localStorage.getItem(cardID))
  parsedObject[key] = text;
  localStorage.setItem(cardID, JSON.stringify(parsedObject))
}

/*=======================================
>>>>>>>>  EVENT LISTENER TRIGGERS  <<<<<<<<
========================================*/

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

function deleteCard() {
  $(this).closest('.idea-card').remove()
  var cardID = $(this).closest('.idea-card').attr('id')
  localStorage.removeItem(cardID);
}

function titlePersist() {
  var cardID = $(this).closest('.idea-card').attr('id')
  var text = $(this).text()
  var arrayTitleKey = "title"
  retrieveObjectStorage(cardID, text, arrayTitleKey)
}

function bodyPersist() {
  var cardID = $(this).closest('.idea-card').attr('id')
  var text = $(this).text()
  var arrayBodyKey = "body"
  retrieveObjectStorage(cardID, text, arrayBodyKey)
}

function saveButtonEnable() {
  var titleInput = $('#title').val();
  var bodyInput = $('#body').val();
  if (titleInput !== "" && bodyInput !== "") {
    $('.save-button').attr("disabled", false)
  }
}

function saveButtonDisable() {
  var titleInput = $('#title').val();
  var bodyInput = $('#body').val();
  if (titleInput === "" && bodyInput === "") {
    $('.save-button').attr("disabled", true)
  }
}

function searchCards() {
  var searchInput = $(this).val().toLowerCase();
  $(".idea-card").each(function() {
    var cardText = $(this).text().toLowerCase();
    if (cardText.indexOf(searchInput) != -1) {
      $(this).show();
    } else {
      $(this).hide();
    }
  })
}

$("#title, #body").keypress(function(e) {
  var titleInput = $('#title').val();
  var bodyInput = $('#body').val();
  if (titleInput !== "" && bodyInput !== "" && e.which == 13) {
    $('.save-button').click()
  }
});

$('.card-container').on('keypress', "h2, #p-body", function(event) {
  if (event.keyCode == 13 && event.shiftKey) {
    alert('Enter + shift pressed');
  } else if (event.keyCode == 13) {
    event.preventDefault();
    $("h2, #p-body").blur()
  }
});
