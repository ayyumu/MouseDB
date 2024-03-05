$(document).ready(function () {
    var table = $('#example').DataTable({
        dom: 'BPfrtip, Qfrtip',
        buttons: [
            {
                text: 'Advanced Filters',
                className: 'spToggle showPanes',
                action: function (e, dt, node, config) {
                    var $container = dt.searchPanes.container();
                    $container.find('.dtsp-searchPanes, .dtsp-titleRow').slideToggle(200, function () {
                        $('.spToggle').toggleClass('showPanes', $container.find('.dtsp-searchPanes, .dtsp-titleRow').is(':visible'));
                    });
                },
            },
        ],
        searchPanes: {
            layout: 'columns-2',
            initCollapsed: true,
            threshold: 1.0,
            filterChanged: function (count) {
                $('.spToggle').text(this.i18n('searchPanes.collapse', { 0: 'Advanced Filters', _: 'Advanced Filters (%d)' }, count));
            }
        },
    });

    table.searchPanes.container().find('.dtsp-searchPanes, .dtsp-titleRow').css('display', 'none');
});