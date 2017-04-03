

var $saveButton = $('.save-button').on('click', function() {
  var $title = $('#title').val()
  var $body = $('#body').val()
  var $quality = $('.rating').val()
  var $id = Date.now()
  var newIdea = new CardObject($id, $title, $body, $quality)
  prependCard(newIdea)
})

function prependCard(newIdea) {
  var $title = newIdea.title
  var $body = newIdea.body
  var $quality = newIdea.quality
  $('.card-container').prepend(`<article class="idea-card">
      <button type="button" class="delete"></button>
      <h2>${$title}</h2>
      <p>${$body}</p>
      <div class="quality-container">
        <button type="button" class="up-vote"></button>
        <button type="button" class="down-vote"></button>
        <p class="idea-quality"><span class="quality-font">quality: </span>${$quality}</p>
      </div>
    </article>`)
}

function CardObject(id, title, body, quality) {
  this.id = id
  this.title = title
  this.body = body
  this.quality = "swill"
}
