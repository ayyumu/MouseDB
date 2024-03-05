let isPoppup = false;
$(document).ready(function () {
    $("#toggle").click(function () {
        $(".ui").not(".button, .dtsb-input, .input, .popup").toggleClass("inverted");
        $("body, #firstTh").toggleClass("bBack");
        $("img").not(".infoData").toggleClass("invImg");
        $(".dtsb-searchBuilder").toggleClass("invFilter");
        if ($(this).find("i").hasClass("fa-moon")) {
            $(this).find("i").removeClass("fa-moon").addClass("fa-sun");
        } else if ($(this).find("i").hasClass("fa-sun")) {
            $(this).find("i").removeClass("fa-sun").addClass("fa-moon");
        }
        fetch('/dark-mode-toggle', { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    // console.log("toggle");
                } else {
                    console.error('Failed to toggle dark mode');
                }
            })
            .catch(error => console.error('Error toggling dark mode:', error));
    });

    $('.info-icon').popup({
        position: 'top left',
        hoverable: true
    });


    $('th').hover(
        function () {
            $('.info-icon').popup({
                position: 'top left',
                hoverable: true
            });
            // console.log('Hovered over element');
        }, null
    );

    $('.dtr-control').hover(null,
        function () {
            $('.info-icon').popup({
                position: 'top left',
                hoverable: true
            });
            // console.log('Left element');
        }
    );

});

document.addEventListener('keydown', function (event) {
    if (event.keyCode === 65 && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        alert('Select all invalid. If you want the table data, just contact me');
    }
});

function openLink(url) {
    window.open(url, '_blank');
}