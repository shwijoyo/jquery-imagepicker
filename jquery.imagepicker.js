(function ($) {
    $.fn.imagepicker = function (imgbbkey, callback = function (url) {}) {
        let Picker = (function () {
            function Picker(original) {
                this.$original = $(original);
                
                this.$main = $(`<div />`);
                this.$wrap = $(`<div />`);
                this.$file = $(`<input />`);
                this.$upload = $(`<input />`);
                this.$import = $(`<input />`);
                this.$prev = $("<input />");
                this.$next = $("<input />");
                this.$cancel = $("<input />");
                this.$list = $("<div />");
                this.initialize();
                this.event();
            }
            Picker.prototype = {
                data: [],
                page: 0,
                pagelast: 0,
                initialize: function () {
                    this.$main.css({position: `fixed`, top: `0px`, left: `0px`, width: `${$(window).width()}px`, height: `${$(window).height()}px`, backgroundColor: `#00000044`}).insertAfter(this.$original).hide();
                    this.$wrap.css({position: `relative`, width: `${$(window).width() - 20}px`, height: `${$(window).height() - 20}px`, backgroundColor: `#fefefe`, margin: `10px`}).appendTo(this.$main);
                    this.$upload.attr({type:`button`,value: `Upload image`}).css({position: `absolute`, top: `10px`, left: `10px`, width: `100px`, height: `40px`}).appendTo(this.$wrap);
                    this.$import.attr({type:`text`,placeholder: `Import image url...`}).css({position: `absolute`, top: `10px`, left: `110px`, width: `${$(window).width() - 140}px`, height: `40px`, padding: `0px 10px`}).appendTo(this.$wrap);
                    $(`<div />`).css({position: `absolute`, top: `50px`, left: `0px`, width: `100%`, height: `70px`}).append($(`<div />`).addClass(`gcse-search`)).appendTo(this.$wrap);
                    this.$prev.attr({type: `button`, value: `Prev`}).css({position: `absolute`, width: `90px`, height: `30px`, bottom: `10px`, left: `10px`}).appendTo(this.$wrap);
                    this.$next.attr({type: `button`, value: `Next`}).css({position: `absolute`, width: `90px`, height: `30px`, bottom: `10px`, left: `100px`}).appendTo(this.$wrap);
                    this.$cancel.attr({type: `button`, value: `Cancel`}).css({position: `absolute`, width: `90px`, height: `30px`, bottom: `10px`, right: `10px`}).appendTo(this.$wrap);
                    this.$list.css({position: `absolute`, width: `${$(window).width()-40}px`, height: `${$(window). height()-190}px`, top: `120px`, left: `10px`, overflowY: `scroll`}).append($(`<div />`).css({position: `absolute`, top: `0px`, left: `0px`, width: `${($(window).width() - 40) / 3}px`})).append($(`<div />`).css({position: `absolute`, top: `0px`, left: `${($(window).width() - 40) / 3}px`, width: `${($(window).width() - 40) / 3}px`})).append($(`<div />`).css({position: `absolute`, top: `0px`, left: `${(($(window).width() - 40) / 3) * 2}px`, width: `${($(window).width() - 40) / 3}px`})).appendTo(this.$wrap);
                    this.$file.attr({type:"file",accept:"image/*"}).hide();
                    
                    
                    this.data = window.localStorage.getItem(imgbbkey) !== null ? JSON.parse(window.localStorage.getItem(imgbbkey)) : this.data;

                    $.getScript("https://cse.google.com/cse.js?cx=d60776a4e66fa425e");
                },
                event: function () {
                	let picker = this;
                    let ti = undefined;
                    this.$original.on("click", function () {
                        picker.$main.show();
                        picker.render();
                    });
                   this.$upload.on("click", function () {
                        picker.$file.click();
                    });
                    this.$file.on("change", function () {
                        let form = new FormData();
                        form.append("image", this.files[0]);
                        const settings = {
                            url: `https://api.imgbb.com/1/upload?key=${imgbbkey}`,
                            method: "POST",
                            timeout: 0,
                            processData: false,
                            mimeType: "multipart/form-data",
                            contentType: false,
                            data: form,
                        };
                        $.ajax(settings).done(function (response) {
                            let res = JSON.parse(response);
                            res.success ? picker.data.unshift(res.data.url) : alert("failed upload...");
                            window.localStorage.setItem(imgbbkey, JSON.stringify(picker.data));
                            picker.render();
                        });
                        this.value = null;
                    });
                    this.$import.on("input", function () {
                        let url = this.value;
                        clearTimeout(ti);
                        ti = setTimeout(function () {
                            let image = new Image();
                            image.onload = function () {
                                if (this.width > 0) {
                                    picker.data.unshift(url);
                                    window.localStorage.setItem(imgbbkey, JSON.stringify(picker.data));
                                    picker.render();
                                }
                            };
                            image.onerror = function () {
                                console.log("image doesn't exist");
                            };
                            image.src = url;
                        }, 2000);
                    });
                    this.$prev.on("click", function () {
                        picker.page -= 1;
                        picker.render();
                    });
                    this.$next.on("click", function () {
                        picker.page += 1;
                        picker.render();
                    });
                    this.$cancel.on("click", function () {
                        picker.$main.css({ display: "none" });
                    });

                    $(document).on("click", "a.gs-previewLink, a.gs-previewVisit, a.gs-title, a.gs-image", function () {
                        this.removeAttribute("href");
                        this.removeAttribute("target");
                        if (this.className == "gs-previewLink") {
                            $("div.gsc-results-close-btn").click();
                            picker.data.unshift($(this).find("img").attr("src"));
                            window.localStorage.setItem(imgbbkey, JSON.stringify(picker.data));
                            picker.render();
                            console.log($(this).find("img").attr("src"));
                        }
                    });
                },
                render: function () {
                	let picker = this;
                    this.pagelast = (this.data.length + (24 - (this.data.length % 24))) / 24 - 1;
                    this.$list.children().html(``);
                    this.page == 0 ? this.$prev.attr("disabled", true) : this.$prev.removeAttr("disabled");
                    this.page == this.pagelast ? this.$next.attr("disabled", true) : this.$next.removeAttr("disabled");
                    let dataslice = this.data.slice(this.page * 24, this.page * 24 + 24);
                    $.each(dataslice, function (i, v) {
                        let $img = $(`<img alt="image-${i}" loading="lazy" src="${v}" style="margin: 2px; width: 100%; height: auto" />`).on("click", function () {
                            picker.$original.val(this.src);
                            callback(this.src);
                            picker.$main.css({ display: "none" });
                        });
                        if (i % 3 == 0) {
                            picker.$list.children().eq(0).append($img);
                        } else if (i % 3 == 1) {
                            picker.$list.children().eq(1).append($img);
                        } else if (i % 3 == 2) {
                            picker.$list.children().eq(2).append($img);
                        }
                    });
                },
            };
            return Picker;
        })();
        return this.each(function (){
        	new Picker(this);
        	});
    };
})(jQuery);
