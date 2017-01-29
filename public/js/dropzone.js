

$(document).ready(function() {




    if(document.querySelector("#template")) {




        var previewNode = document.querySelector("#template");
        previewNode.id = "";
        var previewTemplate = previewNode.parentNode.innerHTML;
        previewNode.parentNode.removeChild(previewNode);

        var myDropzone = new Dropzone(document.body, {
            url: "/upload/assets",
            paramName: 'assets',
            maxFilesize: 200, // MB
            maxFiles: 10,
            dictDefaultMessage: 'Drag a file here to upload, or click to select one',
            headers: {
                'x-csrf-token': document.querySelectorAll('meta[name=csrf-token]')[0].getAttributeNode('content').value,
            },
            thumbnailWidth: 80,
            thumbnailHeight: 80,
            parallelUploads: 20,
            previewTemplate: previewTemplate,
            autoQueue: false,
            previewsContainer: "#previews",
            clickable: ".fileinput-button"
        });

        // ON FILE ADD
        myDropzone.on("addedfile", function (file) {
            var type = file.type.split('/');
            type = type;
            file.filetype = fileTypes[type[1]];


            // HANDLE THUMBNAIL
            if(type[0] != "image") {
                if(fileClasses[type[1]] == undefined) {
                    file.previewElement.querySelector("[data-dz-thumbnail]").parentNode.innerHTML= "<i class='fa fa-4x "+fileClasses.default+"'></i>";

                }
                else {
                    file.previewElement.querySelector("[data-dz-thumbnail]").parentNode.innerHTML= "<i class='fa fa-4x "+fileClasses[type[1]]+"'></i>";
                }

            }
            else {
                if(fileClasses[type[1]] == undefined) {
                    file.previewElement.querySelector("[data-dz-thumbnail]").parentNode.innerHTML= "<i class='fa fa-4x "+fileClasses.default+"'></i>";

                }
            }

            // HANDLE UPLOAD BUTTONS
            if($(".file-row").length == $(".start").length-1){
                $(".buttonArea .start").fadeOut();
            }

            $(".upload-area").removeClass('uploadImage');
            $(".cancel").fadeIn();



            // TAGS
            file.previewElement.querySelector(".showTags").onclick = function () {
                $(this).next(".tagsArea").tagsinput({
                    confirmKeys: [13, 32, 44],


                });
                $(".bootstrap-tagsinput input").attr("placeholder", "Add a tag");


                if( $(this).next().css("display") == "block") {
                    $(this).next().fadeOut();
                    $(this).removeClass("fa-times");
                    $(this).addClass("fa-tags");
                }
                else {
                    $(this).next().fadeIn();
                    $(this).addClass("fa-times");
                    $(this).removeClass("fa-tags");
                }





            };

            // GET COLLECTION
            file.previewElement.querySelector("select").onchange = function () {
                $(this).closest("div").parent().find(".buttons").find(".start").fadeIn()


                // HIDE TAGS IF OPEN
                if( $(this).closest("div").prev().find(".bootstrap-tagsinput").css("display") == "block") {
                    $(this).closest("div").prev().find(".showTags").click();

                }


                // SHOW / HIDE UPLOAD ALL BUTTON
                if($(".file-row").length == $(".start").length-1){

                    if($(".selectCollection option:selected:disabled").length != 0 )
                    {
                        $(".buttonArea .start").hide();
                    }
                    else {
                        $(".buttonArea .start").show();

                    }

                }
            };

            // START UPLOAD
            file.previewElement.querySelector(".start").onclick = function () {
                myDropzone.enqueueFile(file);
            };
        });

        // ON FILE REMOVE
        myDropzone.on("removedfile", function () {
           if(myDropzone.files.length == 0){
               $(".start, .cancel").fadeOut();
               $(".upload-area").addClass('uploadImage');
           }

        });

        // DISBALE BUTTONS AFTER UPLOAD
        myDropzone.on("sending", function (file, xhr, formData) {

            // GET COLLECTIONS
            var e = file.previewElement.querySelector("#sel1");
            var collection = e.options[e.selectedIndex].dataset.id;
            file.previewElement.querySelector(".selectCollection").innerHTML = "<strong>Collection:</strong><br><a href='collections#"+e.options[e.selectedIndex].value+"'>"+e.options[e.selectedIndex].value+"</a>";;

            // GET TAGS
            var tags = file.previewElement.querySelector('.tagsArea').value;
            if(tags) {
                file.previewElement.querySelector('.tags').innerHTML = "<strong>Tags:</strong><br>"+tags;
            }
            else {
                file.previewElement.querySelector('.tags').innerHTML = "<strong>Tags:</strong><br>No Tags";

            }

            // SEND TYPE

            // ADD DATA TO POST
            formData.append("collection", collection);
            if(tags){
                formData.append("tags", tags);

            }
            formData.append("filetype", file.filetype);


            file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");
            file.previewElement.querySelector(".start").textContent="Uploaded";
        });

        // UPLOAD SUCESS
        myDropzone.on("complete", function (file) {
            file.previewElement.querySelector(".start").textContent="File has been uploaded";
            file.previewElement.querySelector(".cancel").remove();
            setTimeout(function () {
                file.previewElement.querySelector(".progress").remove();
            },2000)


        });

        // UPLOAD ALL
        document.querySelector("#actions .start").onclick = function () {
            myDropzone.enqueueFiles(myDropzone.getFilesWithStatus(Dropzone.ADDED));
        };

        // CANCEL ALL
        document.querySelector("#actions .cancel").onclick = function () {
            myDropzone.removeAllFiles(true);
            $(".upload-area").addClass('uploadImage');
            $(".start, .cancel").fadeOut();



        };
    }


});