$("#savingInfo").click(function() {
    var validateShowError = NY.validater.validateShowError;
    var clearValidateError = NY.validater.clearValidateError;

    var visibleInputSelector = "input[type=text]:visible";
    var $_workorderApplyForm = $("#verifyProfileForm");
    var $_visibleInputs = $_workorderApplyForm.find(visibleInputSelector);
    var $_textarea = $_workorderApplyForm.find("textarea");
    clearValidateError($_workorderApplyForm);
    // 前端表单验证
    var isWorkorderFilled = true;
    $_visibleInputs.each(function() {
        var $_self = $(this);
        if (!$_self.val()) {
            validateShowError($_self, "该项不能为空", $_workorderApplyForm);
            isWorkorderFilled = false;
            return false;
        }
    });

    if (!$_textarea.val()) {
        validateShowError($_textarea, "该项不能为空", $_workorderApplyForm);
        isWorkorderFilled = false;
        return false;
    }

    if (isWorkorderFilled) {
        //todo
    }
})
// 
// <form id="verifyProfileForm" action="save.html" class="form-horizontal ny-form ny-tab-container margin-bottom-60">
//     <div class="form-group">
//         <div class="col-xs-8 ny-form-control clearfix">
//             <div class="pull-left preview-container">
//                 <div class="upload-attachment-back clearfix">
//                     <img id="previewImgBack" class="attachment-img" src="{{if verifyAdd.userPic2}}{{verifyAdd.userPic2 | getUploadFileUrl}}{{else}}{{common.domain.static}}/img/ucModule/verify/placehold-img.png{{/if}}" alt="">
//                     <span class="upload-reminder default-transition">点击上传附件</span>
//                     <span class="loading-cover"></span>
//                 </div>
//             </div>
//             <div class="pull-left img-reminder-box">
//                 <div class="input-reminder img-reminder tab-relate-1">JPG或PNG格式，文件大小不超过{{common.uploadMaxSize}}MB，<a class="text-stress" href="{{common.domain.static}}/img/ucModule/verify/example_id_back.png" data-lightbox="id-card-back">示例：身份证反面.png</a></div>
//                 <input type="button" class="ny-btn btn-primary btn-reverse upload-attachment-back" value="上传附件">
//                 <div class="error-reminder" id="subAttachmentErrorReminder"></div>
//             </div>
//         </div>
//     </div>
//     <div class="form-group">
//         <div class="ny-control-label ny-label-long">
//             &nbsp;
//         </div>
//         <div class="col-xs-8 ny-form-control">
//             <div class="hide">
                
//                 <input type="text" name="attachments1" value="{{verifyAdd.userPic1}}" id="identifyImg1">
//                 <input type="text" name="attachments2" value="{{verifyAdd.userPic2}}" id="identifyImg2">
//             </div>
//             <a href="#a_null" class="ny-btn btn-strong" id="submitVerify">提交审核</a>
//         </div>
//     </div>
// </form>

var initPlUpload = function(browseButton, previewImg, inputToFill) {
    var $_previewImg = $(previewImg);
    var $_browseButton = $(browseButton);

    $_browseButton.each(function() {
        var $_previewImgParent = $_previewImg.parents(".preview-container");
        var $_errorReminder = $_previewImg.parents(".ny-form-control").find(".error-reminder");
        var $_uploadReminder = $_previewImgParent.find(".upload-reminder");
        var uploader = NY.plupload.createUploader({
            // 认证附件专用上传地址
            url: "/user/upload?attachments_type=2",
            // this为browseButton集合中的元素
            browse_button: this,
            filters: {
                max_file_size: nyData.common.uploadMaxSize + "mb"
            },
            // 监听添加文件的事件
            onFilesAdded: function(uploader, file) {
                $_browseButton.attr("disabled", true);
                $_errorReminder.empty();
                // 显示loading gif，并显示上传中提示语
                $_previewImgParent.addClass("loading-show");
                $_previewImgParent.find(".upload-reminder").html("上传中").addClass("upload-loading");
            },
            // 进行中的事件
            onUploadProgress: function(uploader, file) {},
            // 上传完成回调
            onFileUploaded: function(responseJSON, uploader, file, responseObject) {
                $_previewImgParent.removeClass("loading-show");
                $_browseButton.attr("disabled", false);
                if (responseJSON.result) {
                    // 展示缩略图，替换为返回的图片地址
                    NY.plupload.previewImage(file, function(imgsrc) {
                        $_previewImg.attr("src", imgsrc);
                    }, {
                        // ie8使用在线地址进行预览
                        unpreviewCallback: function(file) {
                            $_previewImg.attr("src", NY.constant.UPLOAD_FILE_IMG_PREFIX + responseJSON.url);
                        }
                    });
                    $_uploadReminder.html("更换图片").removeClass("upload-loading");
                    $_errorReminder.empty();
                    // 填写表单
                    $(inputToFill).val(responseJSON.url);
                } else {
                    $_errorReminder.html(responseJSON.text);
                    $_uploadReminder.html("重新上传");
                }

            }
        });
        // 上传错误回调（500）
        uploader.bind("Error", function(uploader, errObject) {
            $_browseButton.attr("disabled", false);
            $_previewImgParent.removeClass("loading-show");
            $_uploadReminder.html("重新上传");
            // 提示 繁忙
            $_errorReminder.html(NY.constant.UPLOAD_FILE_ERROR_TEXT);
        });
    });

};

initPlUpload(".upload-attachment-back", "#previewImgBack", "#identifyImg2");
