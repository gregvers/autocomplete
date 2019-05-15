$(function(){
  var getProducts = function (request, response) {
    $.getJSON(
      "/search?product=" + request.term, function (data) {
        response(data);
        console.log(data);
      }
    );
  };
  $("#search").autocomplete({
    //source: getProducts,
    source: function(req,res) {
            console.log("req.term: " + req.term);
            $.ajax({
                url: "/search?product="+req.term,
                dataType: "jsonp",
                type: "GET",
                data: {
                    term: req.term
                },
                success: function(data) {
                    res($.map(data, function(item) {
                        console.log("item.sku: " + item.sku);
                        console.log("item.name: " + item.name);
                        return {
                            label: item.name,
                            value: item.name,
                            sku: item.sku
                        };
                    }));
                },
                error: function(xhr) {
                    alert(xhr.status + ' : ' + xhr.statusText);
                }
            });
    },
    minLength: 2,
    select: function( event, ui ) {
      console.log("ui.item.label: " + ui.item.label);
      console.log("ui.item.id: " + ui.item.id);
      $("#name").html(ui.item.label);
      $("#sku").html(ui.item.sku);
      $("#search").on( "autocompleteselect", function( event, ui ) {});
    }
  });
});
