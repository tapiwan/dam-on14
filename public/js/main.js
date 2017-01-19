$(document).ready(function() {

    $('[data-collection]').each(function() {
        var collectionID = $(this).data('collection-id');

        var collection = new Vue({
            el: '[data-collection-id="'+collectionID+'"]',
            data: {
                open: false,
                assets: null,
                collectionSize:  null,
            },
            methods: {
                deleteCollection: function () {

                    $.ajax({
                        method: "POST",
                        url: "/collections/delete",
                        data: {
                            _csrf: $(".csrf").val(),
                            collectionID : collectionID}
                    }).done(function() {
                        location.reload();
                    });
                },
                loadAssets: function() {
                    var that = this;

                    if (!that.open) {
                        $.ajax({
                                method: "GET",
                                url: "/assets/" + collectionID
                            })
                            .done(function(json) {
                                that.assets = json;
                                that.collectionSize =  Object.keys(json).length;
                                that.open = true;
                            });
                    } else {
                        that.open = false;
                    }

                }
            }
        });
    });

});
