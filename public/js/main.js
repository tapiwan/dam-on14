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

    // SWITCH FOR LIST- AND BOX-VIEW
    var viewSwitch = new Vue({
        el: '[data-view-switch]',
        data: {
            views: ['collectionlist', 'collectionbox'],
            activeView: 'collectionlist'
        },

        methods: {
           switchView: function(newView) {
                //Check if given view parameter is allowed
                if(this.views.indexOf(newView) > -1) {
                    this.activeView = newView;
                    $('[data-collection]').toggleClass('collectionlist collectionbox col-md-12 col-md-3');
                }
           }
        }
    });
    

    // INSERT ASSETS IN COLLECTIONS
    $('[data-collection]').each(function() {
        var collectionID = $(this).data('collection-id');
        var collectionName = $(this).find('h3 .cname').text();
        var collectionAlias = collectionName.replace(/\s+/g, "");


        var collection = new Vue({
            el: '[data-collection-id="'+collectionID+'"]',
            data: {
                open: false,
                assets: null,
                collectionAlias: collectionAlias,
                fileClasses: fileClasses,
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
                deleteAsset: function (assetId) {

                    var that = this;

                   // SPÄTER VLLT DYNAMISCH
                    if (confirm('Are you sure you want to delete this?')) {

                        $.ajax({
                        method: "POST",
                        url: "/asset/delete",
                        data: {
                            _csrf : $(".csrf").val(),
                            assetID : assetId
                        }
                    })
                        .done(function(json) {
                            $.ajax({
                                method: "GET",
                                url: "/assets/" + collectionID
                            })
                                .done(function(json) {
                                    that.assets = json;
                                    that.collectionSize =  Object.keys(json).length;
                                    that.open = true;
                                });
                        });

                    }



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


    // ASSETS DETAILS
    if($("#asset").length>0){
        var asset = new Vue({
            el: '#asset',
            data: {
                collection: "",
                fileClasses: fileClasses,
            },

            mounted: function () {
                var that = this;
                var collectionID = $("#asset").data('collection-id');

                $.ajax({
                    method: "GET",
                    url: "/collections/getName/" + collectionID
                })
                    .done(function(json) {
                        that.collection = json;
                        that.collection.url = json.name.replace(/\s+/g, '')

                    });

            },
        });
    }





});


