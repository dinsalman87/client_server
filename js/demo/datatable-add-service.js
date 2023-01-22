// Call the dataTables jQuery plugin
$(document).ready(function() {

  fetch(`/treatments`)
  .then(response => response.json())
  .then(data => {

    data = data.map((el) => {
      el.formatedDate = formatDate(new Date(el.date))
      return el
    })

    var table = $('#dataTable').DataTable(
      {
        data: data,
        columns: [
            { data : "number"},
            { data : "information"},
            { data : "formatedDate"},
            { data : "workerEmail"},
            { data : "carNumber"},
            { data : null, 
              defaultContent : "<button id='editBtn' class='btn btn-success'>Edit</button>"
            },
            { data : null, 
              defaultContent : "<button id='deleteBtn' class='btn btn-danger'>Delete</button>"
            },


        ],
      }
    );

    $('#dataTable tbody').on( 'click', '#deleteBtn', function () {
      var data = table.row( $(this).parents('tr') ).data();
      deleteTreatment(data.number)
    } );

    $('#dataTable tbody').on( 'click', '#editBtn', function () {
      var data = table.row( $(this).parents('tr') ).data();
      editData(data)
    } );
  });

  
});
