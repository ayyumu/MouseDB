function popup1() {
    var w = 550, h = 550;
    window.open("https://twitter.com/intent/tweet?url=" + encodeURIComponent(location.href) + "&text=" + "<%= mouses[0].creator %> <%= mouses[0].name %> is the mouse fits my hand!");
}

function popup2() {
    var w = 550, h = 420;
    window.open("https://www.facebook.com/sharer.php?u=" + encodeURIComponent(location.href));
}

function popup4() {
    var w = 550, h = 420;
    window.open("https://getpocket.com/edit?url=" + encodeURIComponent(location.href));
}

function popup5() {
    var w = 550, h = 420;
    window.open("https://social-plugins.line.me/lineit/share?url=" + encodeURIComponent(location.href));
}

//amazon
// function popup9() {
//     var w = 550, h = 420;
//     window.open();
// }

// coppying
const clipboard = new ClipboardJS(".copy_btn");
window.addEventListener('DOMContentLoaded', function () {
    $(".copy_btn").click(function () {
        $(this).attr("data-clipboard-text", document.title + " " + location.href).css("cursor", "text").css("transform", "none").text("COPIED").attr("title", "コピーしました");
    });
    // const tweet = document.querySelectorAll('.twitter-tweet');
    // tweet.setAttribute('data-width', "300");
});