$(document).ready(function() {
    // ローカルストレージから付箋を読み込む
    function loadNotes() {
        var notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.forEach(function(note) {
            createNoteElement(note.text, note.left, note.top, note.width, note.height, note.color);
        });
    }

    // 付箋をローカルストレージに保存する
    function saveNotes() {
        var notes = [];
        $('.note').each(function() {
            var note = {
                text: $(this).data('text'),
                left: $(this).css('left'),
                top: $(this).css('top'),
                width: $(this).css('width'),
                height: $(this).css('height'),
                color: $(this).css('background-color')
            };
            notes.push(note);
        });
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    // 付箋のサイズを内容に合わせて調整する
    function adjustNoteSize(note) {
        var noteContent = note.find('.note-content');
        note.css({
            width: noteContent.outerWidth(),
            height: noteContent.outerHeight()
        });
    }

    // 付箋を作成する
    function createNoteElement(markdownText, left, top, width, height, color) {
        var note = $('<div class="note" tabindex="0"></div>');
        var noteContent = $('<div class="note-content"></div>').html(marked.parse(markdownText));
        var noteTextarea = $('<textarea></textarea>').val(markdownText).hide();
        var colorInput = $('<input type="text" class="color-input" placeholder="#ffeb3b">').val(color).hide();
        var saveButton = $('<button class="save-button">保存</button>').hide();
        var cancelButton = $('<button class="cancel-button">取り消し</button>').hide();

        note.css({ left: left, top: top, width: width, height: height, backgroundColor: color });
        note.data('text', markdownText);

        var deleteButton = $('<button class="delete-button"></button>');
        deleteButton.click(function(e) {
            e.stopPropagation();
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
            colorInput.show();
            saveButton.show();
            cancelButton.show();
        });

        saveButton.click(function() {
            var newMarkdownText = noteTextarea.val();
            var newColor = colorInput.val();
            note.data('text', newMarkdownText);
            noteContent.html(marked.parse(newMarkdownText));
            note.removeClass('edit-mode');
            note.draggable('enable');
            noteTextarea.hide();
            colorInput.hide();
            saveButton.hide();
            cancelButton.hide();
            noteContent.show();
            note.css('background-color', newColor);
            adjustNoteSize(note);
            saveNotes();
        });

        cancelButton.click(function() {
            noteTextarea.val(note.data('text'));
            colorInput.val(note.css('background-color'));
            note.removeClass('edit-mode');
            note.draggable('enable');
            noteTextarea.hide();
            colorInput.hide();
            saveButton.hide();
            cancelButton.hide();
            noteContent.show();
        });

        colorInput.blur(function() {
            var newColor = $(this).val();
            note.css('background-color', newColor);
        });

        note.append(noteContent, noteTextarea, colorInput, saveButton, cancelButton, deleteButton, editButton);

        $('#notes-container').append(note);
        note.draggable({
            containment: '#notes-container',
            stop: saveNotes
        }).resizable({
            containment: '#notes-container',
            stop: saveNotes
        });

        note.on('focusin', function() {
            deleteButton.show();
            editButton.show();
        });

        note.on('focusout', function(event) {
            if (!deleteButton.is(event.relatedTarget) && !editButton.is(event.relatedTarget) && !saveButton.is(event.relatedTarget) && !cancelButton.is(event.relatedTarget) && !colorInput.is(event.relatedTarget) && !noteTextarea.is(event.relatedTarget)) {
                deleteButton.hide();
                editButton.hide();
            }
        });

        note.on('dblclick', function() {
            note.draggable('disable');
            note.css('cursor', 'default');
        });

        note.on('blur', function() {
            note.draggable('enable');
            note.css('cursor', 'move');
        });

        return note;
    }

    // 新しい付箋を作成する
    $('#create-note').click(function() {
        var note = createNoteElement('', '50%', '50%', '200px', '150px', '#ffeb3b');
        note.css({
            left: ($('#notes-container').width() - note.outerWidth()) / 2,
            top: ($('#notes-container').height() - note.outerHeight()) / 2
        });
        note.find('.edit-button').trigger('click');
    });

    // すべての付箋を削除する
    $('#clear-notes').click(function() {
        if (confirm('すべての付箋を削除しますか？')) {
            localStorage.removeItem('notes');
            $('.note').remove();
        }
    });

    loadNotes();
});
