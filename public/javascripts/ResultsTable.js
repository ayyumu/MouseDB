$(document).ready(function () {
    var table = $('#example').DataTable({
        "bPaginate": false,
        "bInfo": false,
        searchBuilder: {
            greyscale: true,
            defaultCondition: '=',
            // targets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ,10 ,11, 12, 13, 14, 15, 16, 17, 18, 19]
        },
        language: {
            searchBuilder: {
                title: 'Filter',
            }
        },
        buttons: ['colvis'],
        layout: {
            // top: ['searchBuilder', 'buttons', 'search'],
            topStart: 'searchBuilder',
            topEnd: ['buttons', 'search']
        },

        select: true,
        retrieve: true,
        scrollX: true,
        scrollY: 800,
        // responsive: true,
        // fixedHeader: true, //buggy when using with statesave or colviz
        // stateSave: true,
        columnDefs: [
            // { visible: false, targets: [19, 20,23,24,26] },
            // { targets: '_all', className: 'dt-center' }
        ],
        // orderFixed: [[0, 'asc']],
    });
    table.row(0).select();
});