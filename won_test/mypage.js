const modalButton = document.querySelector(".modalButton");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".closeModal");
const modal_overlay = document.querySelector(".modal_overlay");

modalButton.addEventListener("click", () => {
    modal.classList.remove("hidden");
});
modal_overlay.addEventListener("click", () => {
    modal.classList.add("hidden");
});

const BASE_URL = 'http://127.0.0.1:8000';
const user_id = 5;


const myimg_list = document.querySelector('.myimg_list');
window.onload = async function(){
    console.log("ggg")
    if (!localStorage.hasOwnProperty('access')) {
        location.replace('/Kotest/sign_page.html')
    }

    token = localStorage.getItem('access');
    const myposts = await fetch(BASE_URL + '/won_test/mypage/' + user_id,{
        method:'GET',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Authorization": `Bearer ${token}`,
        }
        

    })
    let response = await myposts.json()
  
    if (myposts.status==200){
        myposts_html = ``;
        for (let i = 1; i < response.posts.length+1; i++){
            console.log(response.posts.length)
            if (i % 4 == 1){
                myposts_html += `<div class="ml_div">
                                    <img class="ml_same ml_1" src="${response.posts[i-1].img_url}">`
            }else if (i%4==2){
                myposts_html +=`<img class="ml_same ml_2" src="${response.posts[i-1].img_url}"></div>`
            }else if (i%4 ==3){
                myposts_html +=`<div class="ml_div">
                                <img class="ml_same ml_3" src="${response.posts[i-1].img_url}">`
            }else if (i%4 == 0){
                myposts_html += `<img class="ml_same ml_4" src="${response.posts[i-1].img_url}"></div>`
            }
        }
        myimg_list.innerHTML =  myposts_html;
    } else {
        location.replace('/Kotest/sign_page.html')
    }
}


// window.onscroll = function() {
//     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
//         // $.ajax({
//         //     url: "{% url 'ajax_method' %}",
//         //     type: "GET",
//         //     datatype: 'json',
//         //     success: function(){
//         //         let test1 = document.getElementById('#scroll')

//         //     }


//         // }

//         )
//     }


// }
