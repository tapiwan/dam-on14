$(document).ready(function() {

    $('[data-collection]').each(function() {
        var collectionID = $(this).data('collection-id');
        var collectionName = $(this).find('h3').text();

        var collection = new Vue({
            el: '[data-collection-id="'+collectionID+'"]',
            data: {
                open: false,
                assets: null,
                collectionSize:  null,
            },
            methods: {
                editCollection: function () {
                    $("form #collectionIDName").val(collectionID);
                    $("form #collectionName").val(collectionName);
                },
                deleteCollection: function () {
                    $("form #collectionID").val(collectionID);

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
