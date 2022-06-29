document.querySelector("#upload_button").addEventListener('click',()=>{
    let selectFile = document.querySelector("#image_input").files[0];
    let title =document.getElementById("title").value
    let content =document.getElementById("content").value
    if (title | content == "") {
        alert('제목 또는 내용을 입력해주세요.'); 
    }
    else{
        alert("작성성공!")
    };


});

document.querySelector(".fake_input").addEventListener('click',()=>{
    $('#img_preview').empty()
})


function setThumbnail(event) {
    var reader = new FileReader();
    reader.onload = function(event) {
    var img = document.createElement("img");
    img.setAttribute("src", event.target.result);
    document.querySelector("div#img_preview").appendChild(img);
    };
    reader.readAsDataURL(event.target.files[0]);
}