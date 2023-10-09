(function ($) {
    $.fn.imagepicker = function (options) {
        let settings = $.extend(
            {
                pageat: 0,
                imgbbapi: `9521afb2ee621053417d7b530c6e976a`,
                onPick: (imgurl) => {
                    console.log(imgurl);
                },
            },
            options
        );
        let file = undefined;
        let $this = $(this).attr({ placeholder: $(this).attr("placeholder") != undefined ? $(this).attr("placeholder") : "Select Image", "data-bs-toggle": "modal", "data-bs-target": `#${$(this).attr("id")}-imagepicker` });
        let id = `${$this.attr("id")}-imagepicker`;
        let $main = $(`<div />`).addClass(`modal fade`).attr({ id: id, tabindex: "-1" });
        let element = () => {
            return `
<div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-5">${$this.attr("placeholder")}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <nav>
                <div class="nav nav-tabs" role="tablist">
                    <button class="nav-link active" data-bs-toggle="tab" data-bs-target=".${id}-upload" type="button" role="tab">Upload</button>
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target=".${id}-import" type="button" role="tab">Import</button>
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target=".${id}-gse" type="button" role="tab">Google image</button>
                </div>
            </nav>
            <div class="tab-content mb-2">
                <div class="tab-pane fade show active p-2 ${id}-upload" role="tabpanel" tabindex="0">
                    <div class="input-group input-group-sm">
                        <input type="file" class="form-control" />
                        <button class="btn btn-primary upload" type="button">Upload</button>
                    </div>
                </div>
                <div class="tab-pane fade p-2 ${id}-import" role="tabpanel" tabindex="0">
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control" placeholder="Url" />
                        <button class="btn btn-primary import" type="button">Import</button>
                    </div>
                </div>
                <div class="tab-pane fade ${id}-gse" role="tabpanel" tabindex="0">
                    <div class="gcse-search"></div>
                </div>
            </div>
            <div class="container text-center">
                <div class="row align-items-start">
                    <div class="col"></div>
                    <div class="col"></div>
                </div>
            </div>
        </div>

        <div class="modal-footer">
            <nav>
                <ul class="pagination pagination-sm"></ul>
            </nav>
        </div>
    </div>
</div>

		`;
        };

        let render = () => {
            let $pagination = $main.find(".pagination");
            let data = [];
            $main.find("div.col").empty();
            if (localStorage.getItem(id) != null) {
                data = JSON.parse(localStorage.getItem(id));
            }
            let datashow = data.slice(settings.pageat * 10, settings.pageat * 10 + 10);
            $.each(datashow, (i, v) => {
                if (i % 2 == 0) {
                    $main.find("div.col").eq(0).append(`
				<img src="${v}" class="img-fluid img-thumbnail mb-3" data-bs-dismiss="modal" loading="lazy" />
				`);
                } else {
                    $main.find("div.col").eq(1).append(`
				<img src="${v}" class="img-fluid img-thumbnail mb-3" data-bs-dismiss="modal" loading="lazy" />
				`);
                }
            });
            let pagelast = (data.length + (10 - (data.length % 10))) / 10 - 1;
            $pagination.empty();
            if (pagelast <= 4) {
                for (var i = 0; i <= pagelast; i++) {
                    $pagination.append(`<li class="page-item"><button class="page-link ${settings.pageat == i ? "active" : ""}" value="${i}">${i + 1}</button></li>`);
                }
            } else {
                if (settings.pageat < 4) {
                    for (var i = 0; i < 5; i++) {
                        $pagination.append(`<li class="page-item"><button class="page-link ${settings.pageat == i ? "active" : ""}" value="${i}">${i + 1}</button></li>`);
                    }
                    $pagination.append(`<li class="page-item"><button class="page-link" value="${pagelast}">&raquo; ${pagelast + 1}</button></li>`);
                } else if (settings.pageat >= pagelast - 3) {
                    $pagination.append(`<li class="page-item"><button class="page-link" value="1">1 &laquo;</button></li>`);
                    for (var i = pagelast - 4; i <= pagelast; i++) {
                        $pagination.append(`<li class="page-item"><button class="page-link ${settings.pageat == i ? "active" : ""}" value="${i}">${i + 1}</button></li>`);
                    }
                } else {
                    $pagination.append(`<li class="page-item"><button class="page-link" value="1">1 &laquo;</button></li>`);

                    for (var i = settings.pageat - 2; i < settings.pageat + 3; i++) {
                        $pagination.append(`<li class="page-item"><button class="page-link ${settings.pageat == i ? "active" : ""}" value="${i}">${i + 1}</button></li>`);
                    }

                    $pagination.append(`<li class="page-item"><button class="page-link" value="${pagelast}">&raquo; ${pagelast + 1}</button></li>`);
                }
            }
            $main.find(".page-link").on("click", function () {
                settings.pageat = Number(this.value);
                render();
            });
            $main.find("img.img-fluid").on("click", function () {
                $this.val($(this).attr("src"));
                settings.onPick($(this).attr("src"));
            });
        };
        let store = (imgurl) => {
            let data = [];
            if (localStorage.getItem(id) != null) {
                data = JSON.parse(localStorage.getItem(id));
            }
            data.unshift(imgurl);
            data = [...new Set(data)]
            localStorage.setItem(id, JSON.stringify(data));
        };
        let event = () => {
            $.getScript("https://cse.google.com/cse.js?cx=d60776a4e66fa425e");
            $(document).on("click", "a.gs-previewLink, a.gs-previewVisit, a.gs-title, a.gs-image", function () {
                this.removeAttribute("href");
                this.removeAttribute("target");
                if (this.className == "gs-previewLink") {
                    store($(this).find("img").attr("src"));
                    render();
                    $("div.gsc-results-close-btn").click();
                }
            });

            $main.find("input[type='file']").on("change", function () {
                file = this.files[0];
            });
            $main.find("button.upload").on("click", () => {
                let form = new FormData();
                form.append("image", file);
                const setting = {
                    url: `https://api.imgbb.com/1/upload?key=${settings.imgbbapi}`,
                    method: "POST",
                    timeout: 0,
                    processData: false,
                    mimeType: "multipart/form-data",
                    contentType: false,
                    data: form,
                    error: () => {
                        alert("upload failed");
                    },
                };
                $.ajax(setting).done((response) => {
                    $main.find("input[type='file']").val(null);
                    let res = JSON.parse(response);
                    if (res.success) {
                        store(res.data.url);
                        render();
                    } else {
                        alert("upload failed");
                    }
                });
            });

            $main.find("button.import").on("click", () => {
                let imp = $main.find("input.form-control[type='text']");
                let image = new Image();
                image.onload = function () {
                    if (this.width > 0) {
                        store(imp.val());
                        render();
                        imp.val(null);
                    }
                };
                image.onerror = function () {
                    alert("image doesn't exist");
                    imp.val(null);
                };
                image.src = imp.val();
            });
        };
        (() => {
            $("body").append($main.append(element()));
            event();
            render();
        })();
        return this;
    };
})(jQuery);
