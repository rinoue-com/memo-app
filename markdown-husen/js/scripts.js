$(document).ready(function() {
    function loadNotes() {
        var notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.forEach(function(note) {
            createNoteElement(note.text, note.left, note.top);
        });
    }

    function saveNotes() {
        var notes = [];
        $('.note').each(function() {
            var note = {
                text: $(this).data('text'),
                left: $(this).css('left'),
                top: $(this).css('top')
            };
            notes.push(note);
        });
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    function createNoteElement(markdownText, left, top) {
        var note = $('<div class="note" tabindex="0"></div>'); // tabindex="0"でフォーカス可能に
        var noteContent = $('<div class="note-content"></div>').html(marked.parse(markdownText));
        var noteTextarea = $('<textarea></textarea>').val(markdownText).hide();
        var saveButton = $('<button class="save-button">保存</button>').hide();
        var cancelButton = $('<button class="cancel-button">取り消し</button>').hide();

        note.css({ left: left, top: top });
        note.data('text', markdownText);

        var deleteButton = $('<button class="delete-button"></button>');
        deleteButton.click(function(e) {
            e.stopPropagation(); // クリックイベントが親要素にバブリングしないようにする
            note.remove();
            saveNotes();
        });

        var editButton = $('<button class="edit-button"></button>');
        editButton.click(function(e) {
            e.stopPropagation();
            note.addClass('edit-mode');
            note.draggable('disable');
            noteContent.hide();
            noteTextarea.show().focus();
            saveButton.show();
            cancelButton.show();
        });

        saveButton.click(function() {
            var newMarkdownText = noteTextarea.val();
            note.data('text', newMarkdownText);
            noteContent.html(marked.parse(newMarkdownText));
            note.removeClass('edit-mode');
            note.draggable('enable');
            noteTextarea.hide();
            saveButton.hide();
            cancelButton.hide();
            noteContent.show();
            saveNotes();
        });

        cancelButton.click(function() {
            noteTextarea.val(note.data('text'));
            note.removeClass('edit-mode');
            note.draggable('enable');
            noteTextarea.hide();
            saveButton.hide();
            cancelButton.hide();
            noteContent.show();
        });

        note.append(noteContent, noteTextarea, saveButton, cancelButton, deleteButton, editButton); // 順番を修正

        $('#notes-container').append(note);
        note.draggable({
            containment: '#notes-container',
            stop: saveNotes
        });

        note.on('focusin', function() {
            deleteButton.show();
            editButton.show();
        });

        note.on('focusout', function(event) {
            if (!deleteButton.is(event.relatedTarget) && !editButton.is(event.relatedTarget) && !saveButton.is(event.relatedTarget) && !cancelButton.is(event.relatedTarget)) {
                deleteButton.hide();
                editButton.hide();
            }
        });

        note.on('dblclick', function() {
            note.draggable('disable');
            note.css('cursor', 'default'); // マウスカーソルを通常状態に変更
        });

        note.on('blur', function() {
            note.draggable('enable');
            note.css('cursor', 'move');
        });
    }

    $('#create-note').click(function() {
        var markdownInput = $('#markdown-input').val();
        createNoteElement(markdownInput, '0px', '0px');
        $('#markdown-input').val('');
        saveNotes();
    });

    loadNotes();
});
