(function ($) {
	$.fn.imagepicker = function (options) {
		let settings = $.extend({
			pageat: 0,
			imgbbapi: `9521afb2ee621053417d7b530c6e976a`,
			onPick: (imgurl)=>{console.log(imgurl)}
			}, options);
		$(this).attr({
		"placeholder":($(this).attr('placeholder')!=undefined)?$(this).attr('placeholder'):"Select font",
		"data-bs-toggle":"modal",
		"data-bs-target":`#${$(this).attr('id')}-imagepicker`
		});
	$("body").append(`
	<div class="modal fade" id="${$(this).attr('id')}-imagepicker" tabindex="-1" aria-labelledby="${$(this).attr('id')}-imagepicker-label" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5">${$(this).attr('placeholder')}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
<nav>
  <div class="nav nav-tabs" role="tablist">
    <button class="nav-link active " data-bs-toggle="tab" data-bs-target="#${$(this).attr('id')}-imagepicker-upload" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Upload</button>
    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#${$(this).attr('id')}-imagepicker-import" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Import</button>
    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#${$(this).attr('id')}-imagepicker-gse" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Google image</button>
    
  </div>
</nav>
<div class="tab-content mb-2">
  <div class="tab-pane fade show active p-2" id="${$(this).attr('id')}-imagepicker-upload" role="tabpanel" tabindex="0">
  
  <div class="input-group input-group-sm">
  
  <input type="file" class="form-control">
  <button class="btn btn-primary upload" type="button">Upload</button>
</div>

</div>
  <div class="tab-pane fade p-2" id="${$(this).attr('id')}-imagepicker-import" role="tabpanel" tabindex="0">
  <div class="input-group input-group-sm">
  
  <input type="text" class="form-control" placeholder="Url">
  <button class="btn btn-primary import" type="button">Import</button>
</div>
</div>
  <div class="tab-pane fade" id="${$(this).attr('id')}-imagepicker-gse" role="tabpanel" tabindex="0">
<div class="gcse-search"></div>
</div>
</div>

<div class="container text-center">
  <div class="row align-items-start">
    <div class="col">
      </div>
    <div class="col">
      </div>
  </div>
</div>
      </div>
      
      <div class="modal-footer">
 <nav>
  <ul class="pagination pagination-sm">
    
  </ul>
</nav>
      </div>
    </div>
  </div>
</div>
	`);
	let $this = this;
	let $pagination = $(`#${$(this).attr("id")}-imagepicker`).find(".pagination");
	let render = ()=>{
		let data = [];
		$(`#${$(this).attr("id")}-imagepicker`).find("div.col").empty();
		if(localStorage.getItem(`#${$(this).attr("id")}-imagepicker`) != null){
				data = JSON.parse(localStorage.getItem(`#${$(this).attr("id")}-imagepicker`));
				}
		let datashow = data.slice(settings.pageat*10, settings.pageat*10+10);
		$.each(datashow, (i, v)=>{
			if(i%2 == 0){
				$(`#${$(this).attr("id")}-imagepicker`).find("div.col").eq(0).append(`
				<img src="${v}" class="img-fluid img-thumbnail mb-3" data-bs-dismiss="modal" loading="lazy" />
				`);
				}
			else{
				$(`#${$(this).attr("id")}-imagepicker`).find("div.col").eq(1).append(`
				<img src="${v}" class="img-fluid img-thumbnail mb-3" data-bs-dismiss="modal" loading="lazy" />
				`);
				}
			});
			let pagelast = (data.length+ (10 - (data.length % 10))) / 10 - 1;
		$pagination.empty();
                if (pagelast <= 4) {
                    for (var i = 0; i <= pagelast; i++) {
                        $pagination.append(`<li class="page-item"><button class="page-link ${(settings.pageat==i)?'active':''}" value="${i}">${i+1}</button></li>`);
                    }
                }
                else {
                    if (settings.pageat < 4) {
                        for (var i = 0; i < 5; i++) {
                            $pagination.append(`<li class="page-item"><button class="page-link ${(settings.pageat==i)?'active':''}" value="${i}">${i+1}</button></li>`);
                        }
                        $pagination.append(`<li class="page-item"><button class="page-link" value="${pagelast}">&raquo; ${pagelast+1}</button></li>`);
                    } else if (settings.pageat >= pagelast - 3) {
                        $pagination.append(`<li class="page-item"><button class="page-link" value="1">1 &laquo;</button></li>`);
                        for (var i = pagelast - 4; i <= pagelast; i++) {
                            $pagination.append(`<li class="page-item"><button class="page-link ${(settings.pageat==i)?'active':''}" value="${i}">${i+1}</button></li>`);
                        }
                    } else {
                        $pagination.append(`<li class="page-item"><button class="page-link" value="1">1 &laquo;</button></li>`);

                        for (var i = settings.pageat - 2; i < settings.pageat + 3; i++) {
                            $pagination.append(`<li class="page-item"><button class="page-link ${(settings.pageat==i)?'active':''}" value="${i}">${i+1}</button></li>`);
                        }

                        $pagination.append(`<li class="page-item"><button class="page-link" value="${pagelast}">&raquo; ${pagelast+1}</button></li>`);
                    }
                 }
            $(`#${$(this).attr("id")}-imagepicker`).find(".page-link").on("click", function (){
         	settings.pageat = Number(this.value);
             render();
         });
         $(`#${$(this).attr("id")}-imagepicker`).find("img.img-fluid").on("click", function (){
         	$this.val($(this).attr("src"));
             settings.onPick($(this).attr("src"));
             
         });
			
		}
	
	$.getScript("https://cse.google.com/cse.js?cx=d60776a4e66fa425e");
	$(document).on("click", "a.gs-previewLink, a.gs-previewVisit, a.gs-title, a.gs-image", function () {
                        this.removeAttribute("href");
                        this.removeAttribute("target");
                        if (this.className == "gs-previewLink") {
                        	let data = []
                                    if(localStorage.getItem(`#${$this.attr("id")}-imagepicker`) != null){
				data = JSON.parse(localStorage.getItem(`#${$this.attr("id")}-imagepicker`));
				}
				data.unshift($(this).find("img").attr("src"));
				localStorage.setItem(`#${$this.attr("id")}-imagepicker`, JSON.stringify(data));
                                    
                            $("div.gsc-results-close-btn").click();
                            
                            render();
                        }
                    });
      let file = undefined;
      $(`#${$(this).attr("id")}-imagepicker`).find("input[type='file']").on("change", function(){
      	file = this.files[0];
      });
	$(`#${$(this).attr("id")}-imagepicker`).find("button.upload").on("click", ()=>{
		
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
                            error: ()=>{
                            	alert("upload failed");
                            	}
                        };
                        $.ajax(setting).done((response)=>{
                        	$(`#${$(this).attr("id")}-imagepicker`).find("input[type='file']").val(null);
                            let res = JSON.parse(response);
                            if(res.success){
                            	let data = []
                                    if(localStorage.getItem(`#${this.attr("id")}-imagepicker`) != null){
				data = JSON.parse(localStorage.getItem(`#${this.attr("id")}-imagepicker`));
				}
				data.unshift(res.data.url);
				localStorage.setItem(`#${this.attr("id")}-imagepicker`, JSON.stringify(data));
                                    render();
                            }
                            else{
                            	alert("upload failed");
                            }
                        });
                    });
       
$(`#${$(this).attr("id")}-imagepicker`).find("button.import").on("click", ()=>{
	
      	let imp = $(`#${$(this).attr("id")}-imagepicker`).find("input.form-control[type='text']");
      console.log(imp.val());
      let image = new Image();
                            image.onload = function () {
                                if (this.width > 0) {
                                	let data = []
                                    if(localStorage.getItem(`#${$this.attr("id")}-imagepicker`) != null){
				data = JSON.parse(localStorage.getItem(`#${$this.attr("id")}-imagepicker`));
				}
				data.unshift(imp.val());
				localStorage.setItem(`#${$this.attr("id")}-imagepicker`, JSON.stringify(data));
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
render();
return this;
		
	};
	
})(jQuery);