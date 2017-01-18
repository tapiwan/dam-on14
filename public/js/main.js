$(document).ready(function() {

    $('[data-collection]').each()
    var collection = new Vue({
    el: '[data-collections]',
    data: {
        open: false
    },
    methods: {
      loadAssets: function (collectionId) {
          var that = this;

          if(!that.open) {
              $.ajax({
                    method: "GET",
                    url: "/assets/" + collectionId
                })
                .done(function(json) {
                    console.log(json);
                    that.open = true;
                });
          }
          else {
              that.open = false;
          }

      }
    }
  })

});
