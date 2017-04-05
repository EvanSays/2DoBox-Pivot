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
  // var $id = newIdea.id
  // var $title = newIdea.title
  // var $body = newIdea.body
  // var $quality = newIdea.quality
  $('.card-container').prepend(`<article class="idea-card" id="${idea.id}">
      <button type="button" class="delete"></button>
      <h2 contenteditable="true">${idea.title}</h2>
      <p contenteditable="true">${idea.body}</p>
      <div class="quality-container">
        <button type="button" class="up-vote"></button>
        <button type="button" class="down-vote"></button>
        <p class="idea-quality"><span class="quality-font">quality: </span>${idea.quality}</p>
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
})

function storeIdea() {
  var stringifiedIdea = JSON.stringify(ideaArray)
  localStorage.setItem('ideas', stringifiedIdea)
}

function getIdeas() {
  var getIdeas = localStorage.getItem('ideas') || '[]'
  var parsedIdea = JSON.parse(getIdeas)
  ideaArray = parsedIdea;
  console.log('parsedIdeas',ideaArray);
}
