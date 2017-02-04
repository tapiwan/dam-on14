$(document).ready(function () {

    // SCROLL TO COLLECTION IF HASH IS AVAILABLE
    var hash = window.location.hash;
    if (hash) {

        setTimeout(function () {
            $(hash + ' h3').click();
        }, 0)

    }

    // SEARCH
    if ($('[data-search]').length) {
        var searchInput = new Vue({
            el: '[data-search]',
            data: {
                query: '',
                placeholder: 'Search',
                collections: [],
                assets: [],
                fileIcons: fileIcons
            },

            methods: {
                search: function () {
                    if(this.query.length > 0) {
                        this.searchCollections();
                        this.searchAssets();
                        $('.panel-search').slideDown();
                    }
                    else {
                        this.collections = [];
                        this.assets = [];
                        $('.panel-search').slideUp();
                    }
                },

                searchCollections: function() {
                    var that = this;

                    $.ajax({
                        method: "GET",
                        url: "/searchCollections/" + encodeURIComponent(that.query)
                    })
                    .done(function(json) {
                        that.collections = json;
                    });
                },

                searchAssets: function() {
                    var that = this;

                    $.ajax({
                        method: "GET",
                        url: "/searchAssets/" + encodeURIComponent(that.query)
                    })
                    .done(function(json) {
                        that.assets = json;
                    });
                },

                noSpaces: function(string) {
                    return string.replace(/\s+/g, '')+"";
                }
            }
        });
    }

    //DASHBOARD COLLECTIONS
    if($('[data-dashboard-collections]').length) {
        var dashboardCollections = new Vue({
            el: '[data-dashboard-collections]',
            data: {
                collections: []
            },
            mounted: function() {
                this.getCollections();
            },
            methods: {
                getCollections: function() {
                    var that = this;

                    $.ajax({
                        method: "GET",
                        url: "/getCollections"
                    })
                        .done(function(json) {
                            that.collections = json;
                        });
                },
                getDateFormatted: function(date) {
                    var d = new Date(date);

                    return d.getDay()+'.'+d.getMonth()+'.'+d.getFullYear();
                },
                noSpaces: function(string) {
                    return string.replace(/\s+/g, '')+"";
                }
            }
        });
    }

    //DASHBOARD ACTIVITY
    if($('[data-dashboard-activity]').length) {
        var dashboardActivity = new Vue({
            el: '[data-dashboard-activity]',
            data: {
                activities: []
            },
            mounted: function() {
                this.getActivities();
            },
            methods: {
                getActivities: function() {
                    var that = this;

                    $.ajax({
                        method: "GET",
                        url: "/getActivities"
                    })
                        .done(function(json) {
                            that.activities = json;
                        });
                },
                getDateFormatted: function(date) {
                    var d = new Date(date);

                    return d.getDay()+'.'+d.getMonth()+'.'+d.getFullYear();
                }
            }
        });
    }

    // MODAL INPUT FOCUS
    $('#editCollection, #addCollection').on('shown.bs.modal', function () {
        $(this).find('input').focus();
    });

    // COLLAPSE
    $('#collections').on('show.bs.collapse', function () {
        $('#collections .in').collapse('hide');
    });

    // SWITCH FOR LIST- AND BOX-VIEW
    if ($('[data-view-switch]').length) {
        var viewSwitch = new Vue({
            el: '[data-view-switch]',
            data: {
                views: ['collectionlist', 'collectionbox'],
                activeView: 'collectionlist'
            },

            mounted: function () {
                var activeViewState = localStorage.getItem('activeView');

                if (activeViewState.length) {
                    this.switchView(activeViewState);
                }
            },

            methods: {
                switchView: function (newView) {
                    //Check if given view parameter is allowed
                    if (this.views.indexOf(newView) > -1) {
                        var collections = $('[data-collection]');
                        this.activeView = newView;
                        localStorage.setItem('activeView', newView);

                        if (newView == 'collectionlist') {
                            collections.removeClass('collectionbox col-md-3');
                            collections.addClass('collectionlist col-md-12');
                        }
                        else if (newView == 'collectionbox') {
                            collections.addClass('collectionbox col-md-3');
                            collections.removeClass('collectionlist col-md-12');
                        }
                    }
                }
            }
        });
    }

    // INSERT ASSETS IN COLLECTIONS
    $('[data-collection]').each(function () {
        var collectionID = $(this).data('collection-id');
        var collectionName = $(this).find('h3 .cname').text();
        var collectionAlias = collectionName.replace(/\s+/g, "");


        var collection = new Vue({
            el: '[data-collection-id="' + collectionID + '"]',
            data: {
                open: false,
                assets: null,
                collectionAlias: collectionAlias,
                fileClasses: fileClasses,
                collectionSize: null,
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
                                _csrf: $(".csrf").val(),
                                assetID: assetId
                            }
                        })
                            .done(function (json) {
                                $.ajax({
                                    method: "GET",
                                    url: "/assets/" + collectionID
                                })
                                    .done(function (json) {
                                        that.assets = json;
                                        that.collectionSize = Object.keys(json).length;
                                        that.open = true;
                                    });
                            });

                    }


                },

                loadAssets: function () {
                    var that = this;

                    if (!that.open) {
                        $.ajax({
                            method: "GET",
                            url: "/assets/" + collectionID
                        })
                            .done(function (json) {
                                that.assets = json;
                                that.collectionSize = Object.keys(json).length;
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
    if ($("#asset").length > 0) {
        var asset = new Vue({
            el: '#asset',
            data: {
                curCollection: "",
                collections: "",
                settings: "",
                fileClasses: fileClasses,
            },

            mounted: function () {
                var that = this;
                var collectionID = $("#asset").data('collection-id');

                $.ajax({
                    method: "GET",
                    url: "/collections/getName/" + collectionID
                }).done(function(json) {
                        that.curCollection = json;
                        that.curCollection.url = json.name.replace(/\s+/g, '')

                });

                $.ajax({
                    method: "GET",
                    url: "/json/settings/"
                }).done(function(json) {
                    that.settings = json[0].dimensions;

                });
            },

            methods: {
                loadCollections: function () {
                    var that = this;

                    $.ajax({
                        method: "GET",
                        url: "/get/collections/"
                    })
                        .done(function(json) {
                            that.collections = json;
                        });
                }
            }
        });
    }


});


