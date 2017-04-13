$(document).ready(prependOnStart)

$('.save-button').on('click', saveButton)
                  .on('click', saveButtonDisable);
$('#title, #task').on('input', saveButtonEnable);
$('.card-container').on('click', '.delete', deleteCard);
$('.card-container').on('blur', 'h2', titlePersist);
$('.card-container').on('blur', 'p', bodyPersist);
$('.card-container').on('click', '.up-vote', increaseIndex);
$('.card-container').on('click', '.down-vote', decreaseIndex);
$('#filter').on('keyup', searchCards);
$('.card-container').on('keypress', "h2, #p-body", something)
$("#title, #task").keypress(enterKeySave)

/*=======================================
>>>>>>>>  ON START  <<<<<<<<
========================================*/
function clearInputs() {
  $('#title').val('')
  $('#task').val('')
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
      <p id="p-body" contenteditable="true">${newIdea.body}</p>
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
  if (data[2] == data[1].length - 1) {return;}
  data[2]++;
  data[0].quality = data[1][data[2]]
  data[0].index = data[2]
  setItemLocalStorage(cardID, data[0])
  $(this).siblings("p").children(".rating").text(data[1][data[2]])
}

function decreaseIndex() {
  var cardID = ($(this).closest('.idea-card').attr('id'))
  var data = getObjectData(cardID)
  if (data[2] == 0) { return;}
  data[2]--;
  data[0].quality = data[1][data[2]]
  data[0].index = data[2]
  setItemLocalStorage(cardID, data[0])
  $(this).siblings("p").children(".rating").text(data[1][data[2]])
}

/*=======================================
>>>>>>>>  LOCAL STORAGE  <<<<<<<<
========================================*/
function titlePersist() {
  var cardID = $(this).closest('.idea-card').attr('id')
  var newText = $(this).text()
  var arrayTitleKey = "title"
  var data = getObjectData(cardID)
  data[0].title = newText;
  setItemLocalStorage(cardID, data[0])
}

function bodyPersist() {
  var cardID = $(this).closest('.idea-card').attr('id')
  var newText = $(this).text()
  var data = getObjectData(cardID)
  data[0].body = newText;
  setItemLocalStorage(cardID, data[0])
}

function storeIdea(newIdea) {
  localStorage.setItem(newIdea.id, JSON.stringify(newIdea))
}

function setItemLocalStorage(id, object) {
  localStorage.setItem(id, JSON.stringify(object))
}

function deleteCard() {
  $(this).closest('.idea-card').remove()
  var cardID = $(this).closest('.idea-card').attr('id')
  localStorage.removeItem(cardID);
}

var getObjectData = function(cardID) {
  var parsedObject = JSON.parse(localStorage.getItem(cardID))
  return [parsedObject, parsedObject.qualities, parsedObject.index, parsedObject.quality]
}

/*=======================================
>>>>>>>>  EVENT LISTENER TRIGGERS  <<<<<<<<
========================================*/

function saveButton() {
  var $title = $('#title').val()
  var $body = $('#task').val()
  var newIdea = new CardObject($title, $body)
  clearInputs()
  storeIdea(newIdea)
  prependCard(newIdea)
}

function saveButtonEnable() {
  var titleInput = $('#title').val();
  var bodyInput = $('#task').val();
  if (titleInput !== "" && bodyInput !== "") {
    $('.save-button').attr("disabled", false)
  }
}

function saveButtonDisable() {
  var titleInput = $('#title').val();
  var bodyInput = $('#task').val();
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

function enterKeySave() {
  var titleInput = $('#title').val();
  var bodyInput = $('#task').val();
  if (titleInput !== "" && bodyInput !== "" && event.which == 13) {
    $('.save-button').click()
  }
};

function something() {
  if (event.keyCode == 13 && event.shiftKey) {
    alert('Enter + shift pressed');
  } else if (event.keyCode == 13) {
    event.preventDefault();
    $("h2, #p-body").blur()
  }
};
