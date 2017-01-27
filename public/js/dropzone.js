$(document).ready(function() {





    if(document.querySelector("#template")) {

        var previewNode = document.querySelector("#template");
        previewNode.id = "";
        var previewTemplate = previewNode.parentNode.innerHTML;
        previewNode.parentNode.removeChild(previewNode);

        var myDropzone = new Dropzone(document.body, { // Make the whole body a dropzone
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
                    file.previewElement.querySelector("[data-dz-type]").className= "label label-primary fa "+fileClasses.default;

                }
                else {
                    file.previewElement.querySelector("[data-dz-thumbnail]").parentNode.innerHTML= "<i class='fa fa-4x "+fileClasses[type[1]]+"'></i>";
                    file.previewElement.querySelector("[data-dz-type]").className= "label label-primary fa "+fileClasses[type[1]];
                }



            }
            else {
                if(fileClasses[type[1]] == undefined) {
                    file.previewElement.querySelector("[data-dz-thumbnail]").parentNode.innerHTML= "<i class='fa fa-4x "+fileClasses.default+"'></i>";
                    file.previewElement.querySelector("[data-dz-type]").className= "label label-primary fa "+fileClasses.default;

                }
                else {
                    file.previewElement.querySelector("[data-dz-type]").className= "label label-primary fa "+fileClasses[type[1]];

                }

            }





            $(".upload-area").removeClass('uploadImage');
            $(".start, .cancel").fadeIn();

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
        myDropzone.on("sending", function (file) {
            file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");
        });

        // UPLOAD SUCESS
        myDropzone.on("queuecomplete", function (progress) {


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
            console.log("remove")



        };
    }


});