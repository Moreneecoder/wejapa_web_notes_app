$(document).ready(function(){

    $.ajax({
        url: '/fetch_options'        
    })
    .then(response => {    
      let Options = ``  // `<option value=''> Uncategorized </option>`;
      let listGroup = ``;
        for (const key in response) {
          if (response.hasOwnProperty(key)) {
            const Topic = response[key];
            Options += `<option id="option-${Topic}" value='${Topic}'> ${Topic} </option>` 
            listGroup +=`<a href="#" data-id="${Topic}" class="note-group-list ${Topic} list-group-item list-group-item-action bg-light">${Topic}</a>`       
            
          }
        }
      
        $('#topic-list').html(Options)
        $('#topic-menu').append(listGroup)
    })
            
    $('form').submit(function(e){
      e.preventDefault()

      let _this = $(this)
    
      $.ajax({
        url: _this.attr('action'),
        data: _this.serialize()
      }) 
      .then(response => {        
        
        let Topic = $('#topic-list').children("option:selected").val();

        if($(`.${Topic}`).text() == ''){
          $('#topic-menu').append(`<a href="#" data-id="${Topic}" class="note-group-list ${Topic} list-group-item list-group-item-action bg-light">${Topic}</a>`)
        }

        if(response.status == 'success'){
          $('form').find("input[type=text], textarea").val("");
        }
        $('#write-note-info').text(response.message).show().fadeOut(7000)
        //alert(response.message)
      })
    })

    $(document).on('click', '#new-topic-btn', function(){        
        $('#new-topic-div').show();
    })

    $(document).on('click', '#new-topic-save', function(){        
        let Topic = $('#new-topic').val()
        if(Topic != '') {
          $('#topic-list').append(`<option id="last-added" value='${Topic}'> ${Topic} </option>`)
          //let numOfOptions = document.getElementById("topic-list").options.length;

          document.getElementById("last-added").selected = "true";
        }
        
        $('#new-topic-div').hide();
        
    })

    $(document).on('click', '.note-group-list', function(){
      let Topic = $(this).attr('data-id')
      $.ajax({
        url: '/get_note_by_topic',
        data: {topic: Topic}
      }) 
      .then(response => {

       let noteList = `
        <div class="row">
          <div id="update-note-info-1" class="alert alert-success mt-5" style="display: none;"></div>
          <div class="row-body col-sm-6 col-md-8 col-xs-12">
            <div class="card mt-5">
              <div class="card-body">
              <div id="update-note-info-2" class="alert alert-success" style="display: none;"></div>

                <h3>${Topic}</h3>            
              
         `

       response.forEach(note => {         
         let Title = note.slice(0, -4)                  

         noteList += `
          <div class="alert alert-info">
            <span>${Title} </span><br>
            <p></p>
            <button data-topic="${Topic}" data-note="${note}" class="btn btn-success read-btn">Read</button>
            <button data-topic="${Topic}" data-note="${note}" class="btn btn-primary edit-btn">Edit</button>
            <button data-topic="${Topic}" data-note="${note}" class="btn btn-danger delete-btn">Delete</button>
          </div>
         `

       });

       noteList += `
            </div>
            </div>
          </div>
        </div>
       `

       $('.app-body').html(noteList)

      })

    })


    $(document).on('click', '.read-btn', function(){
      let noteTopic = $(this).attr('data-topic')
      let noteTitle = $(this).attr('data-note')

      $.ajax({
        url: '/read_note',
        data: {note_topic: noteTopic, note_body: noteTitle}
      })
      .then(response => {          
        
        let NoteHtml = `
            <div class="row">
              <div class="col-sm-6 col-xs-12">
                <div class="alert alert-info mt-5">
                  <h4>${noteTopic}</h4>
                  <h6>${noteTitle.slice(0, -4)}</h6>
                  <hr>
                  <p>${response}</p>
                </div>
              </div>
            </div>
        `

        $('.app-body').html(NoteHtml)
      })

    })


    $(document).on('click', '.edit-btn', function(){
      let noteTopic = $(this).attr('data-topic')
      let noteTitle = $(this).attr('data-note')        
      
      $.ajax({
        url: '/read_note',
        data: {note_topic: noteTopic, note_body: noteTitle}
      })
      .then(response => {
        let UpdateNoteHtml = `
          <div class="row">
            <div class="col-sm-6 col-xs-12">
              <div class="card mt-5">
                <div class="card-body">
                  <div class="form-group">
                    <h4 id="updated-note-topic">${noteTopic}</h4>
                    <h6 id="updated-note-title">${noteTitle.slice(0, -4)}</h6>
                    <textarea id="updated-note-body" class="form-control" id="update-note-box" cols="30" rows="5">${response}</textarea>
                    <button id="update-btn" class="btn btn-danger mt-2">Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `

         $('.app-body').html(UpdateNoteHtml)
      })
        
    })

    $(document).on('click', '#update-btn', function(){
      let Topic = $('#updated-note-topic').text()
      let Title = $('#updated-note-title').text()
      let Body = $('#updated-note-body').val()        

      $.ajax({
        url: '/update_note',
        data: {topic:Topic, title:Title, body:Body}
      })
      .then(response => {
        $(`.${Topic}`).click()
        alert(response.message)
        //$('#update-note-info-2').text(response.message).show().fadeOut(7000)
       
      })
    })


    $(document).on('click', '.delete-btn', function(){
      let _this = $(this);
      let noteTopic = $(this).attr('data-topic')
      let noteTitle = $(this).attr('data-note')

      $.ajax({
        url: '/delete_note',
        data: {note_topic: noteTopic, note_body: noteTitle}
      })
      .then(response => {
        if(response.status == 'topic-deleted'){
          $(`.${noteTopic}`).remove()            
          _this.parentsUntil('.row-body ').remove()
          $('#update-note-info-1').text(response.message).show().fadeOut(7000)
        }
        
        if(response.status == 'message-deleted'){
          $('#update-note-info-2').text(response.message).show().fadeOut(7000)           
        }

        _this.parentsUntil('.card-body').remove()                    
                  
      })

    })


    $(document).on('click', '#close', function(){
      $('.jumbotron').hide()
    })

  })
