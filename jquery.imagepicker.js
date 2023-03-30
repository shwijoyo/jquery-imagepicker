(function ($) {
    $.fn.imagepicker = function (imgbbkey, callback = function (url) {}) {
        let Picker = (function () {
            function Picker(original) {
                this.$original = $(original);
                this.$main = $(`
				<div style="position: fixed; top: 0px; left: 0px; width: ${$(window).width()}px; height: ${$(window).height()}px; background-color: #00000044">
				<div style="position: relative; width: ${$(window).width() - 20}px; height: ${$(window).height() - 20}px; background-color: #fefefe; margin: 10px;">
				<input type="button" value="Upload image" style="position: absolute; top: 10px; left: 10px; width: 100px; height: 40px;" />
				<input type="text" placeholder="Import image url..." style="position: absolute; top: 10px; left: 110px; width: ${$(window).width() - 140}px; height: 40px; padding: 0px 10px" />
				<input type="button" value="Previous" style="position: absolute; width: 90px; height: 30px; bottom: 10px; left: 10px;"/>
		<input type="button" value="Next" style="position: absolute; width: 90px; height: 30px; bottom: 10px; left: 100px;"/>
		<input type="button" value="Cancel" style="position: absolute; width: 90px; height: 30px; bottom: 10px; right: 10px;"/>
				<div style="position: absolute; top: 50px; left: 0px; width: 100%; height: 70px;">
				<div class="gcse-search"></div>
				</div>
				<div style="position: absolute; top: 120px; left: 10px; width: ${$(window).width() - 40}px; height: ${$(window).height() - 190}px; overflow-y: scroll">
				<div class="list" style="position: absolute; top: 0px; left: 0px; width: ${($(window).width() - 40) / 3}px;" ></div>
				<div class="list" style="position: absolute; top: 0px; left: ${($(window).width() - 40) / 3}px; width: ${($(window).width() - 40) / 3}px;" ></div>
				<div class="list" style="position: absolute; top: 0px; left: ${(($(window).width() - 40) / 3) * 2}px; width: ${($(window).width() - 40) / 3}px;" ></div>
				</div>
				
				
				</div>
				</div>
				`);
                this.$file = $(`<input type="file" accept="image/*" style="display: none"/>`);
                this.$list = this.$main.find(".list");
                this.$import = this.$main.find("input[type=text]").eq(0);
                this.$upload = this.$main.find("input[type=button]").eq(0);
                this.$prev = this.$main.find("input[type=button]").eq(1);
                this.$next = this.$main.find("input[type=button]").eq(2);
                this.$cancel = this.$main.find("input[type=button]").eq(3);
                this.initialize();
                this.event();
            }
            Picker.prototype = {
                data: [],
                page: 0,
                pagelast: 0,
                initialize: function () {
                    this.$main.css({ display: "none" });
                    this.$original.after(this.$main);
                    this.data = window.localStorage.getItem(imgbbkey) !== null ? JSON.parse(window.localStorage.getItem(imgbbkey)) : this.data;

                    $.getScript("https://cse.google.com/cse.js?cx=d60776a4e66fa425e");
                },
                event: function () {
                    let ti = undefined;
                    this.$original.on("click", function () {
                        picker.$main.css({ display: "block" });
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
                    this.pagelast = (this.data.length + (24 - (this.data.length % 24))) / 24 - 1;
                    this.$list.html(``);
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
                            picker.$list.eq(0).append($img);
                        } else if (i % 3 == 1) {
                            picker.$list.eq(1).append($img);
                        } else if (i % 3 == 2) {
                            picker.$list.eq(2).append($img);
                        }
                    });
                },
            };
            return Picker;
        })();
        let picker = new Picker(this);
        return this;
    };
})(jQuery);
