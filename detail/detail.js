let bookmark_empty = document.getElementById("empty_bookmark")
let bookmark_fill = document.getElementById("fill_bookmark")
let like_empty = document.getElementById("empty_like")
let like_fill = document.getElementById("fill_like")

bookmark_empty.addEventListener('click',()=>{
    bookmark_fill.style.display = 'block';
    bookmark_empty.style.display = 'none';
    alert("저장 완료!")
})

bookmark_fill.addEventListener('click',()=>{
    bookmark_empty.style.display = 'block';
    bookmark_fill.style.display = 'none';
    alert("저장 취소 완료!")
})

like_empty.addEventListener('click',()=>{
    like_fill.style.display = 'block';
    like_empty.style.display = 'none';
    alert("좋아요 완료!")
})

like_fill.addEventListener('click',()=>{
    like_empty.style.display = 'block';
    like_fill.style.display = 'none';
    alert("좋아요 취소 완료!")
})