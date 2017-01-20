$(document).ready(function() {

    // SCROLL TO COLLECTION IF HASH IS AVAILABLE
    var hash = window.location.hash;
    if(hash) {
        $('html, body').animate({
            scrollTop: $(hash).offset().top+300
        }, 1000);


        setTimeout(function () {
            $(hash + ' h3').click();
        }, 1100)

    }

    // MODAL INPUT FOCUS
    $('#editCollection, #addCollection').on('shown.bs.modal', function () {
        $(this).find('input').focus();
    })

    // COLLAPSE
    $('#collections').on('show.bs.collapse', function () {
        $('#collections .in').collapse('hide');
    });






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

            mounted: function () {


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


