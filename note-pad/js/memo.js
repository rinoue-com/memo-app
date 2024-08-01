
//1.Save クリックイベント
$("#save").on("click", function () {
    const key = $("#key").val();
    const value = $("#memo").val();

    if(key == "") {
        $('#KeyError').show();
    }
    else {
        $('#KeyError').hide();

        localStorage.setItem(key, value);
        // 既に要素がある場合は、削除してから追加
        $("#" + key).remove();
        const html = '<tr id=' + $("#key").val() + '><td class="key-column"><span>' + key + '</span><div class="button-div"><button class="row-update">編集</button><button class="row-delete">削除</button></div>' + '</td><td>' + value + '</td></tr>';
        $("#list").append(html);

        $("#key").val("");
        $("#memo").val("");
    }
});

//2.clear クリックイベント
$("#clear").on("click", function () {
    localStorage.clear();
    $("#list").empty();
});

// 各行の削除ボタン クリックイベント
$(document).on("click", ".row-delete", function() {
    const key = $(this).closest('tr').attr('id');  // 削除ボタンの親要素のidを取得
    alert("「" + key + "」を削除しますか？")
    localStorage.removeItem(key);   // ローカルストレージから削除
    $("#" + key).remove();  // 画面から削除
});

// 編集ボタンクリックイベント
$(document).on("click", ".row-update", function() {
    const key = $(this).closest('tr').attr('id');  // 編集ボタンの親要素のidを取得
    const value = localStorage.getItem(key); //value取得
    $("#key").val(key);
    $("#memo").val(value);
});


//3.ページ読み込み：保存データ取得表示
for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);  //key取得
    const value = localStorage.getItem(key); //value取得
    const html = '<tr id=' + key + '><td class="key-column"><span>' + key + '</span><div class="button-div"><button class="row-update">編集</button><button class="row-delete">削除</button></div>' + '</td><td>' + value + '</td></tr>';
    $("#list").append(html);
}