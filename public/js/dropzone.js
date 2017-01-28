

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

            if($(".file-row").length == $(".start").length-1){
                $(".buttonArea .start").fadeOut();
            }

            $(".upload-area").removeClass('uploadImage');
            $(".cancel").fadeIn();

            file.previewElement.querySelector("select").onchange = function () {
                $(this).closest("div").parent().find(".buttons").find(".start").fadeIn()


                if($(".file-row").length == $(".start").length-1){
                    $(".buttonArea .start").show();
                }
            };

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

            var e = file.previewElement.querySelector("#sel1");
            var collection = e.options[e.selectedIndex].dataset.id

            // ADD DATA TO POST
            formData.append("collection", collection);

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